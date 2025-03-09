import { useState } from "react";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Lock,
  UserCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios"; // Import axios for making API calls
import { ToastContainer, toast } from "react-toastify"; // Import toast components
import "react-toastify/dist/ReactToastify.css"; // Import toast styles


export const SignUpPage = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerAddress: "",
    customerEmail: "",
    userName: "",
    password: "",
    confirmPassword: "",
    customerPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true); // State to track username availability

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName) newErrors.customerName = "Full name is required";
    if (!formData.customerAddress) newErrors.customerAddress = "Address is required";
    if (!formData.customerEmail) newErrors.customerEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.customerEmail))
      newErrors.customerEmail = "Email is invalid";
    if (!formData.userName) newErrors.userName = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.customerPhone) newErrors.customerPhone = "Phone number is required";
    else if (!/^\+94\s?\d{2}\s?\d{3}\s?\d{4}$/.test(formData.customerPhone))
      newErrors.customerPhone = "Phone number must be in the format +94 XX XXX XXXX";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() && usernameAvailable) {
      try {
        // Remove confirmPassword before sending to the backend
        const { confirmPassword, ...dataToSend } = formData;
        const response = await axios.post("http://localhost:8080/auth/createCustomer", dataToSend);
        console.log("Form submitted successfully:", response.data);

        // Show success toast
        toast.success("Account created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Optionally, reset the form after successful submission
        setFormData({
          customerName: "",
          customerAddress: "",
          customerEmail: "",
          userName: "",
          password: "",
          confirmPassword: "",
          customerPhone: "",
        });
      } catch (error) {
        console.error("Error submitting form:", error);

        // Show error toast
        toast.error("Failed to create account. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const checkUsernameAvailability = async () => {
    if (formData.userName) {
      try {
        const response = await axios.get(`http://localhost:8080/auth/checkUsername?userName=${formData.userName}`);
        setUsernameAvailable(!response.data.exists); // Update username availability state

        if (response.data.exists) {
          // Show error toast if username is taken
          toast.error("Username already taken. Please choose another one.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } 
      } catch (error) {
        console.error("Error checking username availability:", error);

        // Show error toast
        toast.error("Error checking username availability. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 -mb-6">
      {/* Toast Container */}
      <ToastContainer />
      {/* Top Checkered Border */}
      <div className="max-w-2xl mx-auto p-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className=" px-6 py-8 text-center">
            <h1 className="text-4xl font-bold text-black mb-2">
              Create Your Account
            </h1>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id = "fullname"
                    type="text"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerName: e.target.value,
                      })
                    }
                    className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 ${errors.customerName ? "border-red-500" : ""}`}
                    placeholder="John Doe"
                    autoComplete="name"
                    required
                  />
                </div>
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id = "username"
                    type="text"
                    value={formData.userName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        userName: e.target.value,
                      })
                    }
                    onBlur={checkUsernameAvailability} // Check username availability on blur
                    className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 ${errors.userName || !usernameAvailable ? "border-red-500" : ""}`}
                    placeholder="johndoe123"
                    autoComplete="username"
                    required
                  />
                </div>
                {errors.userName && (
                  <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
                )}
                {!usernameAvailable && (
                  <p className="text-red-500 text-sm mt-1">
                    Username already taken. Please choose another one.
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id = "email"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerEmail: e.target.value,
                      })
                    }
                    className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 ${errors.customerEmail ? "border-red-500" : ""}`}
                    placeholder="john@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
                {errors.customerEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id = "contactnumber"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerPhone: e.target.value,
                      })
                    }
                    className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 ${errors.customerPhone ? "border-red-500" : ""}`}
                    placeholder="+94 XX XXX XXXX"
                    autoComplete="tel"
                    required
                  />
                </div>
                {errors.customerPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id = "password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 ${errors.password ? "border-red-500" : ""}`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id = "confirmpassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Address - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  id = "address"
                  type="text"
                  value={formData.customerAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customerAddress: e.target.value,
                    })
                  }
                  className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 ${errors.customerAddress ? "border-red-500" : ""}`}
                  placeholder="Enter your full address"
                  autoComplete="address-line1"
                  required
                />
              </div>
              {errors.customerAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.customerAddress}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                id = "submit"
                type="submit"
                className="w-full bg-[#FDB813] text-white py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
              >
                Create Account
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>
      {/* Bottom Checkered Border */}
    </div>
  );
};

export default SignUpPage;