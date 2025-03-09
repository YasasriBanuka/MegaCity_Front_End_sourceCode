import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import {
  Mail,
  Car,
  User,
  CreditCard,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Unauthorized from "../Authenticationpage/Unauthorized"; // Import the Unauthorized component
import Lottie from "lottie-react";
import loadingAnimation from "../assets/images/loadingAnimation.json";

export const CabDetails = () => {
  const navigate = useNavigate();
  const { cabId } = useParams();
  const [cab, setCab] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("pending");

  // Get JWT token and role from localStorage
  const token = localStorage.getItem("jwtToken");
  const role = localStorage.getItem("role");

  // Redirect if user is not an admin
  useEffect(() => {
    if (role !== "ROLE_ADMIN") {
      navigate("/unauthorized"); // Redirect to unauthorized page
    }
  }, [role, navigate]);

  // Fetch cab details
  useEffect(() => {
    if (!cabId || !token) return;

    axios
      .get(`http://localhost:8080/auth/getcabbyid/${cabId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCab(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cab details:", error);
      });
  }, [cabId, token]);

  // Handle approve registration
  const handleApprove = () => {
    axios
      .put(
        `http://localhost:8080/auth/updatecab/${cabId}`,
        {
          availabilityStatus: "Available",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setRegistrationStatus("approved");
        setCab(response.data);
      })
      .catch((error) => {
        console.error("Error updating cab status:", error);
      });
  };

  // Handle reject registration
  const handleReject = () => {
    axios
      .delete(`http://localhost:8080/deletecab/${cabId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setRegistrationStatus("rejected");
        navigate("/admin/dashboard"); // Redirect to dashboard after rejection
      })
      .catch((error) => {
        console.error("Error deleting cab:", error);
      });
  };

  // If user is not an admin, show Unauthorized component
  if (role !== "ROLE_ADMIN") {
    return <Unauthorized />;
  }

  // Loading state
  if (!cab) {
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

  return (
    <div className="w-full bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Status Banner */}
        <div
          className={`mb-6 rounded-lg p-4 ${
            registrationStatus === "pending"
              ? "bg-yellow-50 border border-yellow-200"
              : registrationStatus === "approved"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {registrationStatus === "pending" && (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              {registrationStatus === "approved" && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {registrationStatus === "rejected" && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <h2 className="font-medium">
                  {registrationStatus === "pending" &&
                    "New Registration Pending Review"}
                  {registrationStatus === "approved" && "Registration Approved"}
                  {registrationStatus === "rejected" && "Registration Rejected"}
                </h2>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  Submitted on {new Date(cab.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {registrationStatus === "pending" && (
              <div className="flex space-x-3">
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-200"
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  Approve Registration
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={cab.driveImage}
                alt="Driver"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                  registrationStatus === "pending"
                    ? "bg-yellow-400"
                    : registrationStatus === "approved"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></div>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{cab.driverName}</h1>
              <p className="text-gray-500 flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {cab.location || "Unknown City"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Driver Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
                Driver Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{cab.driverName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{cab.driveremail}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{cab.contactNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{cab.location || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="text-xl mt-6 flex gap-4 font-thin"
              onClick={() => navigate("/admin/dashboard")}
            >
              <FaArrowLeftLong className="text-2xl mt-1" /> Back
            </button>
          </div>

          {/* Vehicle Information and Documents */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
                Vehicle Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Car className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Cab Model</p>
                      <p className="font-medium">{cab.cabModel}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <span className="text-gray-500">#</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Plate Number</p>
                      <p className="font-medium">{cab.cabNumberPlate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
                Documents
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Cab Photo</p>
                  <div className="group relative">
                    <img
                      src={cab.imgUrl}
                      alt="Cab"
                      className="w-full h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Driver License
                  </p>
                  <div className="group relative">
                    <img
                      src={cab.licenseImage}
                      alt="Driver License"
                      className="w-full h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Notes Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
                Admin Notes
              </h2>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add notes about this registration..."
                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};