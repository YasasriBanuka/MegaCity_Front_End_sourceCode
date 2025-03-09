import { useEffect, useState } from "react";
import { useAuth } from "../Authenticationpage/AuthContext"; // Import the authentication context
import { useNavigate } from "react-router-dom";

const HandleBookings = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is an admin
    if (!user || user.role !== "ROLE_ADMIN") {
      // Redirect to a different page or show an error message
      navigate("/unauthorized"); // Redirect to an unauthorized page
      return;
    }

    const fetchBookings = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8080/getallorders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach JWT token
          },
        });

        if (!response.ok) throw new Error("Failed to fetch bookings");

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [user, history]); // Add user and history to the dependency array

  const updateBookingStatus = async (bookingId, status) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8080/updatebooking/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach JWT token
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update booking");

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === bookingId ? { ...booking, status } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Bookings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border px-4 py-2">Customer</th>
              <th className="border px-4 py-2">Pickup</th>
              <th className="border px-4 py-2">Destination</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Time</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Car Number Plate</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.bookingId} className="text-center">
                <td className="border px-4 py-2">{booking.customerName}</td>
                <td className="border px-4 py-2">{booking.pickupLocation}</td>
                <td className="border px-4 py-2">{booking.destination}</td>
                <td className="border px-4 py-2">{booking.bookingDate}</td>
                <td className="border px-4 py-2">{booking.bookingTime}</td>
                <td className="border px-4 py-2">{booking.phoneNumber}</td>
                <td className="border px-4 py-2">{booking.cabs?.cabNumberPlate || "N/A"}</td>
                <td className="border px-4 py-2 font-semibold text-blue-600">{booking.status}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => updateBookingStatus(booking.bookingId, "Confirmed")}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => updateBookingStatus(booking.bookingId, "Cancelled")}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HandleBookings;