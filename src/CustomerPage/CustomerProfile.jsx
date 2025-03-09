import { useState, useEffect } from "react";
import { FaEnvelope, FaEdit, FaUser } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/homepage/Header";
import Footer from "../components/homepage/Footer";
import BookingsList from "./BookingsList";

const CustomerProfile = () => {
  const [customer, setCustomer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("jwtToken");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");

  // Check if the user is authorized (ROLE_CUSTOMER) on component mount
  useEffect(() => {
    if (role !== "ROLE_CUSTOMER") {
      navigate("/unauthorized"); // Redirect to unauthorized page
    } else {
      fetchCustomerData();
      const today = new Date();
      const options = { weekday: "long", day: "2-digit", month: "long", year: "numeric" };
      setCurrentDate(today.toLocaleDateString("en-GB", options));
    }
  }, [navigate, role]);

  // Fetch customer data
  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/auth/getcustromerbyid/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomer(response.data);
      setUpdatedData(response.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
      toast.error("Failed to fetch customer data. Please try again.");
    }
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number format
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };
  // Handle profile update
  const handleUpdate = async () => {
    // Check if any field is empty
    if (!updatedData.customerName || !updatedData.customerEmail || !updatedData.customerPhone 
      || !updatedData.customerAddress) {
      toast.error("All fields must be filled.");
      return;
    }

    // Check if email is valid
    if (!validateEmail(updatedData.customerEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Check if phone number is valid
    if (!validatePhoneNumber(updatedData.customerPhone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      await axios.patch(`http://localhost:8080/updatecustomer/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCustomer(updatedData);
      setEditMode(false);
      
      // Show success message only when update is successful
      toast.success("Profile updated successfully!");

    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // If the user is not authorized, do not render the component
  if (role !== "ROLE_CUSTOMER") {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 p-6">
        <ToastContainer />
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-28">
          <div>
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <div className="flex flex-col items-start">
                <h2 className="text-3xl font-bold">Welcome, {customer?.customerName}</h2>
                <p className="text-gray-500 text-md mt-2">{currentDate}</p>
              </div>
              <button
                id = "customerEdit"
               className="bg-yellow-400 text-black px-4 py-2 rounded flex items-center"
                onClick={() => setEditMode(!editMode)}
              >
                <FaEdit 
                
                className="mr-2" /> Edit
              </button>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <div className="w-24 h-24 rounded-full mr-4 border flex items-center justify-center text-center font-semibold text-6xl text-white bg-gray-300">
              {customer?.customerName ? (
                <span>{customer.customerName.charAt(0).toUpperCase()}</span>
              ) : (
                <FaUser className="text-gray-600 text-4xl" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-serif">{customer?.customerName}</h3>
              <p className="text-gray-500 font-normal text-md">{customer?.customerEmail}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 font-thin">Full Name</label>
              {editMode ? (
                <input
                  id ="customerName"
                  type="text"
                  value={updatedData.customerName}
                  onChange={(e) => setUpdatedData({ ...updatedData, customerName: e.target.value })}
                  className="border p-2 w-full text-lg mt-2"
                />
              ) : (
                <p className="text-lg py-2 pl-2 w-full border bg-slate-100 mt-2 font-light">{customer?.customerName || "N/A"}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-thin">Email</label>
              {editMode ? (
                <input
                  id ="customerEmail"
                  type="email"
                  value={updatedData.customerEmail}
                  onChange={(e) => setUpdatedData({ ...updatedData, customerEmail: e.target.value })}
                  className="border p-2 w-full text-lg mt-2"
                />
              ) : (
                <p className="text-lg flex items-center py-2 pl-2 w-full border bg-slate-100 mt-2 font-light">
                  {customer?.customerEmail || "N/A"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-thin">Phone Number</label>
              {editMode ? (
                <input
                  id = "customerPhone"
                  type="number"
                  value={updatedData.customerPhone}
                  onChange={(e) => setUpdatedData({ ...updatedData, customerPhone: e.target.value })}
                  className="border p-2 w-full text-lg mt-2"
                />
              ) : (
                <p className="text-lg py-2 pl-2 w-full border bg-slate-100 mt-2 font-light">{customer?.customerPhone || "N/A"}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-thin">Address</label>
              {editMode ? (
                <input
                  id = "CustomerAddress"
                  type="text"
                  value={updatedData.customerAddress}
                  onChange={(e) => setUpdatedData({ ...updatedData, customerAddress: e.target.value })}
                  className="border p-2 w-full text-lg mt-2"
                />
              ) : (
                <p className="text-lg py-2 pl-2 w-full border bg-slate-100 mt-2 font-light">{customer?.customerAddress || "N/A"}</p>
              )}
            </div>
          </div>

          {editMode && (
            <button
            id = "update"
              className="w-full bg-green-500 text-white p-2 rounded mt-6 hover:bg-green-600"
              onClick={handleUpdate}
            >
              Save Changes
            </button>
          )}
          <p className="mt-6 font-semibold">My Email Address</p>
          <div className="flex gap-3">
            <div className="p-2 bg-slate-200 w-fit rounded-full mt-3">
              <FaEnvelope className="text-lg text-blue-500" />
            </div>
            <p className="mt-3">{customer?.customerEmail}</p>
          </div>
        </div>
      </div>
      <BookingsList />
      <Footer />
    </>
  );
};

export default CustomerProfile;
