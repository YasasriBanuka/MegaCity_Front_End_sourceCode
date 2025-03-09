import { useState, useRef, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapPin, Calendar, Clock, User, Mail, Car } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../Authenticationpage/AuthContext"; // Adjust the path as needed
import Footer from "../homepage/Footer";
import Header from "../homepage/Header";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const GOOGLE_MAPS_API_KEY = "AIzaSyD3WC4ofY-qZw1skED-PgJthpJBj7IImyw";

// List of supported countries with their codes and phone number regex patterns
const COUNTRIES = [
  { code: "+94", name: "SL", regex: /^(0|94)?[1-9]\d{8}$/ }, // Sri Lanka
  { code: "+91", name: "India", regex: /^(0|91)?[6-9]\d{9}$/ }, // India
  { code: "+1", name: "USA", regex: /^[2-9]\d{9}$/ }, // USA
  { code: "+44", name: "UK", regex: /^(\+44|0)7\d{9}$/ }, // UK
];

const BookingForm = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { cab } = location.state || {};
  const [formData, setFormData] = useState({
    pickup: "",
    destination: "",
    date: "",
    time: "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    countryCode: "+94", // Default to Sri Lanka's country code
  });
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [phoneError, setPhoneError] = useState(""); // For phone number validation
  const [emailError, setEmailError] = useState(""); // For email validation
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const directionsService = useRef(null);
  const directionsRenderer = useRef(null);

  // Get current date and time
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const currentTime = now.toTimeString().split(" ")[0].slice(0, 5); // Format: HH:MM

  // Handle date change
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate < currentDate) {
      alert("Please select a date in the future.");
      return;
    }
    setFormData({ ...formData, date: selectedDate });
  };

  // Handle time change
  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    const selectedDate = formData.date || currentDate;

    // Combine selected date and time into a single datetime object
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    if (selectedDateTime < now) {
      alert("Please select a time in the future.");
      return;
    }
    setFormData({ ...formData, time: selectedTime });
  };

  // Validate phone number based on selected country
  const validatePhoneNumber = (phone, countryCode) => {
    const country = COUNTRIES.find((c) => c.code === countryCode);
    if (!country) return false;
    return country.regex.test(phone);
  };

  // Handle phone number change
  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setFormData({ ...formData, phone });

    if (!validatePhoneNumber(phone, formData.countryCode)) {
      setPhoneError(`Please enter a valid ${COUNTRIES.find((c) => c.code === formData.countryCode)?.name} phone number.`);
    } else {
      setPhoneError("");
    }
  };

  // Validate email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    return regex.test(email);
  };

  // Handle email change
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email });

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  // Load Google Maps
  useEffect(() => {
    const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY, libraries: ["places"] });
    loader.load().then(() => {
      if (!mapInstance.current) {
        mapInstance.current = new google.maps.Map(mapRef.current, {
          center: { lat: 7.8731, lng: 80.7718 },
          zoom: 8,
        });
        directionsService.current = new google.maps.DirectionsService();
        directionsRenderer.current = new google.maps.DirectionsRenderer();
        directionsRenderer.current.setMap(mapInstance.current);
      }
    });
  }, []);

  // Handle place selection for pickup and destination
  const handlePlaceSelect = (inputType) => {
    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById(inputType),
      { types: ["geocode"], componentRestrictions: { country: "LK" } }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      setFormData((prev) => ({ ...prev, [inputType]: place.formatted_address }));

      if (inputType === "pickup") setPickupCoords(location);
      if (inputType === "destination") setDestinationCoords(location);
    });
  };

  // Calculate route and distance
  useEffect(() => {
    if (pickupCoords && destinationCoords) {
      calculateRoute();
    }
  }, [pickupCoords, destinationCoords]);

  const calculateRoute = () => {
    if (directionsService.current && pickupCoords && destinationCoords) {
      directionsService.current.route(
        {
          origin: pickupCoords,
          destination: destinationCoords,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.current.setDirections(result);
            setDistance(result.routes[0].legs[0].distance.text);
          } else {
            setDistance("Could not calculate distance");
          }
        }
      );
    }
  };


  const checkCabAvailability = async () => {
    try {
      const response = await axios.get("http://localhost:8080/auth/checkAvailability", {
        params: {
          cabId: cab?.cabId,
          bookingDate: formData.date,
          bookingTime: formData.time,
        },
      });

      if (response.data) {
        toast.error("This cab is already booked for the selected date and time.");
        return false; // Cab is already booked
      }
      return true; // Cab is available
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("An error occurred while checking availability."); 
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number before submission
    if (!validatePhoneNumber(formData.phone, formData.countryCode)) {
      setPhoneError(`Please enter a valid ${COUNTRIES.find((c) => c.code === formData.countryCode)?.name} phone number.`);
      return;
    }

    // Validate email before submission
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }


    const isCabAvailable = await checkCabAvailability();
    if (!isCabAvailable) return; 

    const customerId = user?.userId || localStorage.getItem("userId");

    const bookingData = {
      customerName: formData.name,
      pickupLocation: formData.pickup,
      destination: formData.destination,
      bookingDate: formData.date,
      bookingTime: formData.time,
      email: formData.email,
      phoneNumber: `${formData.countryCode}${formData.phone}`, // Include country code
      status: "Pending",
      cabId: cab?.cabId || "",
      customerId: customerId,
      totalPrice:totalPrice,
    };

    try {
      const response = await axios.post("http://localhost:8080/auth/addbooking", bookingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      console.log("Booking successful:", response.data);
      alert("Your booking request has been sent to a driver. You will receive a confirmation shortly. Thank you for choosing our service!");
      window.location.href = "/customerprofile";
    } catch (error) {
      console.error("Error booking:", error);
      alert("Booking failed. Please try again.");
    }
  };

  // Calculate total price
  const distanceString = distance || "";
  const numericDistance = parseFloat(distanceString.replace(/[^\d.]/g, ""));
  const pricePerKm = cab?.pricePerKm || 0;
  const totalPrice = numericDistance * pricePerKm;

  return (
    <>
      <Header />
      <div className="bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      <ToastContainer />
        <div className="max-w-7xl mx-auto p-4 py-8">
          <h1 className="text-4xl font-bold mb-6 mt-28 text-center">Book Your Ride</h1>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Location Inputs */}
              <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="text-lg font-medium mb-4">Route Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        id="pickup"
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg border-yellow-500"
                        placeholder="Enter pickup location"
                        value={formData.pickup}
                        onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                        onFocus={() => handlePlaceSelect("pickup")}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destination
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        id="destination"
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg border-yellow-500"
                        placeholder="Enter destination"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        onFocus={() => handlePlaceSelect("destination")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-medium mb-4">Schedule</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg border-yellow-500"
                        value={formData.date}
                        onChange={handleDateChange}
                        min={currentDate} // Prevent selecting past dates
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="time"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg border-yellow-500"
                        value={formData.time}
                        onChange={handleTimeChange}
                        min={formData.date === currentDate ? currentTime : "00:00"} // Prevent selecting past times
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-medium mb-4">Customer Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg border-yellow-500"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="email"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg border-yellow-500"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleEmailChange}
                      />
                      {emailError && (
                        <p className="text-sm text-red-500 mt-1">{emailError}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <div className="flex">
                        <select
                          className="w-32 pl-3 pr-2 py-2 border rounded-l-lg border-yellow-500 bg-white"
                          value={formData.countryCode}
                          onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        >
                          {COUNTRIES.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.code} ({country.name})
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          className="w-full pl-10 pr-4 py-2 border rounded-r-lg border-yellow-500"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                        />
                      </div>
                      {phoneError && (
                        <p className="text-sm text-red-500 mt-1">{phoneError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Map and Summary */}
            <div className="space-y-6">
              {/* Map */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div ref={mapRef} className="bg-gray-100 w-full h-[300px] mb-4"></div>
                <div className="flex justify-between items-center text-lg text-black">
                  <span>Total Distance:</span>
                  <span className="font-medium">{distance || "0 km"}</span>
                </div>
              </div>

              {/* Selected Cab Details */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-medium mb-4">Selected Cab</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Car size={48} className="text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{cab?.cabModel || "N/A"}</h3>
                    <p className="text-sm text-yellow-700 bg-yellow-100 py-1 rounded-full w-12 text-center">{cab?.categoryName || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Rs. {cab?.pricePerKm || 0} /km</p>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-medium mb-4">Price Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Distance Price</span>
                    <span>Rs. {(numericDistance * pricePerKm).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-medium mt-3">
                      <span>Total Amount</span>
                      <span>Rs. {totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors"
                onClick={handleSubmit}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingForm;