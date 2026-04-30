import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    mobile: String,
    role: String,
    message: String,
    attachment: {
  type: String,
},
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Enquiry ||
mongoose.model("Enquiry", enquirySchema);