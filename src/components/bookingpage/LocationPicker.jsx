

import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";


const containerStyle = {
  width: "100%",
  height: "400px",
}

const center = {
  lat: 7.8731,  // Default Sri Lanka center
  lng: 80.7718,
};

const LocationPicker = ({ setLocation }) => {
  const [selected, setSelected] = useState(null);

  const handleClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setSelected({ lat, lng });
    setLocation({ lat, lng });  // Pass to parent
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBkX7rHRRbNASF7s8K4mNMSifx9tUueyX0">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7} onClick={handleClick}>
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default LocationPicker;
