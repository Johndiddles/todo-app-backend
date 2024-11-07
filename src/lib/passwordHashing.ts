import bcrypt from "bcrypt";

export const hashPassword = async (str: string): Promise<string> => {
  const saltRounds = 10;
  const hashedString = await bcrypt.hash(str, saltRounds);
  return hashedString;
};

export const comparePassword = async (
  plainText: string,
  hashedString: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(plainText, hashedString);
  return isMatch;
};
