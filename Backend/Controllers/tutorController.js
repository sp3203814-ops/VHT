import TutorApplication from "../models/tutorModel.js";

export const applyTutor = async (req, res) => {
  try {
    const tutor = await TutorApplication.create({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      subject: req.body.subject,
      experience: req.body.experience,
      resume: req.file ? req.file.path : "",
    });

    res.status(201).json({
      message: "Tutor Application Submitted Successfully",
      tutor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};