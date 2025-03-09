import { useAuth } from "../../Authenticationpage/AuthContext"; // Adjust path if needed
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DriverBookings = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is a driver
    if (!user || user.role !== "ROLE_DRIVER") {
      // Redirect to an unauthorized page if not a driver
      navigate("/unauthorized");
      return;
    }

    const fetchBookings = async () => {
      const token = localStorage.getItem("jwtToken");
      const cabId = localStorage.getItem("userId"); // Ensure this is set correctly in localStorage

      if (!token) return;

      try {
        const response = await axios.get(`http://localhost:8080/getordersbycabid/${cabId}`, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json", 
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch bookings");
        }

        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error.response || error.message);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const handleConfirm = (bookingId) => {
    // Add logic to confirm the booking
    alert(`Booking ${bookingId} confirmed!`);
  };

  const handleCancel = (bookingId) => {
    // Add logic to cancel the booking
    alert(`Booking ${bookingId} canceled!`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-semibold mb-6">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-xl text-gray-600">You have no bookings.</p>
      ) : (
        <table className="min-w-full bg-white border-collapse border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-6 py-3 text-left text-gray-700">Pickup Location</th>
              <th className="border border-gray-300 px-6 py-3 text-left text-gray-700">Destination</th>
              <th className="border border-gray-300 px-6 py-3 text-left text-gray-700">Booking Date</th>
              <th className="border border-gray-300 px-6 py-3 text-left text-gray-700">Booking Time</th>
              <th className="border border-gray-300 px-6 py-3 text-left text-gray-700">Status</th>
              <th className="border border-gray-300 px-6 py-3 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.bookingId} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-6 py-4">{booking.pickupLocation}</td>
                <td className="border border-gray-300 px-6 py-4">{booking.destination}</td>
                <td className="border border-gray-300 px-6 py-4">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-6 py-4">{new Date(`1970-01-01T${booking.bookingTime}Z`).toLocaleTimeString()}</td>
                <td className="border border-gray-300 px-6 py-4">{booking.status}</td>
                <td className="border border-gray-300 px-6 py-4 flex space-x-4">
                  <button
                    onClick={() => handleConfirm(booking.bookingId)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleCancel(booking.bookingId)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DriverBookings;

