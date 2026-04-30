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