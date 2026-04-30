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