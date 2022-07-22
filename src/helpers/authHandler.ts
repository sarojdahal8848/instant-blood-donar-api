import bcrypt from "bcrypt";
import { JwtPayload } from "../dto";
import jwt from "jsonwebtoken";
import { EXPIRY_TIME, JWT_SECRET } from "../config";

export const generateSalt = async () => {
  return await bcrypt.genSalt(10);
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await generateSalt();
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  hashPassword: string,
  normalPassword: string
): Promise<boolean> => {
  const salt = await generateSalt();
  return await bcrypt.compare(normalPassword, hashPassword);
};

export const jwtSign = (user: JwtPayload) => {
  const payload = {
    username: user.username,
    _id: user._id,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRY_TIME });
};
