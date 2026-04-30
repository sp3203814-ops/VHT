import app from "../server.js";

export default app;

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;

import ContactMessage from "../models/ContactMessage.js";
import Enquiry from "../models/Enquiry.js";
import TutorApplication from "../models/tutorModel.js";

export const getDashboardData = async (req, res) => {
  const contacts = await ContactMessage.find().sort({ createdAt: -1 });
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  const tutors = await TutorApplication.find().sort({ createdAt: -1 });

  res.json({ contacts, enquiries, tutors });
};

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, user.isAdmin),
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id, user.isAdmin),
      });
    } else {
      res.status(401).json({
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

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

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "No token found" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "vedanta_uploads",
    allowed_formats: ["jpg", "png", "jpeg", "pdf", "doc", "docx"],
  },
});

const upload = multer({ storage });

export default upload;

import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    mobile: String,
    message: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ContactMessage ||
mongoose.model("ContactMessage", contactSchema);

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

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

import express from "express";
import { getDashboardData } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getDashboardData);

export default router;

import express from "express";
import {
  registerUser,
  loginUser
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;

import express from "express";
import { sendContactMessage } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", sendContactMessage);

export default router;

import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { createEnquiry } from "../controllers/enquiryController.js";

const router = express.Router();

router.post(
  "/",
  upload.single("attachment"),
  createEnquiry
);

export default router;

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

import jwt from "jsonwebtoken";

const generateToken = (id, isAdmin) => {
  return jwt.sign(
    { id, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

export default generateToken;

PORT=5000
FRONTEND_URL=https://vht-frontend.vercel.app
# MONGO_URI=mongodb://127.0.0.1:27017/vedanta
MONGO_URI=mongodb+srv://sk_vedanta:sk_vedanta@cluster0.zckujux.mongodb.net/
JWT_SECRET=mysecret123

CLOUDINARY_CLOUD_NAME=dzkbzzjex
CLOUDINARY_API_KEY=299996137713778
CLOUDINARY_API_SECRET=qhqReRwIyeAVP56NIXhNT6ijQms

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

{
  "version": 2,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}


FRONTEND CODES 

import React, { useState } from "react";

export default function LoginModal() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // YAHAN likhna hai
        localStorage.setItem("userInfo", JSON.stringify(data));

        alert("Login Successful");

        window.location.reload();
      } else {
        alert(data.message || "Login Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <dialog id="login_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Login</h3>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input input-bordered w-full mb-4"
          onChange={handleChange}
        />

        <button
          onClick={handleLogin}
          className="btn btn-primary w-full"
        >
          Login
        </button>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
   const API = import.meta.env.VITE_API_URL; 
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || null;

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async () => {
    try {
      const res =await fetch(`${API}/api/auth/register`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(signupData),
});

      const data = await res.json();

      if (res.ok) {
        alert("Signup Successful. Please Login.");
        setIsSignupOpen(false);
        setIsLoginOpen(true);
      } else {
        alert(data.message || "Signup Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userInfo", JSON.stringify(data));

        alert("Login Successful");
        setIsLoginOpen(false);

        if (data.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          window.location.reload();
        }
      } else {
        alert(data.message || "Login Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <div className="navbar sticky top-0 z-50 px-4 md:px-10 py-3 bg-white/80 backdrop-blur-xl shadow-lg border-b border-base-200">

        {/* Left */}
        <div className="navbar-start">

          {/* Mobile Menu */}
          <div className="dropdown lg:hidden">
            <label tabIndex={0} className="btn btn-ghost text-2xl">
              ☰
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[100] p-3 shadow-xl bg-base-100 rounded-xl w-60"
            >
              <li><Link to="/">Home</Link></li>
              <li><Link to="/find-tutor">Find Tutor</Link></li>
              <li><Link to="/become-tutor">Become Tutor</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>

              {!userInfo ? (
                <>
                  <li>
                    <button onClick={() => setIsSignupOpen(true)}>
                      Signup
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setIsLoginOpen(true)}>
                      Login
                    </button>
                  </li>
                </>
              ) : (
                <>
                  {userInfo?.isAdmin && (
                    <li>
                      <button onClick={() => navigate("/admin/dashboard")}>
                        Dashboard
                      </button>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Logo */}
          <Link
            to="/"
            className="text-xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse"
          >
            VedantaHomeTutorial
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-3 font-medium">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/find-tutor">Find Tutor</Link></li>
            <li><Link to="/become-tutor">Become Tutor</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Right Side Desktop */}
        <div className="navbar-end hidden lg:flex gap-3">
          {!userInfo ? (
            <>
              <button
                onClick={() => setIsSignupOpen(true)}
                className="btn btn-outline"
              >
                Signup
              </button>

              <button
                onClick={() => setIsLoginOpen(true)}
                className="btn bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-none"
              >
                Login
              </button>
            </>
          ) : (
            <>
              {userInfo?.isAdmin && (
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="btn btn-primary"
                >
                  Dashboard
                </button>
              )}

              <button
                onClick={handleLogout}
                className="btn btn-outline"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Signup Modal */}
      {isSignupOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-xl mb-4">Signup</h3>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="input input-bordered w-full mb-3"
              onChange={handleSignupChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered w-full mb-3"
              onChange={handleSignupChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered w-full mb-4"
              onChange={handleSignupChange}
            />

            <button
              onClick={handleSignup}
              className="btn btn-primary w-full"
            >
              Signup
            </button>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setIsSignupOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-xl mb-4">Login</h3>

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered w-full mb-3"
              onChange={handleLoginChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered w-full mb-4"
              onChange={handleLoginChange}
            />

            <button
              onClick={handleLogin}
              className="btn btn-primary w-full"
            >
              Login
            </button>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setIsLoginOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

import { useEffect, useState } from "react";

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const data = [
    {
      name: "Aniket Sinha",
      role: "Student",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      text: "Excellent platform for students and teachers. Highly recommended!",
    },
    {
      name: "Ravi Pandey",
      role: "Parent",
      img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
      text: "Very professional and helpful tutors. My child improved a lot.",
    },
    {
      name: "Sonam Kumari",
      role: "Student",
      img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
      text: "Best home tutoring service experience. Easy and reliable platform.",
    },
    {
      name: "Aniket Sinha",
      role: "Student",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      text: "Excellent platform for students and teachers. Highly recommended!",
    },
    {
      name: "Ravi Pandey",
      role: "Parent",
      img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
      text: "Very professional and helpful tutors. My child improved a lot.",
    },
    {
      name: "Sonam Kumari",
      role: "Student",
      img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
      text: "Best home tutoring service experience. Easy and reliable platform.",
    },
  ];

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % data.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-base-200">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          What Our Students Say
        </h2>
        <p className="text-lg">
          Real experiences from students and parents who trust our tutors.
        </p>
      </div>

      {/* Carousel */}
      <div className="max-w-xl mx-auto relative">
        <div className="card bg-base-100 shadow-2xl transition-all duration-500">
          <div className="card-body items-center text-center">
            <img
              src={data[index].img}
              alt={data[index].name}
              className="w-20 h-20 rounded-full object-cover border-4 border-primary"
            />
            <p className="mt-4 text-lg">{data[index].text}</p>
            <div className="mt-2 text-yellow-400">⭐⭐⭐⭐⭐</div>
            <h4 className="font-bold mt-2">{data[index].name}</h4>
            <span className="text-sm text-gray-500">
              {data[index].role}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() =>
              setIndex((index - 1 + data.length) % data.length)
            }
            className="btn btn-circle"
          >
            ❮
          </button>
          <button
            onClick={() =>
              setIndex((index + 1) % data.length)
            }
            className="btn btn-circle"
          >
            ❯
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-4 gap-2">
          {data.map((_, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                i === index ? "bg-primary" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useState } from "react";
import { Users, BookOpen, Mail, UserCheck, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function AdminDashboard() {
  const [data, setData] = useState({
    users: [],
    tutors: [],
    enquiries: [],
    contacts: [],
  });
   const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      // agar login nahi hai ya admin nahi hai
      if (!userInfo || !userInfo.isAdmin) {
        navigate("/");
        return;
      }

      const res = await fetch("http://localhost:5000/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const result = await res.json();

      setData({
        users: result.users || [],
        tutors: result.tutors || [],
        enquiries: result.enquiries || [],
        contacts: result.contacts || [],
      });
    } catch (error) {
      console.log(error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, [navigate]);

  const handleEdit = (id, type) => {
    alert(`Edit ${type} with ID: ${id}`);
  };

  const handleDelete = (id, type) => {
    alert(`Delete ${type} with ID: ${id}`);
  };

  const stats = [
    {
      title: "Users",
      count: data.users.length,
      icon: <Users size={28} />,
    },
    {
      title: "Tutors",
      count: data.tutors.length,
      icon: <UserCheck size={28} />,
    },
    {
      title: "Enquiries",
      count: data.enquiries.length,
      icon: <BookOpen size={28} />,
    },
    {
      title: "Contacts",
      count: data.contacts.length,
      icon: <Mail size={28} />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-base-100 rounded-2xl shadow-lg p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-sm opacity-70">{item.title}</p>
                <h2 className="text-3xl font-bold">{item.count}</h2>
              </div>
              <div>{item.icon}</div>
            </div>
          ))}
        </div>

        <div className="bg-base-100 rounded-2xl shadow-lg p-6 overflow-x-auto mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tutor Applications</h2>

          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.tutors.map((tutor) => (
                <tr key={tutor._id}>
                  <td>{tutor.name}</td>
                  <td>{tutor.email}</td>
                  <td>{tutor.subject}</td>

                  <td>
  <a
    href={tutor.resume}
    target="_blank"
    rel="noreferrer"
    className="btn btn-sm"
  >
    View File
  </a>
</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleEdit(tutor._id, "Tutor")}
                      className="btn btn-sm btn-primary"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(tutor._id, "Tutor")}
                      className="btn btn-sm btn-error"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-lg p-6 overflow-x-auto mb-8">
          <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>

          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? "Admin" : "User"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-lg p-6 overflow-x-auto mb-8">
  <h2 className="text-2xl font-semibold mb-4">Enquiries</h2>

  <table className="table w-full">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Attachment</th>
      </tr>
    </thead>

    <tbody>
      {data.enquiries.map((item) => (
        <tr key={item._id}>
          <td>{item.name}</td>
          <td>{item.email}</td>
          <td>{item.role}</td>

          <td>
            {item.attachment ? (
              <a
                href={item.attachment}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm"
              >
                View File
              </a>
            ) : (
              "No File"
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        <div className="bg-base-100 rounded-2xl shadow-lg p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">Contact Messages</h2>

          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {data.contacts.map((contact) => (
                <tr key={contact._id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";

export default function BecomeTutor() {
  // Only Form DB Connection
 const [formData, setFormData] = useState({
  name: "",
  email: "",
  mobile: "",
  subject: "",
  experience: "",
  resume: null,
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const form = new FormData();

    for (let key in formData) {
      form.append(key, formData[key]);
    }

    const res = await fetch("http://localhost:5000/api/tutor/apply", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (res.ok) {
      alert("Application Submitted Successfully!");

      setFormData({
        name: "",
        email: "",
        mobile: "",
        subject: "",
        experience: "",
        resume: null,
      });
    } else {
      alert(data.message || "Something went wrong");
    }
  } catch (error) {
    console.log(error);
    alert("Server Error");
  }
};

  return (
    <div className="min-h-screen bg-base-200 py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* Left Content */}
        <div>
          <h1 className="text-4xl font-bold mb-4">
            Become a Tutor & Share Your Knowledge
          </h1>
          <p className="mb-6 text-lg">
            Join our platform and start teaching students from Class 1 to 12,
            JEE, NEET & more. Earn while making an impact.
          </p>

          <ul className="space-y-3 mb-6">
            <li>✅ Flexible teaching schedule</li>
            <li>✅ Teach from home or offline</li>
            <li>✅ Connect with thousands of students</li>
            <li>✅ Secure & timely payments</li>
          </ul>

          <img
            src="https://images.unsplash.com/photo-1584697964358-3e14ca57658b"
            alt="Tutor teaching"
            className="rounded-2xl shadow-lg"
          />
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="card bg-base-100 shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Apply Now
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full mb-4"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full mb-4"
            required
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className="input input-bordered w-full mb-4"
            required
          />

      <input
  type="file"
  name="resume"
  className="file-input file-input-bordered w-full mb-4"
  onChange={(e) =>
    setFormData({
      ...formData,
      resume: e.target.files[0],
    })
  }
  required
/>

          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="select select-bordered w-full mb-4"
            required
          >
            <option value="">Select Subject</option>
            <option>Maths</option>
            <option>Science</option>
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Biology</option>
            <option>English</option>
          </select>

          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="textarea textarea-bordered w-full mb-4"
            placeholder="Your Teaching Experience"
            required
          ></textarea>

          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Submit Application
          </button>

          <p className="text-sm text-center mt-4">
            Our team will review your application and contact you soon.
          </p>
        </form>
      </div>

      {/* Bottom Section Images */}
      <div className="max-w-6xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
          alt="Teaching"
          className="rounded-xl shadow-md"
        />
        <img
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7"
          alt="Online teaching"
          className="rounded-xl shadow-md"
        />
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          alt="Students learning"
          className="rounded-xl shadow-md"
        />
      </div>
    </div>
  );
}

import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Message sent successfully!");

        setFormData({
          name: "",
          email: "",
          mobile: "",
          message: "",
        });
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        <div>
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="mb-6 text-lg">
            Have questions or need help finding the right tutor?
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card bg-base-100 shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Send a Message
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full mb-4"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full mb-4"
            required
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className="input input-bordered w-full mb-4"
            required
          />

          <textarea
            name="message"
            placeholder="Write your message here..."
            value={formData.message}
            onChange={handleChange}
            className="textarea textarea-bordered w-full mb-4"
            required
          ></textarea>

          <button type="submit" className="btn btn-primary w-full">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
import React from "react";

export default function FindTutor() {
  const tutors = [
    {
      name: "Rahul Sharma",
      subject: "Math Tutor",
      exp: "5 Years",
      img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    },
    {
      name: "Priya Singh",
      subject: "Science Tutor",
      exp: "4 Years",
      img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
    },
    {
      name: "Amit Kumar",
      subject: "Physics Tutor",
      exp: "6 Years",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },
  ];

  return (
    <div className="min-h-screen bg-base-200 py-16 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Tutor</h1>
        <p className="text-lg">
          Browse experienced tutors and choose the best one for your learning needs.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search by subject, class..."
          className="input input-bordered w-full"
        />
      </div>

      {/* Tutors Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {tutors.map((tutor, index) => (
          <div
            key={index}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition duration-300"
          >
            <figure>
              <img src={tutor.img} alt={tutor.name} className="h-56 w-full object-cover" />
            </figure>

            <div className="card-body">
              <h2 className="card-title">{tutor.name}</h2>
              <p className="font-medium">{tutor.subject}</p>
              <p>Experience: {tutor.exp}</p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">⭐ 4.8 Rating</span>
                <button className="btn btn-primary btn-sm">Hire</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Extra Section */}
      <div className="max-w-6xl mx-auto mt-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Tutors?</h2>
          <ul className="space-y-3 text-lg">
            <li>✅ Verified and experienced professionals</li>
            <li>✅ One-to-one personalized learning</li>
            <li>✅ Affordable and flexible plans</li>
            <li>✅ Online & offline options available</li>
          </ul>
        </div>

        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
          alt="Students learning"
          className="rounded-2xl shadow-lg"
        />
      </div>
    </div>
  );
}

import React, { useState } from "react";
import Testimonials from "../components/Testimonials";

const Home = () => {
  // Only Enquiry Form DB Connection
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Enquiry Submitted Successfully!");

        setFormData({
          name: "",
          email: "",
          mobile: "",
          role: "",
          message: "",
        });
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div
        className="hero min-h-[80vh]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1588072432836-e10032774350')",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-xl">
            <h1 className="mb-5 text-4xl md:text-5xl font-bold">
              Find the Best Home Tutors
            </h1>
            <p className="mb-5">
              From Class 1 to 12, JEE, NEET, Olympiads & more.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>

      {/* Features */}
      {/* Your existing code same rahega */}

      {/* Enquiry Form */}
      <section className="py-16 px-6">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto card shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Enquiry Form
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Role</option>
              <option>Student</option>
              <option>Teacher</option>
              <option>Parent</option>
            </select>
          </div>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="textarea textarea-bordered w-full mt-4"
            placeholder="Message"
            required
          ></textarea>

          <button
            type="submit"
            className="btn btn-primary mt-6 w-full"
          >
            Submit
          </button>
        </form>
      </section>

      <Testimonials />
    </>
  );
};

export default Home;

import React from "react";

export default function Services() {
  const services = [
    {
      title: "Home Tuition",
      desc: "Personalized one-to-one learning at your home with expert tutors.",
      img: "https://images.unsplash.com/photo-1588072432836-e10032774350",
    },
    {
      title: "Online Classes",
      desc: "Interactive live classes from anywhere with flexible timings.",
      img: "https://images.unsplash.com/photo-1584697964358-3e14ca57658b",
    },
    {
      title: "Exam Preparation",
      desc: "Focused preparation for JEE, NEET, boards & competitive exams.",
      img: "https://images.unsplash.com/photo-1513258496099-48168024aec0",
    },
  ];

  return (
    <div className="min-h-screen bg-base-200 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-lg">
          We provide high-quality education solutions tailored for every student.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.title}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition duration-300"
          >
            <figure>
              <img src={service.img} alt={service.title} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{service.title}</h2>
              <p>{service.desc}</p>
              <button className="btn btn-primary mt-4">Learn More</button>
            </div>
          </div>
        ))}
      </div>

      {/* Extra Section */}
      <div className="max-w-6xl mx-auto mt-20 grid md:grid-cols-2 gap-10 items-center">
        <img
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7"
          alt="Learning"
          className="rounded-2xl shadow-lg"
        />

        <div>
          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <ul className="space-y-3 text-lg">
            <li>✅ Experienced & verified tutors</li>
            <li>✅ Affordable pricing</li>
            <li>✅ Flexible schedules</li>
            <li>✅ Personalized learning plans</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import FindTutor from "./pages/FindTutor";
import BecomeTutor from "./pages/BecomeTutor";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";

import AdminDashboard from "./pages/AdminDashboard"; // ye add karo

export default function App() {
  return (
    <>
      <Navbar />
      <LoginModal />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-tutor" element={<FindTutor />} />
        <Route path="/become-tutor" element={<BecomeTutor />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Route */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
      </Routes>

      <Footer />
    </>
  );
}
VITE_API_URL=https://vht-ecoibackend.vercel.app

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?


{
"rewrites": [
{
"source": "/(.*)",
"destination": "/"
}
]
}

node_modules/
backend/node_modules/
frontend/node_modules/

.env
dist
build
