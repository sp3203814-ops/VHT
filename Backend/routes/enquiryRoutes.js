import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { createEnquiry } from "../Controllers/enquiryController.js";

const router = express.Router();

router.post(
  "/",
  upload.single("attachment"),
  createEnquiry
);

export default router;