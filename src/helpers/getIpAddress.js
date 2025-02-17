export const getPublicIpAddress = async () => {
  const reponse = await fetch("https://api.ipify.org?format=json");
  const data = await reponse.json();
  return data.ip;
};
