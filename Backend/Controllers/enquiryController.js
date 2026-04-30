import Enquiry from "../models/Enquiry.js";

export const createEnquiry = async (req, res) => {
  try {
   const enquiry = await Enquiry.create({
  name: req.body.name,
  email: req.body.email,
  mobile: req.body.mobile,
  role: req.body.role,
  message: req.body.message,
  attachment: req.file ? req.file.path : "",
});

    res.status(201).json({
      message: "Enquiry Submitted Successfully",
      enquiry,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};