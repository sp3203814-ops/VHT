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