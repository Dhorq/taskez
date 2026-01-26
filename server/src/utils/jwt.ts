import { NextFunction, Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import logger from "../config/logger";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export interface JwtPayload {
  userId: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    req.user = {
      id: payload.userId,
    };

    next();
  } catch (error) {
    logger.error("Failed to authenticate", { error });
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const signToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: "1d" };

  return jwt.sign(payload, JWT_SECRET, options);
};
