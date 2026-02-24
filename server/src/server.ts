import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/task.routes.js";

import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Application is healthy!" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/task", taskRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening to ${PORT}`);
});
