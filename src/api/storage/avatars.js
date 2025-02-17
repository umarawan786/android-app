import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

export const uploadAvatar = async (avatarData, fileName) => {
  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatarData, {
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

const fetchAvatarSignedUrl = async (location, ttl = 60) => {
  const { data, error } = await supabase.storage
    .from("avatars")
    .createSignedUrl(location, ttl);

  if (error) {
    throw new Error(error.message);
  }

  return data.signedUrl;
};

export const useAvatarSignedUrl = (location, ttl = 60) => {
  return useQuery({
    queryKey: ["avatarSignedUrl", location],
    queryFn: () => fetchAvatarSignedUrl(location, ttl),
    staleTime: ttl * 1000, // Cache is considered fresh for `ttl` seconds
    cacheTime: ttl * 2 * 1000, // Cache is retained for twice the TTL
    refetchInterval: ttl * 1000, // Refetch the data just before expiration
    onError: (error) => {
      console.error("Error fetching avatar signed URL:", error);
    },
  });
};
