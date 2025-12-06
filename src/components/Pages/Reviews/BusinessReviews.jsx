import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../config/AxiosInstance";

function BusinessReviews() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      const res = await axios.get(`/reviews/business/${id}`);
      setData(res.data.reviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Business Reviews</h2>
        <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          {data.length} reviews
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💬</div>
          <p className="text-gray-500 text-lg">No reviews yet</p>
          <p className="text-gray-400">Be the first to leave a review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((r) => (
            <div
              key={r._id}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {r?.userId?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {r?.userId?.email}
                    </p>
                    <div className="flex items-center space-x-1">
                      {renderStars(r.rating)}
                      <span className="text-sm text-gray-500 ml-2">
                        {r.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{r.review}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BusinessReviews;