import { useState, useEffect } from "react";
import axios from "axios";
import {
  Car,
  BellRing,
  Menu,
  ChevronRight,
  TrendingUp,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [recentCabs, setRecentCabs] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [totalCabs, setTotalCabs] = useState(0);
  const [activeDrivers, setActiveDrivers] = useState(0);
  const [availableDrivers, setAvailableDrivers] = useState(0);
  const [unavailableDrivers, setUnavailableDrivers] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const navigate = useNavigate();

  // Fetch all cabs
  useEffect(() => {
    const fetchCabs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/auth/getallCabs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        setRecentCabs(response.data);

        // Calculate driver stats
        const totalDrivers = response.data.length;
        const activeDriversCount = response.data.filter(
          (cab) => cab.status === "Active"
        ).length;
        const availableDriversCount = response.data.filter(
          (cab) => cab.availability === "Available"
        ).length;
        const unavailableDriversCount = response.data.filter(
          (cab) => cab.availability === "Unavailable"
        ).length;
        const pendingApprovalsCount = response.data.filter(
          (cab) => cab.availabilityStatus === "Pending"
        ).length;

        setTotalCabs(totalDrivers);
        setActiveDrivers(activeDriversCount);
        setAvailableDrivers(availableDriversCount);
        setUnavailableDrivers(unavailableDriversCount);
        setPendingApprovals(pendingApprovalsCount);
      } catch (error) {
        console.error("Error fetching cabs:", error);
      }
    };

    fetchCabs();
  }, []);

  // Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:8080/getallbookings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        setAllBookings(response.data);

        // Calculate monthly revenue
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyBookings = response.data.filter((booking) => {
          const bookingDate = new Date(booking.bookingDate);
          return (
            bookingDate.getMonth() === currentMonth &&
            bookingDate.getFullYear() === currentYear &&
            booking.status === "Completed"
          );
        });

        const revenue = monthlyBookings.reduce(
          (sum, booking) => sum + booking.totalPrice,
          0
        );
        setMonthlyRevenue(revenue);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button className="lg:hidden text-gray-500 hover:text-gray-700">
              <Menu className="w-6 h-6" />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <BellRing className="w-6 h-6" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
              Dashboard Overview
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                {
                  icon: Car,
                  value: totalCabs,
                  label: "Total Registered Cabs",
                  color: "text-yellow-500",
                },
                {
                  icon: UserCheck,
                  value: totalCabs,
                  label: "Active Drivers",
                  color: "text-green-500",
                },
                {
                  icon: TrendingUp,
                  value: `Rs.${monthlyRevenue.toLocaleString()}`,
                  label: "Monthly Revenue",
                  color: "text-blue-500",
                },
                {
                  icon: AlertTriangle,
                  value: pendingApprovals,
                  label: "Pending Approvals",
                  color: "text-orange-500",
                },
              ].map(({ icon: Icon, value, label, color }) => (
                <div
                  key={label}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${color}`} />
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Registrations Table */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Pending Registrations
              </h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left bg-gray-200 text-gray-700">
                      <th className="px-4 py-3 font-semibold text-sm">
                        Driver Name
                      </th>
                      <th className="px-4 py-3 font-semibold text-sm">
                        Cab Model
                      </th>
                      <th className="px-4 py-3 font-semibold text-sm">
                        Category
                      </th>
                      <th className="px-4 py-3 font-semibold text-sm">Status</th>
                      <th className="px-4 py-3 font-semibold text-sm text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {recentCabs.filter((cab) => cab.availabilityStatus === "Pending").length > 0 ? (
                      recentCabs
                        .filter((cab) => cab.availabilityStatus === "Pending")
                        .map((cab) => (
                          <tr key={cab.cabId} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm text-gray-800">
                              {cab.driverName}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                              {cab.cabModel}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                              {cab.categoryName}
                            </td>
                            <td className="px-4 py-4">
                              <span className="px-3 py-1 text-xs font-medium rounded-full text-yellow-700 bg-yellow-100">
                                {cab.availabilityStatus}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <button
                                className="px-4 py-2 text-xs font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
                                onClick={() => navigate(`/admin/cabdetails/${cab.cabId}`)}
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-4 text-center text-sm text-gray-500"
                        >
                          No pending registrations found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;