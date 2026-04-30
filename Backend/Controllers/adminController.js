import ContactMessage from "../models/ContactMessage.js";
import Enquiry from "../models/Enquiry.js";
import TutorApplication from "../models/tutorModel.js";

export const getDashboardData = async (req, res) => {
  const contacts = await ContactMessage.find().sort({ createdAt: -1 });
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  const tutors = await TutorApplication.find().sort({ createdAt: -1 });

  res.json({ contacts, enquiries, tutors });
};