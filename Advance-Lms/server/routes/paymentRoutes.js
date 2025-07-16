import express from "express";
import { processPayment } from "../controllers/paymentController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, processPayment);

export default router;
