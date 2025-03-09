

const VehicleTypeTable = () => {
    const vehicleTypes = [
        {
          type: "Tuk",
          pricePerKm: 80,
          description: "A compact, three-wheeled vehicle perfect for navigating through narrow city streets. Best for short-distance travel and budget-friendly trips."
        },
        {
          type: "Nano",
          pricePerKm: 90,
          description: "A small, affordable car designed for city commutes. Ideal for solo travelers or couples looking for a comfortable yet economical ride."
        },
        {
          type: "Mini Car",
          pricePerKm: 100,
          description: "A compact and versatile car, suitable for small groups or individuals. Offers a balance of comfort and affordability."
        },
        {
          type: "City",
          pricePerKm: 120,
          description: "A modern, stylish car equipped with advanced features, perfect for urban travel and short business trips."
        },
        {
          type: "Sedan",
          pricePerKm: 150,
          description: "A spacious and elegant car offering superior comfort, ideal for family outings, business travel, or medium-distance journeys."
        },
        {
          type: "Mini Van",
          pricePerKm: 180,
          description: "A practical choice for small groups, offering plenty of space for passengers and luggage. Great for family trips or airport pickups."
        },
        {
          type: "Van (Non-AC)",
          pricePerKm: 200,
          description: "An economical option for larger groups. Spacious interiors make it ideal for group travel on a budget, even during longer journeys."
        },
        {
          type: "Van (Dual AC)",
          pricePerKm: 250,
          description: "A premium van featuring dual air-conditioning for maximum comfort. Designed for larger groups traveling in luxury over long distances."
        },
        {
          type: "SUV",
          pricePerKm: 200,
          description: "A robust and spacious vehicle, perfect for off-road adventures, family outings, or long-distance trips. Offers excellent comfort and luggage capacity."
        }
      ];
      

  return (
    <div className=" mx-auto bg-white p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Vehicle Types & Pricing</h2>
      <p className="text-gray-600 text-center mb-6">
        Choose from our range of vehicles for your journey. Prices are per kilometer.
      </p>
      <table className="w-full border-collapse border border-gray-200 ">
        <thead>
          <tr className="bg-gray-100">
            <th className=" p-4 font-semibold text-gray-800 border border-gray-200 text-center">Vehicle Type</th>
            <th className="text-center p-4 font-semibold text-gray-800 border border-gray-200">Price per km (Rs.)</th>
            <th className="text-center p-4 font-semibold text-gray-800 border border-gray-200">Description</th>
          </tr>
        </thead>
        <tbody>
          {vehicleTypes.map((vehicle, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <td className="p-4 border border-gray-200 text-center gap-3">
               {vehicle.type}
              </td>
              <td className="p-4 border border-gray-200 text-gray-700 text-center">Rs. {vehicle.pricePerKm}</td>
              <td className="p-4 border border-gray-200 text-gray-600 ">{vehicle.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTypeTable;
