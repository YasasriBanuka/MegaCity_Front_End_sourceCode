import { useState, useEffect } from "react";
import axios from "axios";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../Authenticationpage/AuthContext";
import Unauthorized from "../Authenticationpage/Unauthorized";

export const BookingDashboard = () => {
  const { user } = useAuth();
  if (!user || user.role !== "ROLE_ADMIN") {
    return <Unauthorized />;
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all"); // Default: show all statuses
  const bookingsPerPage = 5;

  useEffect(() => {
    axios
      .get("http://localhost:8080/getallbookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then((response) => {
        setBookings(response.data);
        setFilteredBookings(response.data); // Initialize filtered bookings
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }, []);

  // Search Functionality
  useEffect(() => {
    let results = bookings;

    // Filter by search query
    if (searchQuery) {
      results = results.filter(
        (booking) =>
          booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.bookingId.toString().includes(searchQuery) ||
          booking.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== "all") {
      results = results.filter((booking) => booking.status === selectedStatus);
    }

    setFilteredBookings(results);
    setCurrentPage(1); // Reset to the first page after filtering
  }, [searchQuery, selectedStatus, bookings]);

  // Pagination Logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      Confirmed: "bg-green-100 text-green-700",
      Completed: "bg-blue-100 text-blue-700",
      Cancelled: "bg-red-100 text-red-700",
      Pending: "bg-yellow-100 text-yellow-700",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Booking Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all cab bookings</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border rounded-lg appearance-none bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <option value="all">All</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentBookings.map((booking) => (
                <tr key={booking.bookingId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{booking.bookingId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{booking.customerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{booking.pickupLocation}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{booking.destination}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {booking.bookingDate} at {booking.bookingTime}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="p-4 flex justify-between items-center bg-white">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstBooking + 1} to {Math.min(indexOfLastBooking, filteredBookings.length)} of {filteredBookings.length} results
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 flex items-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 flex items-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};