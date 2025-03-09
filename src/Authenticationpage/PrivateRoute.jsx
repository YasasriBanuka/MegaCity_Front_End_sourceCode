import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("jwtToken"); // Retrieve token from localStorage

  // If token exists, render the children (protected content), otherwise redirect to login
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
