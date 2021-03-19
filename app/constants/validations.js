export const regex = {
  alphaNumeric: /^([a-zA-Z0-9]+)$/,
  email: /^\S+@\S+$/,
};

export const maxCharactersUsername = 30;
export const minCharactersUsername = 3;
export const maxCharactersPassword = 50;
export const minCharactersPassword = 12;

export const validationMessages = {
  longUsername: `Username cannot exceed ${maxCharactersUsername} characters`,
  longPassword: `Password cannot exceed ${maxCharactersPassword} characters`,
  alphaNumericUsername: "Username can only contain letters and numbers.",
  shortUsername: `Username must be at least ${minCharactersUsername} characters`,
  shortPassword: `Password must be at least ${minCharactersPassword} characters`,
  notUniqueUsername: "That username is already taken",
  validEmail: "You must provide a valid email address.",
  notUniqueEmail: "That email is already being used.",
};
