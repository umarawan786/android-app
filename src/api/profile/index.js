import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";

export const updateOnboardingStatus = async (user_id, new_status = true) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      onboarding_complete: new_status,
    })
    .eq("id", user_id);

  if (error) throw error;
  return data;
};

export const updateNumberOfChildAccountsCreated = async (
  user_id,
  new_number
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      number_of_child_accounts_created: new_number,
    })
    .eq("id", user_id);

  if (error) throw error;
  return data;
};

export const useFamilyTitle = () => {
  const { session } = useAuth();

  if (!session) {
    throw new Error("No session");
  }

  if (!session.user) {
    throw new Error("No user on session");
  }

  return useQuery({
    queryKey: ["profiles", "family_name"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("family_name")
        .eq("id", session.user.id);

      if (error) {
        throw new Error(error.message);
      }

      return data[0];
    },
  });
};

export const useUpdateFamilyTitle = () => {
  const { session } = useAuth();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ new_family_name }) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          family_name: new_family_name,
        })
        .eq("id", session.user.id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["profiles", "family_name"]);
    },
  });
};

export const useChildrenInfo = () => {
  const { session } = useAuth();

  if (!session) {
    throw new Error("No session");
  }

  if (!session.user) {
    throw new Error("No user on session");
  }

  return useQuery({
    queryKey: ["children"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("guardian_id", session.user.id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const useProfile = (profile_id) => {
  const { session } = useAuth();

  if (!session) {
    throw new Error("No session");
  }

  const p_id = profile_id || session.user.id;

  return useQuery({
    queryKey: ["profile", p_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", p_id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
