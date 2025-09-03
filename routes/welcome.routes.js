import express from "express";
import { sendWelcomeEmail } from "../controllers/welcome.controller.js";

const router = express.Router();

// Route POST
router.post("/welcome", sendWelcomeEmail);

export default router;
