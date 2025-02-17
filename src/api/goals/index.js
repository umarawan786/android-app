import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";

export const useGoals = (user_id) => {
  return useQuery({
    queryKey: ["goals", user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("profile_id", user_id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const useUpdateGoals = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user_id, goal_name, image_url }) => {
      // Check if goal already exists
      const { data, error } = await supabase
        .from("goals")
        .select("id")
        .eq("profile_id", user_id)
        .maybeSingle();

      if (error) {
        throw new Error(error);
      }

      if (data) {
        const { id } = data;
        const { error: updateError } = await supabase
          .from("goals")
          .update({
            goal: goal_name || "",
            imageUrl: image_url || "",
          })
          .eq("id", id);

        if (updateError) {
          throw new Error(updateError);
        }
      } else {
        const { data, error: insertError } = await supabase
          .from("goals")
          .insert({
            profile_id: user_id,
            goal: goal_name || "",
            imageUrl: image_url || "",
          });

        if (insertError) {
          throw new Error(insertError.message);
        }
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(["goals", profile.id]);
    },
  });
};
