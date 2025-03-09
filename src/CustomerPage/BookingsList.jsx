import { useState, useEffect } from "react";
import axios from "axios";
import { Star, MapPin, Calendar, Clock, User } from "lucide-react";
import { ReviewModal } from "./ReviewModal"; // Import the ReviewModal component
import { FaCarSide } from "react-icons/fa";

export const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null); // Track selected booking for review
  const userId = localStorage.getItem("userId");

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/auth/getbookingsbycustomer/${userId}`
      );
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to fetch bookings. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "Pending") return booking.status === "Pending";
    if (activeTab === "Confirmed") return booking.status === "Confirmed";
    if (activeTab === "Completed") return booking.status === "Completed";
    if (activeTab === "Cancelled") return booking.status === "Cancelled";
    return true; // Show all bookings
  });

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center bg-gradient-to-br from-white via-amber-50 to-yellow-50">
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6 max-w-5xl w-full mb-28">
        <h2 className="text-2xl font-semibold mb-6">My Bookings</h2>
        <div className="flex gap-3 mb-6">
          {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="border rounded-lg p-6 space-y-4 hover:border-blue-200 transition-colors"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">
                  <FaCarSide/>
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Pickup Location</p>
                    <p className="font-medium">{booking.pickupLocation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Destination</p>
                    <p className="font-medium">{booking.destination}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{booking.bookingDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{booking.bookingTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Customer Name</p>
                    <p className="font-medium">{booking.customerName}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                {booking.status === "Completed" && (
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Star size={16} />
                    Write a Review
                  </button>
                )}
              </div>
            </div>
          ))}
          {filteredBookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No {activeTab === "All" ? "" : activeTab} bookings found
            </div>
          )}
        </div>
      </div>

      {/* Render ReviewModal if a booking is selected */}
      {selectedBooking && (
        <ReviewModal
          onClose={() => setSelectedBooking(null)}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default BookingsList;