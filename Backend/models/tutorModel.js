import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    mobile: String,
    subject: String,
    experience: String,
     resume: {
    type: String,
  },
  },
  
  {
    timestamps: true
  }
);

export default mongoose.models.TutorApplication ||
mongoose.model("TutorApplication", tutorSchema);