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