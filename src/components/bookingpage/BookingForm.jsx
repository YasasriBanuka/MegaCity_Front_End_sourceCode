import React, { useState, useRef, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const GOOGLE_MAPS_API_KEY = "AIzaSyD3WC4ofY-qZw1skED-PgJthpJBj7IImyw";

const MapComponent = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY, libraries: ["places"] });
    loader.load().then(() => {
      if (!mapInstance.current) {
        mapInstance.current = new google.maps.Map(mapRef.current, {
          center: { lat: 7.8731, lng: 80.7718 }, // Centered on Sri Lanka
          zoom: 8,
        });
      }
    });
  }, []);

  const handlePlaceSelect = (inputType) => {
    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById(inputType),
      {
        types: ["geocode"],
        componentRestrictions: { country: "LK" }, 
      }
    );
    
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;
      
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      if (inputType === "pickup") {
        setPickup(place.formatted_address);
        setPickupCoords(location);
      } else {
        setDestination(place.formatted_address);
        setDestinationCoords(location);
      }

      updateMap(location);
    });
  };

  const updateMap = (location) => {
    if (mapInstance.current) {
      mapInstance.current.setCenter(location);
      new google.maps.Marker({
        position: location,
        map: mapInstance.current,
      });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Select Pickup & Destination</h2>
      <input
        id="pickup"
        type="text"
        placeholder="Enter Pickup Location"
        className="w-full p-2 border rounded mb-2"
        onFocus={() => handlePlaceSelect("pickup")}
      />
      <input
        id="destination"
        type="text"
        placeholder="Enter Destination"
        className="w-full p-2 border rounded mb-4"
        onFocus={() => handlePlaceSelect("destination")}
      />
      <div ref={mapRef} className="w-full h-64 border rounded"></div>
      {pickupCoords && destinationCoords && (
        <div className="mt-4 p-2 border rounded bg-gray-100">
          <p>Pickup Latitude: {pickupCoords.lat}, Longitude: {pickupCoords.lng}</p>
          <p>Destination Latitude: {destinationCoords.lat}, Longitude: {destinationCoords.lng}</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
