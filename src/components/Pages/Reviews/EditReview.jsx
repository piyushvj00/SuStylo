import React, { useEffect, useState } from "react";
import axios from "../../../config/AxiosInstance";
import { useParams, useNavigate } from "react-router-dom";

function EditReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const loadReview = async () => {
    try {
      const res = await axios.get(`/reviews/${id}`);
      setRating(res.data.review.rating);
      setReview(res.data.review.review);
    } catch (error) {
      console.error("Error loading review:", error);
    }
  };

  const handleUpdate = async () => {
    if (!rating || !review.trim()) {
      alert("Please provide both rating and review");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`/reviews/${id}`, { rating, review });
      alert("Review Updated Successfully");
      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Error updating review");
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        className={`text-3xl transition-transform hover:scale-110 ${
          index < (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"
        }`}
        onClick={() => setRating(index + 1)}
        onMouseEnter={() => setHoverRating(index + 1)}
        onMouseLeave={() => setHoverRating(0)}
      >
        ★
      </button>
    ));
  };

  useEffect(() => {
    loadReview();
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Edit Review</h2>
        <p className="text-gray-600">Update your review and rating</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Rating
          </label>
          <div className="flex justify-center space-x-2 mb-2">
            {renderStarRating()}
          </div>
          <div className="text-center text-sm text-gray-500">
            {rating > 0 ? `Selected: ${rating} star${rating > 1 ? 's' : ''}` : 'Click to rate'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Your Review
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
            rows="6"
            placeholder="Share your experience..."
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {review.length}/500 characters
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              "Update Review"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditReview;