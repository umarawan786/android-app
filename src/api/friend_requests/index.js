import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

export const useFriendRequestData = (request_id) => {
  // Fetch name and avatar location of sender and receiver

  // console.log("request id: ")

  return useQuery({
    queryKey: ["request", request_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("friend_requests")
        .select("sender_id, receiver_id, status")
        .eq("id", request_id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const { data: dataProfile, error: errorProfile } = await supabase
        .from("profiles")
        .select("first_name, avatar_file_location")
        .or(`id.eq.${data.sender_id}, id.eq.${data.receiver_id}`);

      if (errorProfile) {
        throw new Error(errorProfile.message);
      }

      return [dataProfile, data];
    },
  });
};
