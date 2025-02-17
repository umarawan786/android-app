import { supabase } from "../../lib/supabase";

export const uploadVideDeclaration = async (
  videoData,
  profileId,
  fileExtension
) => {
  const { data, error } = await supabase.storage
    .from("declarations")
    .upload(
      `${profileId}/${new Date().getTime()}.${fileExtension}`,
      videoData,
      {
        cacheControl: 3600,
        upsert: false,
        contentType: "video/*",
      }
    );

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    return data;
  }
};
