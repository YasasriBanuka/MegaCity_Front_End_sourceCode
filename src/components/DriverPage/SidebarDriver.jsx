import {
  LayoutDashboard,
  Clock,
  Calendar,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { useAuth } from "../../Authenticationpage/AuthContext"; // Adjust the import path as needed
import axios from "axios";

export function SidebarDriver() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const { user, logout } = useAuth(); // Get user and logout function from AuthContext
  const [profile, setProfile] = useState({ userName: "", driveImage: "" });


  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };

  // // Check if the user is authorized (ROLE_DRIVER)
  // useEffect(() => {
  //   if (!user || user.role !== "ROLE_DRIVER") {
  //     navigate("/unauthorized"); // Redirect to unauthorized page
  //   }
  // }, [user, navigate]);

  // Fetch driver profile data (name and profile picture)
  useEffect(() => {
    const fetchDriverProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found");
        }

        const response = await axios.get(`http://localhost:8080/auth/getcabbyid/${userId}`);
        const { userName, driveImage } = response.data; // Adjust based on your API response
        setProfile({ userName, driveImage });
      } catch (error) {
        console.error("Error fetching driver profile:", error);
      }
    };

    fetchDriverProfile();
  }, []);

  // Handle logout


  return (
    <aside className="w-64 min-h-screen bg-black p-4 text-white flex flex-col fixed left-0 top-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
          <ChevronRight className="text-black" />
        </div>
        <h1 className="text-xl font-bold">DriveHub</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        <NavItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          href="/driver/driverdashboard"
          active={location.pathname === "/driver/driverdashboard"} // Check if the current route matches
        />
        <NavItem
          icon={<Calendar size={20} />}
          text="Bookings"
          href="/driver/driverbooking"
          active={location.pathname === "/driver/driverbooking"} // Check if the current route matches
        />
        <NavItem
          icon={<Clock size={20} />}
          text="History"
          href="/history"
          active={location.pathname === "/history"} // Check if the current route matches
        />
      </nav>

      {/* Profile Section and Logout Button */}
      <div className="pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between px-2">
          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <img
              src={profile.driveImage}
              alt="Driver profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="font-medium">{profile.userName}</h2>
              <p className="text-sm text-gray-400">Online</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="text-red-400 hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}

// NavItem Component
function NavItem({ icon, text, href, active, className = "" }) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
        active ? "bg-yellow-400 text-black" : "hover:bg-gray-800"
      } ${className}`}
    >
      {icon}
      <span className="font-medium">{text}</span>
    </a>
  );
}