import { Link } from "react-router-dom";
import { useAuth } from "../../Authenticationpage/AuthContext"; 
import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Car,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const togglePopup = () => setIsPopupOpen((prev) => !prev);
  const handleLogout = (e) => {
    e.stopPropagation();
    logout();
  };

  const role = localStorage.getItem("role");

  return (
    <header id="header" className="bg-white text-black w-full z-50 fixed shadow-lg">
      <div className="bg-[#1a1a1a] text-white py-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center text-sm">
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a href="mailto:info@example.com" className="flex items-center hover:text-yellow-400">
                <Mail className="h-4 w-4 mr-2" /> megacity@gmail.com
              </a>
              <a href="tel:+1234567890" className="flex items-center hover:text-yellow-400">
                <Phone className="h-4 w-4 mr-2" /> +94 764 610 843
              </a>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-2" /> Sun - Fri (08AM - 10PM)
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-4">
                <a href="#" className="hover:text-yellow-400"><Facebook className="h-4 w-4" /></a>
                <a href="#" className="hover:text-yellow-400"><Twitter className="h-4 w-4" /></a>
                <a href="#" className="hover:text-yellow-400"><Instagram className="h-4 w-4" /></a>
                <a href="#" className="hover:text-yellow-400"><Linkedin className="h-4 w-4" /></a>
              </div>
              {!user && (
                <>
                  <a href="/login" 
                  id ="login"
                  className="text-sm hover:text-yellow-400">Login</a>
                  <a href="/signup" className="text-sm hover:text-yellow-400">Register</a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="#header" className="flex items-center text-2xl font-bold">
          <Car className="h-8 w-8 text-yellow-400" />
          <span className="ml-2">MegaCityCab</span>
        </Link>
        
        <nav className="hidden md:flex gap-8">
          <Link to="/" className="text-gray-900 hover:text-yellow-500">Home</Link>
          <a href="#aboutus" className="text-gray-500 hover:text-gray-900">About Us</a>
          <a href="#service" className="text-gray-500 hover:text-gray-900">Service</a>
          <a
          id = "contact"
           href="#footer" className="text-gray-500 hover:text-gray-900">Contact</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/availablecabs">
            <button
            id ="bookcab"
             className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500">BOOK A TAXI</button>
          </Link>
          {user && (
            <div className="relative">
              <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center cursor-pointer" onClick={togglePopup}>
                <span 
                id = "customerProfile"
                className="text-xl">{user.username.charAt(0).toUpperCase()}</span>
              </div>
              {isPopupOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md w-48">
                  <ul>
                    {role === "ROLE_ADMIN" ? (
                      <li><Link to="/admin"
                      id ="AdminDash" className="block px-4 py-2 hover:bg-gray-100">Admin Panel</Link></li>
                    ) : role === "ROLE_DRIVER" ? (
                      <li><Link to="/driver" className="block px-4 py-2 hover:bg-gray-100">Driver Dashboard</Link></li>
                    ) : (
                      <li><Link to="/customerprofile" 
                      id ="customerPro"
                      className="block px-4 py-2 hover:bg-gray-100">Profile</Link></li>
                    )}
                    <li>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Log out</button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col p-4">
            <Link to="/" className="py-2 text-gray-900">Home</Link>
            <a href="#aboutus" className="py-2 text-gray-500">About Us</a>
            <a href="#service" className="py-2 text-gray-500">Service</a>
            <a href="#footer" className="py-2 text-gray-500">Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
