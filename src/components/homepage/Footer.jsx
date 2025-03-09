import { 
  FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, 
  FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube 
} from "react-icons/fa";
import { useState, useEffect } from "react"; // Add this import
import shape2 from "../../assets/images/shape2.png";
import { FaArrowUp } from "react-icons/fa6";
import { Link } from "react-router-dom";
import {
  Car
} from "lucide-react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to handle scroll event
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    
    <footer id="footer"
      className="bg-black text-white py-10 relative overflow-x-hidden -mb-6"
      style={{
        backgroundImage: `url(${shape2})`,
        backgroundRepeat: "repeat-x", // Repeat horizontally
        backgroundPosition: "top", // Position at the top
        backgroundSize: "auto 35px", // Adjust height as needed
      }}
    >
      <div className="container mx-auto px-4 mt-12">
        <div className="flex gap-24 justify-center">
          {/* Company Info */}
          <div>
          <div className="text-2xl font-bold">
          <a href="#Header" className="hover:text-yellow-500">
            <div className="flex-shrink-0 flex items-center">
              <Car className="h-8 w-8 text-yellow-400" />
            <span className="ml-2">MegaCityCab</span>
            </div>
          </a>
        </div>
            <p className="mt-4 text-white text-sm">
              We are many variations of passages available but<br /> 
              the majority have suffered alteration in some form <br />
              by injected humour words believable.
            </p>
            <div className="mt-4 space-y-4">
              <p className="flex items-center gap-3 text-white"><FaPhoneAlt className="w-7 h-7 rounded-full bg-yellow-500 p-2"/> +94 764 610 843</p>
              <p className="flex items-center gap-3 text-white"><FaMapMarkerAlt className="w-7 h-7 rounded-full bg-yellow-500 p-2"/> 25/B Milford Road, Colombo 5</p>
              <p className="flex items-center gap-3 text-white"><FaEnvelope className="w-7 h-7 rounded-full bg-yellow-500 p-2"/>  megacity@gmail.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold border-b-2 w-28 pb-2">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-gray-400 cursor-pointer">
              <a href="#aboutus"> <li className="hover:text-white mt-2">About Us</li></a>
              <a href="#Testimonials"><li className="hover:text-white mt-2">Testimonials</li></a>
              <a href="#service"><li className="hover:text-white mt-2">Terms Of Service</li></a>
             <Link to="/cabRegistration"> <li 
             id ="cabRegi"className="hover:text-white mt-2"
             >Our Drivers</li></Link>
            </ul>
          </div>

          {/* Support Center */}
          <div>
            <h3 className="text-xl font-semibold border-b-2 w-36 border-yellow-500 pb-2">Support Center</h3>
            <ul className="mt-4 space-y-2 text-gray-400">
             <a href="#FAQ"> <li>FAQ’s</li></a>
              <Link to="/availablecabs"> <li className="hover:text-white mt-2">Book A Ride</li></Link>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-xl font-semibold border-b-2 border-yellow-500 w-28 pb-2">Newsletter</h3>
            <p className="mt-4 text-white">
              Subscribe Our Newsletter To Get<br />
              Latest Update And News
            </p>
            <div className="mt-4 flex flex-col gap-2 mb-24">
              <input
                type="email"
                placeholder="Your Email"
                className="p-3 w-60 rounded-md bg-white text-black border border-gray-600 mb-2"
              />
              <button className="bg-yellow-500 text-black px- py-4 font-semibold text-sm w-60 rounded-full">
                SUBSCRIBE NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
        <div className="relative h-20 -mb-10" style={{ marginLeft: "600px"}} >
        <p className="text-white text-sm -ml-96 pt-6">
            © Copyright 2025 <span className="text-yellow-500 font-bold ">megacity</span> All Rights Reserved.
          </p>
  {/* Left Side with 45-degree Diagonal */}
  <div
    className="absolute bottom-0 w-full h-full bg-yellow-500"
    style={{ 
      clipPath: "polygon(0 0,0 0 , 0 0, 0 0)",
      transform: "skewX(-45deg)",
      transformOrigin: "left",
       // Diagonal cut on the left
    }}
  ></div>

  {/* Right Side (Normal) */}
  <div
    className="absolute bottom-0 w-full h-full bg-yellow-500"
    style={{ 
      clipPath: "polygon(5% 0, 100% 0, 100% 100%, 0 100%)", // Normal rectangle on the right
    }}
  ></div>

  {/* Social Media Icons */}
  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
    {[FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube].map((Icon, index) => (
      <div key={index} className="w-10 h-10 flex items-center justify-center bg-black rounded-full">
        <Icon className="text-yellow-500 text-xl" />
      </div>
    ))}
  </div>

  {/* Scroll to Top Button */}
  {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl hover:bg-yellow-500 transition"
        >
          <FaArrowUp className="text-white text-2xl" />
        </button>
      )}
</div>
    </footer>

  );
};

export default Footer;
