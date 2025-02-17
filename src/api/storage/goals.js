import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";

export const uploadGoalImage = async (goalData, fileName) => {
  const { data, error } = await supabase.storage
    .from("goals")
    .upload(fileName, goalData, {
      cacheControl: 3600,
      upsert: false,
      contentType: "image/*",
    });

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    return data;
  }
};

export const useInsertNewGoal = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalName, filePath }) => {
      const { error } = await supabase.from("goals").insert({
        profile_id: profile.id,
        goal: goalName,
        imageUrl: filePath,
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(["goals", profile.id]);
    },
  });
};

export const useMyGoals = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["goals", profile.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("profile_id", profile.id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const useGoalImage = (imageUrl) => {
  // imageUrl is the file path of the image in the storage bucket

  return useQuery({
    queryKey: ["goalImage", imageUrl],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from("goals")
        .getPublicUrl(imageUrl);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
