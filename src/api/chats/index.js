import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { supabase } from "../../lib/supabase";

export const useMyChats = () => {
  return useQuery({
    queryKey: [],
    queryFn: async () => {},
  });
};

export const useCreateNewChatRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, isGroup, participants }) => {
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "get_common_chat",
        { user_ids: participants }
      );

      if (rpcError) {
        console.error(rpcError);
        throw new Error(rpcError.message);
      }

      if (rpcData !== null) {
        // Chatroom already exists
        console.log("Chatroom aleary exists. Returning chat_id =", rpcData);
        return rpcData;
      }

      // Insert into chat
      const { data: chat, error } = await supabase
        .from("chats")
        .insert({
          title,
          is_group: isGroup,
        })
        .select();

      if (error) {
        console.error("Error creating chat:", error.message);
        throw new Error(error.message);
      }

      // Add participants
      const chatId = chat[0].id;
      const participantData = participants.map((userId) => ({
        chat_id: chatId,
        user_id: userId,
      }));

      const { _, error: participantsError } = await supabase
        .from("chat_participants")
        .insert(participantData);

      if (participantsError) {
        console.error(participantsError.message);
        throw new Error("Error adding participants");
      }

      return chat[0].id;
    },
    onSuccess: async (chatroom_id) => {
      await queryClient.invalidateQueries(["chatroom", chatroom_id]);
    },
  });
};

export const useChatRoomInfo = (chatroom_id) => {
  return useQuery({
    queryKey: ["chatroom", chatroom_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_participants")
        .select("user_id, role, chats(title, is_group)")
        .eq("chat_id", chatroom_id);

      if (error) {
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        return null;
      }

      const chatInfo = {
        chat_info: {
          is_group: data[0].chats.is_group,
          title: data[0].chats.title,
        },
        participants: data.map(({ role, user_id }) => ({ role, user_id })),
      };

      return chatInfo;
    },
  });
};

export const useMessages = (chatroom_id) => {
  return useQuery({
    queryKey: ["messages", chatroom_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatroom_id)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    refetchInterval: 30_000, // 30 seconds
  });
};

export const useInsertMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ chat_id, sender_id, content, text_color }) => {
      const { data, error } = await supabase
        .from("messages")
        .insert([{ chat_id, sender_id, content, text_color }]);

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries(["messages", variables.chat_id]);
    },
  });
};

export const useReportMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reported_by, chat_id, message_id, reason }) => {
      const { data, error } = await supabase.from("reports").insert([
        {
          reported_by,
          chat_id,
          message_id,
          reason,
        },
      ]);

      if (error) throw new Error(error.message);

      const { error: updateError } = await supabase
        .from("messages")
        .update({
          reported: true,
        })
        .eq("id", message_id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["messages", variables.chat_id]);
    },
  });
};
