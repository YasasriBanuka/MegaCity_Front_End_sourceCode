import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BackButtonHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      navigate("/"); // Set the specific location
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  return null;
};

export default BackButtonHandler;
