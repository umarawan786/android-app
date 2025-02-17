export const createChildAccount = async (email, password, metadata_obj) => {
  const payload = {
    email,
    password,
    data: metadata_obj,
  };

  response = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(payload),
    }
  );
  return response;
};
