import ContactMessage from "../models/ContactMessage.js";

export const sendContactMessage = async (req, res) => {
  try {
    console.log(req.body);

    const message = await ContactMessage.create(req.body);

    res.status(201).json({
      success: true,
      message: "Message saved successfully",
      data: message,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};