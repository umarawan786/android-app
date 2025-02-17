import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { supabase } from "../../lib/supabase";

export const useGifs = () => {
  const { session } = useAuth();

  if (!session) {
    throw new Error("No session");
  }

  return useQuery({
    queryKey: ["profile_gifs", session.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_gifs")
        .select("one, two, three, four")
        .eq("profile_id", session.user.id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const useUpdateGifs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user_id, column_name, column_value }) => {
      console.log("id:", user_id);
      // Check if profile already exists
      const { data: existingEntry, error: selectError } = await supabase
        .from("profile_gifs")
        .select("id")
        .eq("profile_id", user_id)
        .maybeSingle();

      if (selectError) {
        console.error(selectError);
        throw new Error(selectError);
      }

      if (existingEntry) {
        console.log("existing", existingEntry);
        const { id } = existingEntry;
        const { data, error } = await supabase
          .from("profile_gifs")
          .update({
            profile_id: user_id,
            [column_name]: column_value,
          })
          .eq("id", id);

        if (error) {
          throw new Error(error.message);
        }
      } else {
        console.log("non existent");
        const { data, error } = await supabase.from("profile_gifs").insert({
          profile_id: user_id,
          [column_name]: column_value,
        });

        if (error) {
          throw new Error(error.message);
        }
      }
      return user_id;
    },
    onSuccess: async (user_id) => {
      await queryClient.invalidateQueries(["profile_gifs", user_id]);
    },
  });
};

export const useFriendsGifs = (friendId) => {
  return useQuery({
    queryKey: ["profile_gifs", friendId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_gifs")
        .select("one, two, three, four")
        .eq("profile_id", friendId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
