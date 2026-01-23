import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export interface JwtPayload {
  userId: any;
}

export const signToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: "1d" };

  return jwt.sign(payload, JWT_SECRET, options);
};
