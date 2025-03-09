import { LayoutDashboard, Car, Users, FileText, Settings, LogOut, X } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Authenticationpage/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [adminDetails, setAdminDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await axios.get(`http://localhost:8080/getAdminbyid/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        setAdminDetails(response.data);
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };

    fetchAdminDetails();
  }, []);

  const currentPath = location.pathname;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Car className="w-8 h-8 text-yellow-500" />
            <span className="text-xl font-bold text-gray-800">CabAdmin</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <Link to="/admin/dashboard" className={`flex items-center px-4 py-3 rounded-lg group ${currentPath === "/admin/dashboard" ? "bg-yellow-50 text-gray-700" : "text-gray-600 hover:bg-yellow-50"}`}>
            <LayoutDashboard className="w-5 h-5 mr-3 text-gray-500 group-hover:text-yellow-500" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>

          <Link to="/admin/bookingdashboard" className={`flex items-center px-4 py-3 rounded-lg group ${currentPath === "/admin/bookingdashboard" ? "bg-yellow-50 text-gray-700" : "text-gray-600 hover:bg-yellow-50"}`}>
            <Car className="w-5 h-5 mr-3 text-gray-500 group-hover:text-yellow-500" />
            <span className="text-sm font-medium">Bookings</span>
          </Link>

          <Link to="/admin/admins" className={`flex items-center px-4 py-3 rounded-lg group ${currentPath === "/admin/admins" ? "bg-yellow-50 text-gray-700" : "text-gray-600 hover:bg-yellow-50"}`}>
            <Users className="w-5 h-5 mr-3 text-gray-500 group-hover:text-yellow-500" />
            <span 
              id = "admin"
              className="text-sm font-medium">Admins</span>
          </Link>

          <Link to="/admin/cabdashboard" className={`flex items-center px-4 py-3 rounded-lg group ${currentPath === "/admin/cabdashboard" ? "bg-yellow-50 text-gray-700" : "text-gray-600 hover:bg-yellow-50"}`}>
            <FileText className="w-5 h-5 mr-3 text-gray-500 group-hover:text-yellow-500" />
            <span className="text-sm font-medium">Cabs</span>
          </Link>

          <Link to="/admin/categorydashboard" className={`flex items-center px-4 py-3 rounded-lg group ${currentPath === "/admin/cabdashboard" ? "bg-yellow-50 text-gray-700" : "text-gray-600 hover:bg-yellow-50"}`}>
            <FileText className="w-5 h-5 mr-3 text-gray-500 group-hover:text-yellow-500" />
            <span
            id = "addCategory"
             className="text-sm font-medium">Category</span>
          </Link>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <img src={adminDetails?.adminImage || "https://via.placeholder.com/150"} alt="Admin" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{adminDetails?.userName || "Admin"}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <LogOut className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer" onClick={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
