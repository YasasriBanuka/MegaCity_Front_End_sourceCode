import { useState } from "react";
import axios from "axios";

const DriverSignup = () => {
  const [formData, setFormData] = useState({
    driverName: "",
    driveremail: "",
    password: "",
    licenseNumber: "",
    contactNumber: "",
    userName: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form Validation
  const validateForm = () => {
    let newErrors = {};
    if (!formData.driverName.trim()) newErrors.driverName = "Driver name is required.";
    if (!formData.driveremail.trim() || !/\S+@\S+\.\S+/.test(formData.driveremail))
      newErrors.driveremail = "Valid email is required.";
    if (!formData.password.trim() || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required.";
    if (!formData.contactNumber.trim() || !/^\d{10}$/.test(formData.contactNumber))
      newErrors.contactNumber = "Enter a valid 10-digit phone number.";
    if (!formData.userName.trim()) newErrors.userName = "Username is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await axios.post("http://localhost:8080/auth/createDriver", formData);
        console.log("Registration Successful:", response.data);
        alert("Driver registered successfully!");

        // Reset Form
        setFormData({
          driverName: "",
          driveremail: "",
          password: "",
          licenseNumber: "",
          contactNumber: "",
          userName: "",
        });
        setErrors({});
      } catch (error) {
        console.error("Registration Failed", error);
        alert("Error in registration. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Driver Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Driver Name */}
          <div>
            <label className="block font-medium text-gray-700">Driver Name</label>
            <input
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {errors.driverName && <p className="text-red-500 text-sm">{errors.driverName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="driveremail"
              value={formData.driveremail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {errors.driveremail && <p className="text-red-500 text-sm">{errors.driveremail}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* License Number */}
          <div>
            <label className="block font-medium text-gray-700">License Number</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {errors.licenseNumber && <p className="text-red-500 text-sm">{errors.licenseNumber}</p>}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {errors.userName && <p className="text-red-500 text-sm">{errors.userName}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register as Driver"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverSignup;
