import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};
