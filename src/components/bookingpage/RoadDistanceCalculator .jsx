import React, { useState } from 'react';

const RoadDistanceCalculator = () => {
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [distance, setDistance] = useState(null);
    const [error, setError] = useState('');

    // Function to get coordinates from OSM Nominatim API
    const getCoordinates = async (location) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                return [lon, lat];
            } else {
                throw new Error('Location not found');
            }
        } catch (err) {
            setError('Failed to get coordinates');
            return null;
        }
    };

    // Function to calculate road distance using OSRM API
    const calculateRoadDistance = async (pickupCoords, destinationCoords) => {
        try {
            const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${pickupCoords[0]},${pickupCoords[1]};${destinationCoords[0]},${destinationCoords[1]}?overview=false&alternatives=false&steps=false`;
            const response = await fetch(osrmUrl);
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
                const roadDistance = data.routes[0].legs[0].distance; // Road distance in meters
                return (roadDistance / 1000).toFixed(2); // Convert meters to kilometers
            } else {
                throw new Error('Route not found');
            }
        } catch (err) {
            setError('Failed to calculate distance');
            return null;
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setDistance(null);

        if (pickup && destination) {
            const pickupCoords = await getCoordinates(pickup);
            const destinationCoords = await getCoordinates(destination);

            if (pickupCoords && destinationCoords) {
                const roadDistance = await calculateRoadDistance(pickupCoords, destinationCoords);
                if (roadDistance) {
                    setDistance(roadDistance);
                }
            }
        }
    };

    return (
        <div className="container">
            <h1>Calculate Road Distance</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="pickup">Pickup Location:</label>
                    <input
                        type="text"
                        id="pickup"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="destination">Destination:</label>
                    <input
                        type="text"
                        id="destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Calculate Distance</button>
            </form>

            {error && <div style={{ color: 'red' }}>{error}</div>}
            {distance && <div>Road Distance: {distance} km</div>}
        </div>
    );
};

export default RoadDistanceCalculator;
