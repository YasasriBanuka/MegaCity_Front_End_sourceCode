/* import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Parker Jime",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    comment:
      "There are many variations of words suffered available to the have majority but the majority suffer to alteration injected hidden the middle text.",
    rating: 5,
  },
  {
    id: 2,
    name: "Heruli Nez",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    comment:
      "There are many variations of words suffered available to the have majority but the majority suffer to alteration injected hidden the middle text.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sylvia Green",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    comment:
      "There are many variations of words suffered available to the have majority but the majority suffer to alteration injected hidden the middle text.",
    rating: 5,
  },
  {
    id: 4,
    name: "Gordo Novak",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    comment:
      "There are many variations of words suffered available to the have majority but the majority suffer to alteration injected hidden the middle text.",
    rating: 5,
  },
];

const TestimonialCard = ({ name, image, comment, rating }) => {
  return (
    <div className="bg-white rounded-3xl p-8 relative">
      <div className="absolute -top-6 left-8">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full border-2 border-white"
        />
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="text-amber-500 mb-2">Customer</p>
        <p className="text-gray-600 mb-4">{comment}</p>
        <div className="flex gap-1">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} size={20} className="text-amber-400 fill-current" />
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 opacity-10">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path
            d="M95 50C95 74.8528 74.8528 95 50 95C25.1472 95 5 74.8528 5 50C5 25.1472 25.1472 5 50 5C74.8528 5 95 25.1472 95 50Z"
            stroke="#FFB800"
            strokeWidth="10"
          />
        </svg>
      </div>
    </div>
  );
};

export const Testimonial = () => {
  return (
    <section className="bg-gray-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-amber-500 text-xl font-semibold mb-4">
            TESTIMONIALS
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white">
            What Our Client <span className="text-amber-500">Say's</span>
          </h3>
          <div className="w-24 h-1 bg-amber-500 mx-auto mt-6 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial; */