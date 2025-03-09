import { useNavigate } from "react-router-dom";
import { BiSolidCarCrash } from "react-icons/bi"; // Import warning icon

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center mt-28">
        <BiSolidCarCrash className="text-red-500 text-9xl mb-4 text-center" />
      <div className="bg-white p-4 rounded-lg text-center max-w-md">
        <h1 className="text-4xl font-semibold text-gray-800">Unauthorized Access</h1>
        <p className="text-gray-600 mt-2">
          You do not have permission to view this page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
