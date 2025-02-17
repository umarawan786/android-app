export const constructChildEmail = (guardianEmail, childName) => {
  const email = childName.replaceAll(" ", "_") + "|" + guardianEmail;
  return email;
};
