import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AddCategoryForm = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName) {
      setError("Category name is required");
      return;
    }
    try {
      await axios.post("http://localhost:8080/addcategory", {
        categoryName,
      });
      navigate("/category-dashboard");
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Failed to add category");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Category</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form
        id = "categoryForm"
        onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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
  );
};
