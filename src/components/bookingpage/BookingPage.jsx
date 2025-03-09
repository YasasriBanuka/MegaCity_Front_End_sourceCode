import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../homepage/Header";
import Footer from "../homepage/Footer";
import { IoPerson } from "react-icons/io5";
import { LuBaggageClaim } from "react-icons/lu";
import { IoSnowOutline } from "react-icons/io5";
import VehicleTypeTable from "./VehicleTypeTable";
import { useNavigate } from "react-router-dom";

const CabDetails = () => {
  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/getallCabs")
      .then((response) => {
        setCabs(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cabs:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading available cabs...</p>;
  }

  return (
    <>
      <Header />
      <div className="w-full mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-28">
          {cabs.map((cab) => (
            <div key={cab.id} className="bg-white p-4 shadow-md rounded-lg">
              <img
                src={cab.imgUrl}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <div className="flex justify-between">
                <h2 className="text-lg font-bold mt-2">{cab.cabModel}</h2>
                <p
                  className={`font-semibold mt-2 ${
                    cab.availabilityStatus === "Available"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {cab.availabilityStatus}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500 flex items-center gap-2 mt-3">
                  <LuBaggageClaim />
                  {cab.luggageCapacity} baggage
                </p>
                <p className="text-gray-500 flex items-center gap-2 mt-3">
                  <IoPerson />
                  {cab.seats} Passengers
                </p>
              </div>
              {cab.hasAC ? (
                <p className="text-gray-500 flex items-center mt-4 gap-2">
                  <IoSnowOutline />Air Conditioned
                </p>
              ) : null}
              <button
                className={`mt-6 w-full px-4 py-2 rounded ${
                  cab.availabilityStatus === "Available"
                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
                disabled={cab.availabilityStatus !== "Available"}
                onClick={() => navigate("/map", { state: { cab } })}
              >
                {cab.availabilityStatus === "Available" ? "Book Now" : "Not Available"}
              </button>
            </div>
          ))}
        </div>
        <VehicleTypeTable />
      </div>
      <Footer />
    </>
  );
};

export default CabDetails;
