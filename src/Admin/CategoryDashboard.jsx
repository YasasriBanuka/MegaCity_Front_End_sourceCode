import { useState, useEffect } from "react";
import axios from "axios";
import { Search, ChevronLeft, ChevronRight, PlusCircle, XCircle } from "lucide-react";
import { useAuth } from "../Authenticationpage/AuthContext";
import { useNavigate } from "react-router-dom";
import Unauthorized from "../Authenticationpage/Unauthorized";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CategoryDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user || user.role !== "ROLE_ADMIN") {
    return <Unauthorized />;
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [categoryName, setCategoryName] = useState(""); // Form input
  const [pricePerKm, setPricePerKm] = useState(""); // Form input
  const [error, setError] = useState("");

  const categoriesPerPage = 5;

  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/getallcategories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then((response) => {
        setCategories(response.data);
        setFilteredCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    let results = categories;
    if (searchQuery) {
      results = results.filter((category) =>
        category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredCategories(results);
    setCurrentPage(1);
  }, [searchQuery, categories]);

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName || !pricePerKm) {
      setError("All fields are required");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/addcategory",
        { categoryName, pricePerKm },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
        }
      );
      toast.success("category created successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
      setIsModalOpen(false);
      setCategoryName("");
      setPricePerKm("");
      setError("");
      window.location.reload(); // Refresh to see new category
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Failed to add category");
    }
  };

  return (
    <div className={`min-h-screen w-full bg-gray-100 p-6`}>
        <ToastContainer/>
      <div className="max-w-7xl mx-auto relative">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Category Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage all categories</p>
          </div>
          <button
            id = "AddCategory"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5" /> Add Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[1000px] pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Category Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price per Km</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentCategories.map((category) => (
                <tr key={category.categoryId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{category.categoryId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{category.categoryName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${category.pricePerKm.toFixed(2)} per km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Category</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleAddCategory}>
              <div 
              
                className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">Category Name</label>
                <input
                  id ="categoryName"
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">Price per Km</label>
                <input
                  id ="PriceRange"
                  type="number"
                  value={pricePerKm}
                  onChange={(e) => setPricePerKm(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                id = "addCategory"
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
