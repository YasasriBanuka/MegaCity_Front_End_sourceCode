import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Header from "../homepage/Header";
import Footer from "../homepage/Footer";
import { useNavigate } from "react-router-dom";
import { Search, Users, Briefcase, Wind, MapPin, CheckCircle, XCircle } from "lucide-react";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/images/loadingAnimation.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AvailableCabs = () => {
  const [cabs, setCabs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/getallCabs")
      .then((response) => {
        setCabs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cabs:", error);
        setError("Failed to fetch cabs. Please try again later.");
        setLoading(false);
      });

    axios
      .get("http://localhost:8080/auth/getallcategories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const filteredCabs = useMemo(() => {
    return cabs.filter((cab) => {
      const matchesLocation = cab.location
        .toLowerCase()
        .includes(locationFilter.toLowerCase());
      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "available"
          ? cab.availabilityStatus === "Available"
          : cab.availabilityStatus !== "Available");
      const matchesCategory =
        categoryFilter === "" || cab.categoryName === categoryFilter;
      return matchesLocation && matchesStatus && matchesCategory;
    });
  }, [cabs, locationFilter, statusFilter, categoryFilter]);

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

  const handleBookNowClick = (cab) => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("You must be logged in to book a taxi.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/login");
    } else {
      navigate("/map", {
        state: { cab },
      });
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto mt-28 mb-20">
          <div className="bg-white shadow-md rounded-lg p-6 mb-8" style={{ width: "1310px" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative col-span-2">
                <input
                  id ="searchlocation"
                  name ="searchlocation"
                  type="text"
                  placeholder="Search by location..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500"
                  onChange={(e) => setLocationFilter(e.target.value)}
                  value={locationFilter}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div>
                <select
                 id ="status"
                 name = "status"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 bg-white"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  value={statusFilter}
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div>
                <select
                 id ="category"
                 name = "category"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 bg-white"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  value={categoryFilter}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {locationFilter && (
                <span key="location" className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                  Location: {locationFilter}
                  <button
                    onClick={() => setLocationFilter("")}
                    className="ml-2 hover:text-yellow-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {statusFilter && (
                <span key="status" className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter("")}
                    className="ml-2 hover:text-yellow-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {categoryFilter && (
                <span key="category" className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                  Category: {categoryFilter}
                  <button
                    onClick={() => setCategoryFilter("")}
                    className="ml-2 hover:text-yellow-900"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
          {filteredCabs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 text-lg">
                No cabs found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setLocationFilter("");
                  setStatusFilter("");
                  setCategoryFilter("");
                }}
                className="mt-4 text-yellow-500 hover:text-yellow-600"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">
              {filteredCabs.map((cab) => (
                <div
                  key={cab.cabId}
                  className="w-[310px] bg-white rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="relative h-48">
                    <img
                      src={cab.imgUrl}
                      alt={`${cab.cabModel} cab`}
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
                  <div className="p-6">
                    <h3 
                    id ="cabname"
                    className="text-gray-900 text-xl font-bold text-center mb-1">
                      {cab.cabModel}
                    </h3>
                    <p className="text-yellow-500 text-lg font-semibold text-center mb-6">
                      ${cab.pricePerKm}/km
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <span className="ml-3 text-gray-600">Location:</span>
                        <span className="ml-auto text-gray-900">
                          {cab.location}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div
      
                         className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <span 
                       
                        className="ml-3 text-gray-600">Passengers:</span>
                        <span
                        id = "passengerCount"
                         className="ml-auto text-gray-900"
                        >{cab.seats}</span>
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
                    <button
                      id="bookTaxi"
                      className={`w-full ${
                        cab.availabilityStatus === "Available"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-gray-400 cursor-not-allowed"
                      } text-white font-semibold py-3 rounded-lg mt-6 transition-colors`}
                      disabled={cab.availabilityStatus !== "Available"}
                      onClick={() => handleBookNowClick(cab)}
                    >
                      {cab.availabilityStatus === "Available"
                        ? "BOOK TAXI NOW →"
                        : "NOT AVAILABLE"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AvailableCabs;