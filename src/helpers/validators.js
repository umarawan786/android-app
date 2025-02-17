export const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const validateEmail = (email) => {
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email." };
  } else {
    return { isValid: true, message: "Valid email." };
  }
};

export const validatePassword = (password, name, email) => {
  // Construct a name regex to check if the password contains the user's name or email
  const nameRegex = new RegExp(`(${name}|${email.split("@")[0]})`, "i");

  // Check password's length
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  // Check if the password contains the user's name or email
  if (nameRegex.test(password)) {
    return {
      isValid: false,
      message: "Password cannot contain your name or email",
    };
  }

  // Check if the password contains a number or symbol
  if (!/[0-9!@#$%^&*]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain a number or symbol",
    };
  }

  // Check if the password contains spaces
  if (/\s/.test(password)) {
    return {
      isValid: false,
      message: "Password cannot contain spaces",
    };
  }

  return { isValid: true, message: "Valid password" };
};

export const validateDOB = (dob) => {
  const dobRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format

  // Check if empty
  if (dob === "") {
    return { isValid: false, message: "Please enter your date of birth." };
  }

  // Check if the format is correct
  if (!dobRegex.test(dob)) {
    return { isValid: false, message: "Invalid date format. Use YYYY-MM-DD." };
  }

  // Parse the date components
  const [year, month, day] = dob.split("-").map(Number);
  const dobDate = new Date(year, month - 1, day);

  // Check if the date is valid
  if (
    dobDate.getFullYear() !== year ||
    dobDate.getMonth() + 1 !== month ||
    dobDate.getDate() !== day
  ) {
    return { isValid: false, message: "Invalid date." };
  }

  // Check the age range
  const today = new Date();
  const age =
    today.getFullYear() -
    year -
    (today.getMonth() < month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() < day)
      ? 1
      : 0);

  if (age < 0 || age > 120) {
    return { isValid: false, message: "Age must be between 0 and 120 years." };
  }

  return { isValid: true, message: "Valid date of birth." };
};
