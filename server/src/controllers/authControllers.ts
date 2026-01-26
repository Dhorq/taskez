import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";

import { createUser, findUserByEmail } from "../services/authServices";
import { signToken } from "../utils/jwt";

import {
  loginUserSchema,
  registerUserSchema,
} from "./../validations/userValidation";
import { userResponseSchema } from "../validations/user.response.schema";
import logger from "./../config/logger";
import { loginSchema } from "../validations/login.schema";

interface RegisterBody {
  email: string;
  name: string;
  password: string;
}

interface LoginBody {
  email: string;
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

export async function login(
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    (logger.info("Login attempt"),
      {
        email: req.body.email,
        ip: req.ip,
      });

    const { email, password } = loginUserSchema.parse(req.body);

    const user = await findUserByEmail(email);

    if (!user) {
      logger.warn("Login failed: user not found", { email });

      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn("Login failed: wrong password", {
        userId: user.id,
        email,
      });

      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    logger.info("User logged in successfully", {
      userId: user.id,
      email: user.email,
    });

    const token = signToken({ userId: user.id });

    const response = loginSchema.parse({
      email: user.email,
      name: user.name,
      token,
    });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Successfully logged in",
      data: response,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "strict",
    });

    logger.info("User logged out successfully", {
      userId: req.user.id,
    });

    res.json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
}
