import React from "react";

const CabCharges = () => {
  const charges = [
    {
      type: "Tuk",
      perKm: 30,
      dailyRate: 1000,
    },
    {
      type: "Nano",
      perKm: 40,
      dailyRate: 1500,
    },
    {
      type: "Mini",
      perKm: 50,
      dailyRate: 2000,
    },
    {
      type: "City",
      perKm: 60,
      dailyRate: 2500,
    },
    {
      type: "Sedan",
      perKm: 70,
      dailyRate: 3000
    },
    {
      type: "Mini Van",
      perKm: 80,
      dailyRate: 3500,
    },
    {
      type: "High Roof",
      perKm: 90,
      dailyRate: 4000,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Vehicle Charges
      </h1>
      <p className="text-center text-gray-600 mb-12 text-lg">
        Choose the best vehicle for your journey with detailed pricing and
        specifications.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {charges.map((charge, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg text-center border"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 bg-yellow-500 w-full p-3">
                {charge.type}
              </h2>
              <p className="text-gray-600 mb-3 text-lg">
                <strong>Per Kilometer:</strong> Rs. {charge.perKm}
              </p>
              <p className="text-gray-600 mb-3 text-lg">
                <strong>Daily Rate:</strong> Rs. {charge.dailyRate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CabCharges;
