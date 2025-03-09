import shape2 from "../../assets/images/shape2.png";
import { Headphones } from "lucide-react";
import { Link } from "react-router-dom";

export const Bar = () => {
  return (
   
    <div className="relative w-full -mt-4">
      {/* Main Content */}
      <div className="bg-[#FDB813] px-4 py-14 md:py-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          {/* Left Side */}
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight whitespace-nowrap">
              Book Your Cab It's Simple
            </h1>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              And Affordable
            </h1>
            <p className="text-white text-md md:text-lg opacity-90 max-w-xl">
            Booking a cab with us is quick and hassle-free. Our reliable service ensures you reach your destination comfortably and on time, every time
            </p>
          </div>

          {/* Right Side */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white">
              <Headphones size={32} />
              <span className="text-2xl md:text-3xl font-bold">
                +94 764 610 843
              </span>
            </div>
            <Link to="/availablecabs">
            <button className="bg-black text-white py-4 ml-16 px-3 w-52 rounded-full text-lg font-semibold hover:bg-gray-900 transition-colors">
              BOOK YOUR CAB →
            </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Checkered Border */}
      <div className="bg-black w-full h-10 "/>
      <div
        className="w-full h-12 -mt-10"
        style={{
          backgroundImage: `url(${shape2})`,
          backgroundRepeat: "repeat-x", // Repeat horizontally
          backgroundPosition: "top", // Position at the top
          backgroundSize: "auto 40px", // Adjust height as needed
        }}
      />
      
    </div>

  );
};

export default Bar;