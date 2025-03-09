import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Briefcase,
  Wind,
  MapPin,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios"; // Import axios for API calls

export const CabList = () => {
  const [cabs, setCabs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch cabs from the backend
    const fetchCabs = async () => {
      try {
        // Replace with your backend URL
        const backendUrl = "http://localhost:8080/auth/getallCabs";

        // Make a GET request to the backend
        const response = await axios.get(backendUrl);

        // Filter cabs with availabilityStatus = "Available"
        const availableCabs = response.data.filter(
          (cab) => cab.availabilityStatus === "Available"
        );

        // Shuffle the available cabs and select the first 6
        const shuffledCabs = availableCabs.sort(() => Math.random() - 0.5);
        const selectedCabs = shuffledCabs.slice(0, 6);

        // Update state with the selected cabs
        setCabs(selectedCabs);
      } catch (error) {
        console.error("Error fetching cabs:", error);
        setError("Failed to fetch cabs. Please try again later.");
      }
    };

    fetchCabs();
  }, []); // Ensure effect runs only once on mount

  return (
    <div>
      {/* Display error message if API call fails */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Render the list of cabs in a centered grid layout */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 max-w-[1000px]">
          {cabs.map((cab) => (
            <div
              key={cab.cabNumberPlate}
              className="w-[310px] bg-white rounded-xl overflow-hidden shadow-lg"
            >
              {/* Reduced height for the image container */}
              <div className="relative h-36">
                <img
                  src={cab.imgUrl}
                  alt={cab.cabModel}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full flex items-center gap-2">
                  {cab.availabilityStatus === "Available" ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-500 text-sm font-medium">
                        Available
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-500 text-sm font-medium">
                        Unavailable
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Reduced padding and spacing inside the card */}
              <div className="p-4">
                <h3 className="text-gray-900 text-xl font-bold text-center mb-1">
                  {cab.cabModel}
                </h3>
                <p className="text-yellow-500 text-lg font-semibold text-center mb-4">
                  RS. {cab.pricePerKm}/ Km
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="ml-3 text-gray-600">Location:</span>
                    <span className="ml-auto text-gray-900">{cab.location}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span className="ml-3 text-gray-600">Passengers:</span>
                    <span className="ml-auto text-gray-900">{cab.seats}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <span className="ml-3 text-gray-600">Luggage Carry:</span>
                    <span className="ml-auto text-gray-900">
                      {cab.luggageCapacity}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Wind className="w-4 h-4 text-white" />
                    </div>
                    <span className="ml-3 text-gray-600">Air Condition:</span>
                    <span className="ml-auto text-gray-900">
                      {cab.hasAC ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                {/* Fix incorrect className template literal */}
                  <Link to ="/availablecabs">
                <button
                  className={`w-full ${
                    cab.availabilityStatus === "Available"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-black font-semibold py-2 rounded-full mt-9 transition-colors`}
                  disabled={cab.availabilityStatus !== "Available"}
                >
                  {cab.availabilityStatus === "Available"
                    ? "BOOK TAXI NOW"
                    : "NOT AVAILABLE"}
                </button>
              </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
