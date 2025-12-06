import React, { useEffect, useState } from "react";
import axios from "../../../config/AxiosInstance";
import { Link } from "react-router-dom";

function ReviewsList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/reviews/all");
      setReviews(res.data.reviews);
      setLoading(false);
    } catch (error) {
      console.error("Error loading reviews:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`/reviews/${id}`);
      alert("Review Deleted Successfully");
      fetchReviews();
    } catch (error) {
      console.log(error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const filteredReviews = reviews.filter(review =>
    review?.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review?.businessId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.review?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Reviews</h2>
          <p className="text-gray-600">Manage and view all customer reviews</p>
        </div>
        <Link
          to="/reviews/top-businesses"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200"
        >
          <span>🏆</span>
          <span className="ml-2">View Top Businesses</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search reviews by user, business, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <p className="text-gray-500 text-lg">
            {searchTerm ? "No matching reviews found" : "No reviews available"}
          </p>
          <p className="text-gray-400">
            {searchTerm ? "Try adjusting your search terms" : "Reviews will appear here once created"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Business</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Rating</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Review</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReviews.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {r?.userId?.email?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{r?.userId?.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-gray-700">
                        {r?.businessId?.name || "N/A"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        {renderStars(r.rating)}
                        <span className="text-sm text-gray-500 ml-2">({r.rating})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-600 line-clamp-2 max-w-xs">{r.review}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors duration-200 text-left"
                        >
                          🗑️ Delete
                        </button>
                        {r?.businessId?._id && (
                          <Link
                            to={`/reviews/business/${r.businessId._id}`}
                            className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors duration-200"
                          >
                            👁️ View Business Reviews
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredReviews.length} of {reviews.length} reviews
      </div>
    </div>
  );
}

export default ReviewsList;