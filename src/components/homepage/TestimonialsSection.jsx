import { useCallback, useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import shape2 from "../../assets/images/shape2.png";
import bg from "../../assets/images/bg.jpg";

const TestimonialsSection = () => {
  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Parker Jime",
      position: "Customer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      comment: "Outstanding service and professionalism. The driver was punctual and courteous, making my business travel seamless and comfortable.",
      rating: 5,
    },
    {
      id: 2,
      name: "Heruli Nez",
      position: "Customer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      comment: "Reliable and efficient service. The booking process was straightforward, and the driver's professionalism exceeded my expectations.",
      rating: 5,
    },
    {
      id: 3,
      name: "Sylvia Green",
      position: "Customer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      comment: "Exceptional experience from start to finish. The vehicle was immaculate, and the driver was knowledgeable about the best routes.",
      rating: 5,
    },
    {
      id: 4,
      name: "Gordo Novak",
      position: "Customer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      comment: "First-class service with attention to detail. The entire experience was smooth and professional. Highly recommended.",
      rating: 5,
    },
    {
      id: 5,
      name: "Emma Thompson",
      position: "Customer",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop",
      comment: "Impeccable service quality. The drivers are professional, and the vehicles are always in pristine condition.",
      rating: 5,
    },
    {
      id: 6,
      name: "Michael Chen",
      position: "Customer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      comment: "Consistently reliable and professional. The service has become an integral part of my business travel arrangements.",
      rating: 5,
    },
    {
      id: 7,
      name: "Sarah Williams",
      position: "Customer",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      comment: "Outstanding customer service. The attention to detail and professionalism make every journey exceptional.",
      rating: 5,
    },
    {
      id: 8,
      name: "James Morrison",
      position: "Customer",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
      comment: "Excellent service standards. The drivers are punctual, professional, and provide a premium experience.",
      rating: 5,
    },
  ];

  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  // Next page handler
  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  // Previous page handler
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextPage();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextPage]);

  // Get displayed testimonials for the current page
  const displayedTestimonials = testimonials.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const testimonialsSliderStyles = {
    position: 'relative',
    marginBottom: '-40px',
  };
  
  const dotStyles = {
    margin: '0 4px',
  };
  
  const activeDotStyles = {
    width: '24px',
    transition: 'width 0.3s ease',
  };
  
  // Inside your component
  return (
    <div >
    <section id="#reviews"
      className="py-20 px-4 overflow-hidden mt-32"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-7xl mx-auto mb-28">
        {/* Section Header */}
        <div 
        id ="Testimonials"
        className="text-center mb-16">
          <h2 className="text-amber-500 text-xl font-semibold mb-4">TESTIMONIALS</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white">
            What Our Client <span className="text-amber-500">Say's</span>
          </h3>
          <div className="w-24 h-1 bg-amber-500 mx-auto mt-6 rounded-full" />
        </div>
  
        {/* Testimonials Carousel */}
        <div
          style={testimonialsSliderStyles}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Testimonial Cards */}
          <div className="flex gap-8 transition-all duration-700">
            {displayedTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex-shrink-0 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)] px-4">
                <div className="bg-white rounded-3xl p-8 relative h-full shadow-lg transition-transform duration-300 hover:scale-105">
                  {/* User Image */}
                  <div className="absolute -top-6 left-8">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                    />
                  </div>
                  {/* Testimonial Content */}
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-amber-500 mb-2">{testimonial.position}</p>
                    <p className="text-gray-600 mb-4 line-clamp-3">{testimonial.comment}</p>
                    {/* Star Rating */}
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={20} className="text-amber-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  {/* Decorative SVG */}
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
              </div>
            ))}
          </div>
  
          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-8 slick-dots">
            <button
              onClick={prevPage}
              className="p-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors"
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === currentPage ? "w-6 bg-amber-500" : "bg-gray-600 hover:bg-amber-400"
                  }`}
                  style={i === currentPage ? activeDotStyles : dotStyles}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextPage}
              className="p-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors"
              aria-label="Next testimonials"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
    <div className="bg-black w-full h-5"/>
    <div
              className="w-full h-14 -mt-10" 
                    style={{
                      backgroundImage: `url(${shape2})`,
                      backgroundRepeat: "repeat-x", // Repeat horizontally
                      backgroundPosition: "top", // Position at the top
                      backgroundSize: "40px", // Adjust height as needed
                    }}
            />
    

            
    </div>
  );
};

export default TestimonialsSection;