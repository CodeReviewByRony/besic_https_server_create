const emailRegex = /^[^s@]+@[^s@]+.[^s@]{2,}$/;

const emailCheker = (email) => {
  return emailRegex.test(email);
};
