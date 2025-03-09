import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";

const LoginPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userName || !password) {
      toast.error("Username and password are required!", { position: "top-center" });
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        userName,
        password,
      });

      const { token, role, userId } = response.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);

      login(token);
      toast.success("Login successful!", { position: "top-center" });

      setTimeout(() => {
        if (role === "ROLE_CUSTOMER") {
          window.location.href = "/";
        } else if (role === "ROLE_DRIVER") {
          window.location.href = "/driver";
        } else if (role === "ROLE_ADMIN") {
          window.location.href = "/admin";
        } else {
          toast.info("This part is under development", { position: "top-center" });
        }
      }, 1500);
    } catch (error) {
      toast.error("Invalid username or password. Please try again.", { position: "top-center" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id= "userName"
              name = "username"
              type="text"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="passWord"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3"
              required
            />
          </div>

          <div>
            <button
              id ="login"
              type="submit"
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-yellow-600"
            >
              Login
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account? <a href="/signup" className="text-yellow-500 hover:underline">Sign up</a>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginPage;
