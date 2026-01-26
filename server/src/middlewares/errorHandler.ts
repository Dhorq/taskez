// middlewares/errorHandler.ts
import { ZodError } from "zod";

import logger from "../config/logger";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // ZOD ERROR
  if (err instanceof ZodError) {
    logger.warn("Validation error", {
      path: req.path,
      errors: err.flatten().fieldErrors,
    });

    return res.status(400).json({
      message: "Validation error",
      errors: err.flatten().fieldErrors,
    });
  }

  // NORMAL ERROR
  if (err instanceof Error) {
    logger.error("Unexpected error", {
      path: req.path,
      message: err.message,
      stack: err.stack,
    });

    return res.status(500).json({
      message: err.message,
    });
  }

  // UNKNOWN
  logger.error("Unknown error", {
    path: req.path,
    error: err,
  });

  return res.status(500).json({
    message: "Internal server error",
  });
};
