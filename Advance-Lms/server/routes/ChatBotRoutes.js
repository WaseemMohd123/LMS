import express from "express";
import ChatBotController from "../controllers/ChatBotController.js";

const router = express.Router();

router.post("/chat", ChatBotController);

export default router;
