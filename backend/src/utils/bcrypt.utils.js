import { hash, compare } from "bcrypt";

export const hashPassword = async (password) => {
  const saltRounds = 12;

  const hashed = hash(password, saltRounds);
  return hashed;
};

export const comparePassword = async (password, hashedPassword) => {
  const compared = compare(password, hashedPassword);
  return compared;
};
