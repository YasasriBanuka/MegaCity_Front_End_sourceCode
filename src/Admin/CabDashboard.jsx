import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  ChevronDown,
  Car,
  Shield,
  MapPin,
  User,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { useAuth } from "../Authenticationpage/AuthContext";
import Unauthorized from "../Authenticationpage/Unauthorized";
import { useNavigate } from "react-router-dom";

export const CabDashboard = () => {
  const { user } = useAuth(); // Get the current user from the authentication context

  // Role-based access control
  if (!user || user.role !== "ROLE_ADMIN") {
    return <Unauthorized />; // Render Unauthorized component if the user is not an admin
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Status filter state
  const [locationFilter, setLocationFilter] = useState("all"); // Location filter state
  const [cabs, setCabs] = useState([]);
  const [filteredCabs, setFilteredCabs] = useState([]); // For search and filter functionality
  const navigate = useNavigate();

  // Fetch cabs from backend on component mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/getallCabs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then((response) => {
        setCabs(response.data);
        setFilteredCabs(response.data); // Initialize filtered cabs
      })
      .catch((error) => {
        console.error("Error fetching cabs:", error);
      });
  }, []);

  // Handle search and filter functionality
  useEffect(() => {
    let filtered = cabs;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (cab) =>
          cab.cabModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cab.cabNumberPlate.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (cab) => cab.availabilityStatus === statusFilter
      );
    }

    // Apply location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter((cab) => cab.location === locationFilter);
    }

    setFilteredCabs(filtered);
  }, [searchQuery, statusFilter, locationFilter, cabs]);

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      Available: "bg-green-100 text-green-700",
      maintenance: "bg-yellow-100 text-yellow-700",
      Unavailable: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-gray-100">
    <div className="min-h-screen w-full p-6 -mb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Cab Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor all registered cabs
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cabs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex gap-3">
              {/* Status Filter Dropdown */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg flex items-center space-x-2 hover:bg-gray-50 appearance-none"
                >
                  <option value="all">Status</option>
                  <option value="Available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Location Filter Dropdown */}
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="px-9 py-2 border rounded-lg flex items-center space-x-2 hover:bg-gray-50 appearance-none"
                >
                  <option value="all">Location</option>
                  {Array.from(new Set(cabs.map((cab) => cab.location))).map(
                    (location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    )
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Cabs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCabs.map((cab) => (
            <div
              key={cab.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={cab.imgUrl}
                  alt={cab.cabModel}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <StatusBadge status={cab.availabilityStatus} />
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {cab.cabModel}
                    </h3>
                    <p className="text-sm text-gray-500">{cab.cabNumberPlate}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="w-4 h-4 mr-2" />
                    {cab.cabNumberPlate}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    {cab.driverName}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {cab.location}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Last Service: {cab.lastService}
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-600 hover:text-blue-800"
                    onClick={() => navigate(`/admin/cardetails/${cab.cabId}`)}
                    >
                      <Eye className="w-5 h-5 cursor-pointer" />
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-800">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};