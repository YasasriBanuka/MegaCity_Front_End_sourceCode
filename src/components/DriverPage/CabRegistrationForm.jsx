import  { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import Footer from "../homepage/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const CabRegistrationForm = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    cabModel: "",
    numberPlate: "",
    cabCategory: "",
    driverName: "",
    driverEmail: "",
    driverPhone: "",
    carImage: null,
    driverImage: null,
    licenseImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        [field]: imageUrl,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if driverName is defined
    if (!formData.driverName) {
      alert("Driver name is required.");
      return;
    }
  
    // Create a FormData object
    const formDataToSend = new FormData();
    formDataToSend.append("cabModel", formData.cabModel);
    formDataToSend.append("cabNumberPlate", formData.numberPlate);
    formDataToSend.append("seats", 4); // Example value, replace with dynamic input if needed
    formDataToSend.append("availabilityStatus", "Pending"); // Default status
    formDataToSend.append("hasAC", true); // Example value, replace with dynamic input if needed
    formDataToSend.append("luggageCapacity", "Medium"); // Example value, replace with dynamic input if needed
    formDataToSend.append("driverName", formData.driverName);
    formDataToSend.append("driveremail", formData.driverEmail);
    formDataToSend.append("password", "123"); // Replace with a secure password or input field
    formDataToSend.append("contactNumber", formData.driverPhone);
    formDataToSend.append("location", "Colombo");
    
    // Check if driverName is defined before using it
    const userName = formData.driverName ? formData.driverName.toLowerCase().replace(/\s+/g, "") : "";
    formDataToSend.append("userName", userName);
    
    formDataToSend.append("categoryId", formData.cabCategory);
  
    // Append the images to the FormData object
    if (formData.carImage) {
      const carImageFile = await fetch(formData.carImage).then(res => res.blob());
      formDataToSend.append("imageUrl", carImageFile, "carImage.jpg");
    }
    if (formData.driverImage) {
      const driverImageFile = await fetch(formData.driverImage).then(res => res.blob());
      formDataToSend.append("driveImage", driverImageFile, "driverImage.jpg");
    }
    if (formData.licenseImage) {
      const licenseImageFile = await fetch(formData.licenseImage).then(res => res.blob());
      formDataToSend.append("licenseImage", licenseImageFile, "licenseImage.jpg");
    }
  
    try {
      // Send POST request to backend
      const response = await fetch("http://localhost:8080/auth/createcab", {
        method: "POST",
        body: formDataToSend,
      });
  
      if (!response.ok) {
        throw new Error("Failed to register cab");
      }
  
      const data = await response.json();
      console.log("Cab registered successfully:", data);
  
      // Reset form after successful submission
      setFormData({
        cabModel: "",
        numberPlate: "",
        cabCategory: "",
        driverName: "",
        driverEmail: "",
        driverPhone: "",
        carImage: null,
        driverImage: null,
        licenseImage: null,
      });
  
      toast.success("Cab Registration Successfully..!")
    } catch (error) {
      console.error("Error registering cab:", error);
      alert("Failed to register cab. Please try again.");
    }
  };



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/getallcategories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    fetchCategories();
  }, []);

  return (
    
    <div>
      <ToastContainer/>
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 via-white to-amber-50 p-4 sm:p-6 md:p-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-black mb-2">
            Cab Registration
          </h1>
          <p className="text-gray-600">
            Enter your cab and driver details below
          </p>
        </div>

        {/* Cab Details Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4 flex items-center">
            <span className="w-8 h-8 rounded-full bg-yellow-300 text-black flex items-center justify-center mr-2 text-sm">
              1
            </span>
            Cab Details
          </h2>
          <div className="space-y-4">
            <div className="transition-all duration-200 hover:translate-x-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cab Model
              </label>
              <input
                id = "type"
                type="text"
                name="cabModel"
                value={formData.cabModel}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Toyota Camry 2020"
                required
              />
            </div>
            <div className="transition-all duration-200 hover:translate-x-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cab Category
              </label>
              <select
                id= "cabCategory"
                name="cabCategory"
                value={formData.cabCategory}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white"
                required
              >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>

            </div>
            <div className="transition-all duration-200 hover:translate-x-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number Plate
              </label>
              <input
                id ="number"
                type="text"
                name="numberPlate"
                value={formData.numberPlate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., ABC-123"
                required
              />
            </div>
          </div>
        </div>

        {/* Driver Details Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4 flex items-center">
            <span className="w-8 h-8 rounded-full bg-yellow-300 text-black flex items-center justify-center mr-2 text-sm">
              2
            </span>
            Driver Details
          </h2>
          <div className="space-y-4">
            <div className="transition-all duration-200 hover:translate-x-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver Name
              </label>
              <input
                id = "name"
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                placeholder="Full Name"
                required
              />
            </div>
            <div className="transition-all duration-200 hover:translate-x-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id = "email"
                type="email"
                name="driverEmail"
                value={formData.driverEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                placeholder="driver@example.com"
                required
              />
            </div>
            <div className="transition-all duration-200 hover:translate-x-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id ="phone"
                type="tel"
                name="driverPhone"
                value={formData.driverPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., +1 (234) 567-8900"
                required
              />
            </div>
          </div>
        </div>

        {/* Required Documents Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4 flex items-center">
            <span className="w-8 h-8 rounded-full bg-yellow-300 text-black flex items-center justify-center mr-2 text-sm">
              3
            </span>
            Required Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Car Image Upload */}
            <div className="flex flex-col items-center">
              <div className="w-full h-44 border-2 border-dashed border-yellow-200 bg-yellow-50 rounded-lg flex flex-col items-center justify-center p-4 hover:bg-yellow-100 hover:border-yellow-300 transition-all duration-300 cursor-pointer">
                {formData.carImage ? (
                  <img
                    src={formData.carImage}
                    alt="Car Preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-yellow-400 mb-2" />
                    <p className="text-sm text-black font-medium">
                      Upload Car Photo
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Click or drag file
                    </p>
                  </>
                )}
                <input
                  type="file"
                  name  ="image"
                  onChange={(e) => handleImageChange(e, "carImage")}
                  className="hidden"
                  id="carImage"
                  accept="image/*"
                  required
                />
              </div>
              <label
                id = "carImage"
                htmlFor="carImage"
                className="mt-2 text-sm text-black cursor-pointer font-medium"
              >
                Car Photo
              </label>
            </div>

            {/* Driver Image Upload */}
            <div className="flex flex-col items-center">
              <div className="w-full h-44 border-2 border-dashed border-yellow-200 bg-yellow-50 rounded-lg flex flex-col items-center justify-center p-4 hover:bg-yellow-100 hover:border-yellow-300 transition-all duration-300 cursor-pointer">
                {formData.driverImage ? (
                  <img
                    src={formData.driverImage}
                    alt="Driver Preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-yellow-400 mb-2" />
                    <p className="text-sm text-black font-medium">
                      Upload Driver Photo
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Click or drag file
                    </p>
                  </>
                )}
                <input
                  type="file"
                  name = "DriverImage"
                  onChange={(e) => handleImageChange(e, "driverImage")}
                  className="hidden"
                  id="driverImage"
                  accept="image/*"
                  required
                />
              </div>
              <label
                htmlFor="driverImage"
                className="mt-2 text-sm text-black cursor-pointer font-medium"
              >
                Driver Photo
              </label>
            </div>

            {/* License Image Upload */}
            <div className="flex flex-col items-center">
              <div className="w-full h-44 border-2 border-dashed border-yellow-200 bg-yellow-50 rounded-lg flex flex-col items-center justify-center p-4 hover:bg-yellow-100 hover:border-yellow-300 transition-all duration-300 cursor-pointer">
                {formData.licenseImage ? (
                  <img
                    src={formData.licenseImage}
                    alt="License Preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-yellow-400 mb-2" />
                    <p className="text-sm text-black font-medium">
                      Upload License
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Click or drag file
                    </p>
                  </>
                )}
                <input
                  type="file"
                  name = "LicenseImage"
                  onChange={(e) => handleImageChange(e, "licenseImage")}
                  className="hidden"
                  id="licenseImage"
                  accept="image/*"
                  required
                />
              </div>
              <label
                htmlFor="licenseImage"
                className="mt-2 text-sm text-black cursor-pointer font-medium"
              >
                License Photo
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          id ="submit"
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-300 to-amber-300 text-black py-3 px-4 rounded-lg  focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02]"
        >
          Register Cab
        </button>
      </form>
    </div>
    <Footer/>
    </div>
  );
};