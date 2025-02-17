import { supabase } from "../../lib/supabase";

export const uploadEvidence = async (
  evidenceData,
  guardianId,
  childId,
  fileExtension
) => {
  const { data, error } = await supabase.storage
    .from("evidence")
    .upload(
      `${guardianId}/${childId}/${new Date().getTime()}.${fileExtension}`,
      evidenceData,
      {
        cacheControl: 3600,
        upsert: false,
      }
    );

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    return data;
  }
};
