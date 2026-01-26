import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";

import { createUser } from "../services/authServices";
import { signToken } from "../utils/jwt";

import { registerUserSchema } from "./../validations/userValidation";
import { userResponseSchema } from "../validations/user.response.schema";
import logger from "./../config/logger";

interface RegisterBody {
  email: string;
  name: string;
  password: string;
}

export async function register(
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    logger.info("Register attempt", {
      email: req.body.email,
      ip: req.ip,
    });

    const { email, name, password } = registerUserSchema.parse(req.body);

    if (
      typeof email !== "string" ||
      typeof name !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({ success: false, message: "All fields required" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(email, name, hashedPassword);

    logger.info("User registered successfully", {
      userId: newUser.id,
      email: newUser.email,
    });

    const token = signToken({ userId: newUser.id });

    const response = userResponseSchema.parse(newUser);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User successfully created",
      data: response,
    });
  } catch (error) {
    next(error);
  }
}
