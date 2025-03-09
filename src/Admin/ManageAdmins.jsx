import { useState, useEffect } from "react";
import { useAuth } from "../Authenticationpage/AuthContext";
import Unauthorized from "../Authenticationpage/Unauthorized";
import axios from "axios";
import {
  Search,
  Plus,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { AddAdminForm } from "./AddAdminForm";
import PropTypes from "prop-types"; // Import PropTypes for prop validation
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ManageAdmins = () => {
  const { user } = useAuth();

  // State for managing admins, search query, and add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [admins, setAdmins] = useState([]);

  // Get the current logged-in user's ID from localStorage
  const currentUserId = localStorage.getItem("userId");

  // Redirect to Unauthorized page if the user is not an admin
  if (!user || user.role !== "ROLE_ADMIN") {
    return <Unauthorized />;
  }

  // Helper function to generate random last active times
  const generateLastActiveTime = () => {
    const times = [
      "just now",
      "5 mins ago",
      "10 mins ago",
      "30 mins ago",
      "1 hour ago",
      "2 hours ago",
      "5 hours ago",
      "1 day ago",
      "2 days ago",
    ];
    return times[Math.floor(Math.random() * times.length)];
  };

  // Fetch admins from the backend
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("http://localhost:8080/getAllAdmins", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });

        // Add default values for status and lastActive
        const adminsWithDefaults = response.data.map((admin) => {
          // If the admin is the currently logged-in user, set status to "active" and lastActive to "Active now"
          if (admin.id === currentUserId) {
            return {
              ...admin,
              status: "active",
              lastActive: "Active now",
            };
          }

          // For other admins, use default or fetched values
          return {
            ...admin,
            status: admin.status || (Math.random() > 0.5 ? "active" : "inactive"),
            lastActive: admin.lastActive || generateLastActiveTime(),
          };
        });

        setAdmins(adminsWithDefaults);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, [currentUserId]); // Re-fetch when the logged-in user changes

  // Function to handle adding a new admin
  const handleAddAdmin = async (newAdmin) => {
    try {
      const formData = new FormData();
      formData.append("userName", newAdmin.username);
      formData.append("password", newAdmin.password);
      formData.append("adminEmail", newAdmin.email);
      if (newAdmin.image) {
        formData.append("adminImage", newAdmin.image);
      }

      const response = await axios.post("http://localhost:8080/createAdmin", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const data = response.data;
        setAdmins([...admins, data]);
        setShowAddModal(false);
      }
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

  // Function to handle deleting an admin
  const handleDeleteAdmin = async (adminId) => {
    try {
      await axios.delete(`http://localhost:8080/deleteAdmin/${adminId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      // Remove the deleted admin from the state
      setAdmins(admins.filter((admin) => admin.id !== adminId));
      toast.success("Admin deleted successfully!");
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Failed to delete admin. Please try again.");
    }
  };

  // Filter admins based on search query
  const filteredAdmins = admins.filter((admin) =>
    admin.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.adminEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // RoleBadge component
  const RoleBadge = ({ role }) => {
    const roleStyles = {
      "Super Admin": "bg-purple-100 text-purple-700",
      Admin: "bg-blue-100 text-blue-700",
      "Support Admin": "bg-green-100 text-green-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${roleStyles[role]}`}
      >
        {role}
      </span>
    );
  };

  // StatusIndicator component
  const StatusIndicator = ({ status = "inactive" }) => {
    return (
      <div className="flex items-center">
        <div
          className={`w-2 h-2 rounded-full mr-2 ${
            status === "active" ? "bg-green-500" : "bg-gray-400"
          }`}
        />
        <span className="text-sm text-gray-600">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    );
  };

  // Prop validation for StatusIndicator
  StatusIndicator.propTypes = {
    status: PropTypes.string, // Validate status prop
  };

  return (
    <div>
    <div className="min-h-screen w-full bg-gray-100 p-6 -mb-20">
      <ToastContainer/>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Admin Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage administrator access and roles
            </p>
          </div>
          <button
            id = "newadmin"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Admin
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={admin.adminImage}
                        alt={admin.userName}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {admin.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {admin.adminEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleBadge role={admin.userName} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusIndicator status={admin.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admin.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      {/* Conditionally render the delete button */}
                      {admin.adminId !== currentUserId && (
                        <button
                          onClick={() => handleDeleteAdmin(admin.adminId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Render the AddAdminForm when showAddModal is true */}
        {showAddModal && (
          <AddAdminForm
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddAdmin}
          />
        )}
      </div>
    </div>
    </div>
  );
};