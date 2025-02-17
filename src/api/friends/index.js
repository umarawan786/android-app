import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { supabase } from "../../lib/supabase";

export const useMyFriends = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["friends", profile.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("friendships")
        .select("*")
        .or(`child_1.eq.${profile.id}, child_2.eq.${profile.id}`);

      if (error) {
        throw new Error(error.message);
      }

      // data = [{child_1, child_2, created_at, id}, ...]

      // Extract the IDs of the other friends
      const friendIds = data.map((friendship) =>
        friendship.child_1 === profile.id
          ? friendship.child_2
          : friendship.child_1
      );

      if (friendIds.length === 0) return [];

      // Fetch profile details for the friends
      const { data: friendProfiles, error: profileError } = await supabase
        .from("profiles")
        .select(
          `
          id, 
          first_name, 
          avatar_file_location, 
          profile_gifs(
            one,
            two
          )`
        )
        .in("id", friendIds);

      if (profileError) {
        throw new Error(profileError.message);
      }

      return friendProfiles;
    },
  });
};
