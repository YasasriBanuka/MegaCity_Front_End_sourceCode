import { Outlet } from "react-router-dom";
import { SidebarDriver } from "./SidebarDriver";


const DriverLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarDriver isSidebarOpen={true} setIsSidebarOpen={() => {}} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        <Outlet /> {/* This will render the nested routes */}
      </div>
    </div>
  );
};

export default DriverLayout;
