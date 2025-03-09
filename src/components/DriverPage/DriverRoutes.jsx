import { Routes, Route } from "react-router-dom";
import DriverLayout from "./DriverLayout";
import { DriverDashboard } from "./DriverDashboard";
import { DriverBooking } from "./DriverBooking";



const DriverRoutes = () => {
  return (
    <Routes>
      {/* Admin panel with Sidebar */}
      <Route path="/" element={<DriverLayout />}>
        <Route index element={<DriverDashboard />} />
        <Route path="driverdashboard" element={<DriverDashboard />} />
        <Route path="driverbooking" element={<DriverBooking />} />
      </Route>
    </Routes>
  );
};

export default DriverRoutes;
