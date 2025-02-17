import { supabase } from "../../lib/supabase";

export const checkOTP = async (otp) => {
  const { data, error } = await supabase
    .from("otp_requests")
    .select("*")
    .eq("otp", otp)
    .gt("expires_at", new Date().toISOString());

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteOTP = async (otp) => {
  const response = await supabase.from("otp_requests").delete().eq("otp", otp);

  if (response.status != 204) {
    throw new Error(response.statusText);
  }

  return response.status;
};
