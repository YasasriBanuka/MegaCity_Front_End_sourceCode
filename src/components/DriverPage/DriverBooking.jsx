import {
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Filter,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/images/loadingAnimation.json";

export function DriverBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All Status"); // Status filter state


  // Fetch bookings for the logged-in driver's cab
  useEffect(() => {
    const fetchBookings = async () => {
      const userId = localStorage.getItem("userId"); // Retrieve cabId from local storage
      const token = localStorage.getItem("jwtToken"); // Retrieve JWT token from local storage

      if (!userId || !token) {
        setError("Cab ID or token not found in local storage.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/getbookingsbycab/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle booking actions (accept, decline, cancel)
  const handleBookingAction = async (bookingId, action) => {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await axios.patch(
        `http://localhost:8080/updatebooking/${bookingId}`,
        { status: action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (action === "Confirmed") {
        toast.success("Booking accepted successfully!");
      } else if (action === "Cancelled") {
        toast.error("Booking declined / cancelled.");
      }

      console.log("Updated booking response:", response.data); // Log the response

      // Update the local state with the updated booking
      setBookings((prevBookings) => {
        const updatedBookings = prevBookings.map((booking) =>
          booking.bookingId === bookingId ? response.data : booking
        );
        console.log("Updated bookings state:", updatedBookings); // Log updated bookings
        return updatedBookings;
      });
    } catch (error) {
      console.error(`Error ${action} booking:`, error);
    }
  };

  // Filter bookings for today
  const todayBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.bookingDate);
    const today = new Date();
    return (
      bookingDate.getFullYear() === today.getFullYear() &&
      bookingDate.getMonth() === today.getMonth() &&
      bookingDate.getDate() === today.getDate()
    );
  });

  // Filter upcoming bookings
  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.bookingDate);
    const today = new Date();
    return bookingDate > today;
  });

  // Booking stats
  const bookingStats = {
    today: todayBookings.length,
    upcoming: upcomingBookings.length,
    completed: bookings.filter((booking) => booking.status === "Completed").length,
    cancelled: bookings.filter((booking) => booking.status === "Cancelled").length,
  };

  // Automatic decline for pending bookings
  useEffect(() => {
    const automaticDecline = setTimeout(() => {
      const pendingBookings = bookings.filter(
        (booking) => booking.status === "Pending"
      );

      pendingBookings.forEach(async (booking) => {
        const now = new Date();
        const bookingTime = new Date(`${booking.bookingDate}T${booking.bookingTime}`);
        const timeDifference = (now - bookingTime) / (1000 * 60); // Difference in minutes

        if (timeDifference >= 30) {
          try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.patch(
              `http://localhost:8080/updatebooking/${booking.bookingId}`,
              { status: "Cancelled" },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            // Update the local state
            setBookings((prevBookings) =>
              prevBookings.map((b) =>
                b.bookingId === booking.bookingId ? response.data : b
              )
            );

            // Notify the customer
            toast.info(`Booking ${booking.bookingId} automatically declined due to no response.`);
          } catch (error) {
            console.error("Error auto-declining booking:", error);
          }
        }
      });
    }, 1000); // Check every second

    return () => clearTimeout(automaticDecline); // Cleanup on unmount
  }, [bookings]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen -mb-6">
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          style={{ width: 300, height: 300 }}
        />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

    return (
      <main className="flex-1 p-8 bg-gray-100">
         <ToastContainer />
        {/* Header with Stats */}
        <div className="bg-black text-white p-6 rounded-xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">Bookings Dashboard</h1>
              <p className="text-gray-400">
                Manage your upcoming rides and schedule
              </p>
            </div>
            <div className="flex gap-4">
              <select
                className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700"
                onChange={(e) => setStatusFilter(e.target.value)}
                value={statusFilter}
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg">
                <Filter size={18} />
                More Filters
              </button>
            </div>
          </div>
        </div>
  
        {/* Booking Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Today's Bookings"
            value={bookingStats.today}
            status="pending"
            subtext={`${bookings.filter((booking) => booking.status === "Pending").length} pending confirmations`}
          />
          <StatCard
            label="Upcoming"
            value={bookingStats.upcoming}
            status="upcoming"
            subtext="Next 7 days"
          />
          <StatCard
            label="Completed"
            value={bookingStats.completed}
            status="completed"
            subtext="This week"
          />
          <StatCard
            label="Cancelled"
            value={bookingStats.cancelled}
            status="cancelled"
            subtext="This week"
          />
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Bookings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold">Today's Bookings</h2>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    {todayBookings.length} rides
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              <div className="divide-y">
                {todayBookings
                  .filter((booking) => {
                    if (statusFilter === "All Status") return true;
                    return booking.status === statusFilter;
                  })
                  .map((booking, index) => (
                    <BookingItem
                      key={booking.bookingId || index}
                      {...booking}
                      onAction={handleBookingAction}
                    />
                  ))}
              </div>
            </div>
  
            {/* Upcoming Bookings */}
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
                  <button className="text-yellow-500 flex items-center gap-1 text-sm hover:text-yellow-600">
                    View All <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className="divide-y">
                {upcomingBookings
                  .filter((booking) => {
                    if (statusFilter === "All Status") return true;
                    return booking.status === statusFilter;
                  })
                  .map((booking, index) => (
                    <BookingItem
                      key={booking.bookingId || index}
                      {...booking}
                      showDate
                      onAction={handleBookingAction}
                    />
                  ))}
              </div>
            </div>
          </div>
  
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Filters */}
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h3 className="font-semibold mb-4">Quick Filters</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-between">
                  <span>Pending Confirmation</span>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-sm">
                    {bookings.filter((booking) => booking.status === "Pending").length}
                  </span>
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-between">
                  <span>Today's Schedule</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm">
                    {todayBookings.length}
                  </span>
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-between">
                  <span>This Week</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-sm">
                    {upcomingBookings.length}
                  </span>
                </button>
              </div>
            </div>
  
            {/* Notes */}
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-yellow-500 mb-4">
                <AlertCircle size={20} />
                <h3 className="font-semibold">Important Notes</h3>
              </div>
              <div className="space-y-4 text-sm text-gray-600">
                <p>• Confirm pending bookings within 30 minutes</p>
                <p>• Check pickup locations in advance</p>
                <p>• Update your status when completing rides</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  function StatCard({ label, value, status, subtext }) {
    const getBgColor = () => {
      switch (status) {
        case "pending":
          return "bg-yellow-50";
        case "upcoming":
          return "bg-blue-50";
        case "completed":
          return "bg-green-50";
        case "cancelled":
          return "bg-red-50";
        default:
          return "bg-gray-50";
      }
    };
    const getTextColor = () => {
      switch (status) {
        case "pending":
          return "text-yellow-700";
        case "upcoming":
          return "text-blue-700";
        case "completed":
          return "text-green-700";
        case "cancelled":
          return "text-red-700";
        default:
          return "text-gray-700";
      }
    };
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">{label}</span>
          <span
            className={`px-2 py-1 rounded-full text-sm ${getBgColor()} ${getTextColor()}`}
          >
            {status}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-sm text-gray-500">{subtext}</span>
        </div>
      </div>
    );
  }
  
  function BookingItem({
    bookingId,
    bookingDate,
    bookingTime,
    customerName,
    pickupLocation,
    destination,
    status,
    totalPrice,
    showDate = false,
    onAction,
  }) {
    // Ensure amount is defined and is a number
    const formattedAmount = totalPrice ? totalPrice.toFixed(2) : "0.00";

    const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);
    const currentTime = new Date();
    const isBookingTimeArrived = currentTime >= bookingDateTime;
  
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Clock size={20} className="text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium">
                {new Date(`${bookingDate}T${bookingTime}`).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h3>
              {showDate && (
                <p className="text-sm text-gray-600">
                  {new Date(bookingDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={14} />
                <span>{customerName}</span>
              </div>
            </div>
          </div>
          <div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : status === "Confirmed"
                  ? "bg-green-100 text-green-700"
                  : status === "Completed"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {status}
            </span>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Pickup</p>
              <p className="font-medium">{pickupLocation}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Drop-off</p>
              <p className="font-medium">{destination}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t">
  <p className="font-medium">Rs. {formattedAmount}</p>
  <div className="flex gap-3">
    {status === "Pending" && !isBookingTimeArrived ? (
      <>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
          onClick={() => onAction(bookingId, "Cancelled")}
        >
          <XCircle size={20} />
          Decline
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          onClick={() => onAction(bookingId, "Confirmed")}
        >
          <CheckCircle size={20} />
          Accept
        </button>
      </>
    ) : status === "Confirmed" && isBookingTimeArrived ? (
      <button
        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
        onClick={() => onAction(bookingId, "Completed")}
      >
        <CheckCircle size={20} />
        Complete
      </button>
    ) : status === "Confirmed" && !isBookingTimeArrived ? (
      <button
        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
        onClick={() => onAction(bookingId, "Cancelled")}
      >
        <XCircle size={20} />
        Cancel
      </button>
    ) : null}
  </div>
</div>
      </div>
    );
  }