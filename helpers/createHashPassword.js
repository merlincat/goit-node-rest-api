import bcrypt from "bcrypt";

const createHashedPassword = async (password) => {
  const result = await bcrypt.hash(password, 10);
  return result;
};

export default createHashedPassword;
