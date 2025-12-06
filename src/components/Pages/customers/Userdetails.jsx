import { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance'; // Adjust the path
import { Loader, X, MapPin, Wallet, User, Mail, Phone, Calendar, Shield } from 'lucide-react';

const UserDetailsModal = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/users/${userId}`);
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'vendor': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">User Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : user ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <h3 className="font-medium text-gray-700">Name</h3>
                  </div>
                  <p className="text-gray-900">{user.firstName} {user.lastName}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <h3 className="font-medium text-gray-700">Email</h3>
                  </div>
                  <p className="text-gray-900">{user.email}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {user.emailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <h3 className="font-medium text-gray-700">Phone</h3>
                  </div>
                  <p className="text-gray-900">{user.mobile}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${user.mobileVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {user.mobileVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <h3 className="font-medium text-gray-700">Role & Status</h3>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Wallet className="h-4 w-4 text-gray-500" />
                  <h3 className="font-medium text-gray-700">Wallet Balance</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">₹{user.walletBalance || 0}</p>
              </div>

              {/* Referral Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Referral Code</h3>
                  <p className="text-gray-900 font-mono">{user.referral}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Referred By</h3>
                  <p className="text-gray-900">{user.referredBy || 'Not referred'}</p>
                </div>
              </div>

              {/* Location Information */}
              {user.currentLocation && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <h3 className="font-medium text-gray-700">Location</h3>
                  </div>
                  <p className="text-gray-900">
                    Coordinates: {user.currentLocation.coordinates[0]}, {user.currentLocation.coordinates[1]}
                  </p>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <h3 className="font-medium text-gray-700">Created At</h3>
                  </div>
                  <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <h3 className="font-medium text-gray-700">Updated At</h3>
                  </div>
                  <p className="text-gray-900">{formatDate(user.updatedAt)}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Additional Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">First Booking Done:</span>
                    <span className={`ml-2 ${user.firstBookingDone ? 'text-green-600' : 'text-gray-900'}`}>
                      {user.firstBookingDone ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Profile Picture:</span>
                    <span className="ml-2 text-gray-900">
                      {user.profilePictureUrl ? 'Uploaded' : 'Not uploaded'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Failed to load user details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;