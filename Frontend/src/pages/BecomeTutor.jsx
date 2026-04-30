import React, { useState } from "react";

export default function BecomeTutor() {
  const API = import.meta.env.VITE_API_URL;
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

    const res = await fetch(`${API}/api/tutor/apply`, {
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