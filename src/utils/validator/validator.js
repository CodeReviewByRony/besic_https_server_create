const emailRegex = /^[^s@]+@[^s@]+.[^s@]{2,}$/;
export const emailCheker = (email) => {
  return emailRegex.test(email);
};

const passwordRegex = /^.{8,}$/;
export const passwordCheker = (password) => {
  return passwordRegex.test(password);
};
