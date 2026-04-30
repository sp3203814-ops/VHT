import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import tutorRoutes from "./routes/tutorRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
export default app;