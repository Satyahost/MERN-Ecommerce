import express from "express";
import { chatWithAI } from "../controller/aiController.js";

const router = express.Router();

// Authentication is optional in Phase 1 so the assistant can be opened by guests.
router.route("/ai/chat").post(chatWithAI);

export default router;
