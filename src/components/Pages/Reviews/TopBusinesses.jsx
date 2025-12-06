import React, { useEffect, useState } from "react";
import axios from "../../../config/AxiosInstance";
import { Link } from "react-router-dom";

function TopBusinesses() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTop = async () => {
    try {
      const res = await axios.get("/reviews/top/businesses");
      setData(res.data.topBusinesses);
    } catch (error) {
      console.error("Error loading top businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  useEffect(() => {
    fetchTop();
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
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <span className="text-2xl">🏆</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Top Rated Businesses</h2>
        <p className="text-gray-600">Discover the highest rated businesses based on customer reviews</p>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏢</div>
          <p className="text-gray-500 text-lg">No business data available</p>
          <p className="text-gray-400">Business ratings will appear here once reviews are added</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {data.map((b, index) => (
            <div
              key={b._id}
              className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-bold text-lg">
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {b.businessData.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        {renderStars(b.avgRating)}
                        <span className="text-sm font-semibold text-gray-700 ml-1">
                          {b.avgRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {b.totalReviews} review{b.totalReviews !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="mb-2">
                    <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                      ⭐ Top Rated
                    </span>
                  </div>
                  <Link
                    to={`/reviews/business/${b._id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
                  >
                    <span>👁️</span>
                    <span className="ml-2">View Reviews</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopBusinesses;