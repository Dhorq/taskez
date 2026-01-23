import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { createUser } from "../services/authServices";
import { signToken } from "../utils/jwt";

interface RegisterBody {
  email: string;
  name: string;
  password: string;
}

export async function register(
  req: Request<{}, {}, RegisterBody>,
  res: Response,
): Promise<void> {
  try {
    const { email, name, password } = req.body;

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

    const token = signToken({ userId: newUser.id });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User successfully created",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
