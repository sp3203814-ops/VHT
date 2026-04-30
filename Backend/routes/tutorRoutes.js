import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { applyTutor } from "../controllers/tutorController.js";

const router = express.Router();

router.post(
  "/apply",
  upload.single("resume"),
  applyTutor
);

export default router;