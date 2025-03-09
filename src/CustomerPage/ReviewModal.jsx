import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ReviewModal = ({ onClose, booking }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false); // Track authorization status
  const navigate = useNavigate();

  // Disable background scrolling when the modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable scrolling
    return () => {
      document.body.style.overflow = "auto"; // Re-enable scrolling on unmount
    };
  }, []);

  // Check if the user is authorized (ROLE_CUSTOMER) on component mount
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const role = localStorage.getItem("role");

    if (token && role === "ROLE_CUSTOMER") {
      setIsAuthorized(true); // Allow access if the role is ROLE_CUSTOMER
    } else {
      setIsAuthorized(false); // Deny access if the role is not ROLE_CUSTOMER
      navigate("/unauthorized"); // Redirect to unauthorized page
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwtToken");

    const reviewData = {
      cabId: booking.cabId, // Assuming cabId is part of the booking object
      customerId: localStorage.getItem("userId"), // Get customer ID from localStorage
      rating: rating,
      reviewText: comment,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/addreview",
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token in the header
          },
        }
      );
      console.log("Review submitted successfully:", response.data);
      toast.success("Your review was successfully added. Thank you!");
      alert("Your review was successfully added. Thank you!"); // Show success toast
      setRating(0); // Clear rating
      setComment(""); // Clear comment
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again."); // Show error toast
    }
  };

  // If the user is not authorized, do not render the modal
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-lg w-full max-w-md mt-20">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Review Driver</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Driver Details */}
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <p>Booking Date: {booking.bookingDate}</p>
              <p>Pickup: {booking.pickupLocation}</p>
              <p>Destination: {booking.destination}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
              >
                <Star
                  size={24}
                  fill={star <= rating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded-md p-2 h-32"
              placeholder="Share your experience..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={rating === 0}
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};