import {
  Car,
  DollarSign,
  Clock,
  Star,
  MapPin,
  Power,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export function DriverDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driverName, setDriverName] = useState("John"); // Default name
  const [reviews, setReviews] = useState([]); // State for reviews
  const [averageRating, setAverageRating] = useState(0); // State for average rating
  const [totalReviews, setTotalReviews] = useState(0); // State for total reviews
  const [todayEarnings, setTodayEarnings] = useState(0); // State for today's earnings
  const [completedTrips, setCompletedTrips] = useState(0); // State for completed trips
  const [weeklyEarnings, setWeeklyEarnings] = useState(0); // State for weekly earnings
  const [weeklyTrips, setWeeklyTrips] = useState(0); // State for weekly trips
  const [weeklyHours, setWeeklyHours] = useState(0); // State for weekly hours
  const [acceptanceRate, setAcceptanceRate] = useState(95); // State for acceptance rate
  const [cancellationRate, setCancellationRate] = useState(2); // State for cancellation rate
  const today = new Date();

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

        // Filter bookings for today
        const todayBookings = response.data.filter((booking) => {
          const bookingDate = new Date(booking.bookingDate); // Parse bookingDate
          const today = new Date(); // Get today's date

          // Compare year, month, and day
          return (
            bookingDate.getFullYear() === today.getFullYear() &&
            bookingDate.getMonth() === today.getMonth() &&
            bookingDate.getDate() === today.getDate() &&
            booking.status === "Pending" // Filter by status
          );
        });

        setBookings(todayBookings);

        // Calculate today's earnings and completed trips
        const completedTodayBookings = response.data.filter(
          (booking) =>
            booking.status === "Completed" &&
            new Date(booking.bookingDate).toDateString() === today.toDateString()
        );

        const totalEarnings = completedTodayBookings.reduce(
          (sum, booking) => sum + booking.totalPrice,
          0
        );
        setTodayEarnings(totalEarnings.toFixed(2));
        setCompletedTrips(completedTodayBookings.length);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Fetch driver's name
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("jwtToken");

    if (userId && token) {
      axios
        .get(`http://localhost:8080/auth/getcabbyid/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setDriverName(response.data.userName); // Assuming the API returns driver details with a `name` field
        })
        .catch((error) => {
          console.error("Error fetching driver details:", error);
        });
    }
  }, []);

  // Fetch reviews and calculate average rating
  useEffect(() => {
    const fetchReviews = async () => {
      const cabId = localStorage.getItem("userId");
      const token = localStorage.getItem("jwtToken");

      if (!cabId || !token) {
        console.error("Cab ID or token not found.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/review/${cabId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(response.data);
        calculateAverageRating(response.data); // Calculate average rating
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      setAverageRating(0);
      setTotalReviews(0);
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / reviews.length;
    setAverageRating(average.toFixed(1)); // Round to 1 decimal place
    setTotalReviews(reviews.length);
  };

  // Fetch weekly summary
  useEffect(() => {
    const fetchWeeklySummary = async () => {
      const cabId = localStorage.getItem("userId");
      const token = localStorage.getItem("jwtToken");

      if (!cabId || !token) {
        console.error("Cab ID or token not found.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/getbookingsbycab/${cabId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const today = new Date();
        const pastWeekBookings = response.data.filter((booking) => {
          const bookingDate = new Date(booking.bookingDate);
          const diffTime = Math.abs(today - bookingDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7 && booking.status === "Completed";
        });

        const totalEarnings = pastWeekBookings.reduce(
          (sum, booking) => sum + booking.totalPrice,
          0
        );
        const totalTrips = pastWeekBookings.length;

        setWeeklyEarnings(totalEarnings.toFixed(2));
        setWeeklyTrips(totalTrips);
      } catch (error) {
        console.error("Error fetching weekly summary:", error);
      }
    };

    fetchWeeklySummary();
  }, []);

  return (
    <main className="flex-1 p-8 bg-gray-200">
      {/* Welcome Banner */}
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-black text-white p-6 rounded-xl mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-yellow-400 rounded-xl">
              <Car className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">Welcome back, {driverName}!</h1>
              <p className="text-gray-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                • {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2">
              <Power size={18} />
              Online
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<DollarSign className="text-yellow-400" size={24} />}
            title="Today's Earnings"
            value={`Rs.${todayEarnings}`}
            trend="+12.5%"
          />
          <StatCard
            icon={<Clock className="text-yellow-400" size={24} />}
            title="Hours Online"
            value={`30.9 h`}
            trend="Active"
            trendColor="text-green-500"
          />
          <StatCard
            icon={<Car className="text-yellow-400" size={24} />}
            title="Completed Trips"
            value={completedTrips}
            trend="Today"
          />
          <StatCard
            icon={<Star className="text-yellow-400" size={24} />}
            title="Rating"
            value={averageRating}
            trend={`${totalReviews} reviews`}
            trendColor="text-green-500"
          />
        </div>

        {/* Schedule and Weekly Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Today's Schedule</h2>
              <Link to="/driver/driverbooking">
                <button className="text-yellow-500 flex items-center gap-1 text-sm hover:text-yellow-600">
                  View All <ChevronRight size={16} />
                </button>
              </Link>
            </div>
            {loading ? (
              <p>Loading bookings...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : bookings.length === 0 ? (
              <p>No pending bookings found for today.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-20 text-sm font-medium text-gray-600">
                      {new Date(
                        `${booking.bookingDate}T${booking.bookingTime}`
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User size={16} className="text-gray-400" />
                        <span className="font-medium">{booking.customerName}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="mt-1" />
                        <span>
                          {booking.pickupLocation} → {booking.destination}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          booking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weekly Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-6">Weekly Summary</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-xl font-semibold">Rs.{weeklyEarnings}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="text-green-600" size={20} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed Trips</span>
                  <span className="font-medium">{weeklyTrips}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Hours</span>
                  <span className="font-medium">30.9 h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Acceptance Rate</span>
                  <span className="font-medium">{acceptanceRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cancellation Rate</span>
                  <span className="font-medium">{cancellationRate}%</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-yellow-500">
                  <AlertCircle size={16} />
                  <span className="text-sm">
                    Your performance is above average
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// StatCard Component
function StatCard({ icon, title, value, trend, trendColor = "text-gray-500" }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100">
      <div className="flex items-center gap-4 mb-3">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        <span className="text-gray-600">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`text-sm ${trendColor}`}>{trend}</span>
      </div>
    </div>
  );
}