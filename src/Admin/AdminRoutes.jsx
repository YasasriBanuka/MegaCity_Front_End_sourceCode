import { Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import DriverList from "./DriverList";
import HandleBookings from "./HandleBookings";
import { CabDetails } from "./CabDetails";
import { BookingDashboard } from "./BookingDashboard";
import { ManageAdmins } from "./ManageAdmins";
import { CabDashboard } from "./CabDashboard";
import BackButtonHandler from "../Authenticationpage/BackButtonHandler";
import { CategoryDashboard } from "./CategoryDashboard";
import { AddCategoryForm } from "./AddCategoryForm";
import { CarDetails } from "./CarDetails";

const AdminRoutes = () => {
  return (
    <>
    <BackButtonHandler/>
    <Routes>
      {/* Admin panel with Sidebar */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="drivers" element={<DriverList />} />
        <Route path="bookings" element={<HandleBookings />} />
        <Route path="cabdetails/:cabId" element={<CabDetails />} />
        <Route path="cardetails/:cabId" element={<CarDetails />} />
        <Route path="bookingdashboard" element={<BookingDashboard />} />
        <Route path="admins" element={<ManageAdmins />} />
        <Route path="cabdashboard" element={<CabDashboard />} />
        <Route path="categorydashboard" element={<CategoryDashboard />} />
        <Route path="add-category" element={<AddCategoryForm />} />
      </Route>
    </Routes>
    </>
  );
};

export default AdminRoutes;
