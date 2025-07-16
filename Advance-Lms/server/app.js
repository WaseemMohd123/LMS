import express from "express";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";
import errorMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";
import paymentRouter from "./routes/paymentRoutes.js";

import chatbotRouter from "./routes/ChatBotRoutes.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "https://sdk.cashfree.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);
app.use("/api/chatbot", chatbotRouter);
app.use("/api/payment", paymentRouter);

app.use(errorMiddleware);

export default app;
