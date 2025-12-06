// components/Pages/Referral/UserReferrals.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../config/AxiosInstance';
import { Users, Search, Award, Calendar, User, Loader, ArrowLeft } from 'lucide-react';

const UserReferrals = () => {
  const { userId } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userReferrals, setUserReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUserReferrals(userId);
    } else {
      fetchUsers();
    }
  }, [userId]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users/all');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReferrals = async (id) => {
    try {
      setUserLoading(true);
      const response = await axiosInstance.get(`/users/admin/referrals/${id}`);
      if (response.data.success) {
        setUserReferrals(response.data.referrals);
        // Find the user from the referrals data
        if (response.data.referrals.length > 0) {
          setSelectedUser(response.data.referrals[0].referrer);
        }
      }
    } catch (error) {
      console.error('Error fetching user referrals:', error);
      alert('Failed to fetch user referrals');
    } finally {
      setUserLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (referral) => {
    if (referral.bookingCompleted && referral.rewardCredited) {
      return { text: 'Completed', color: 'bg-green-100 text-green-800' };
    } else if (referral.bookingCompleted && !referral.rewardCredited) {
      return { text: 'Booking Done', color: 'bg-blue-100 text-blue-800' };
    } else {
      return { text: 'Pending', color: 'bg-orange-100 text-orange-800' };
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile?.includes(searchTerm)
  );

  if (userId) {
    // Show specific user's referrals
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedUser ? `${selectedUser.firstName}'s Referrals` : 'User Referrals'}
              </h2>
              <p className="text-gray-600 mt-1">
                {userReferrals.length} referral{userReferrals.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {userLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            {selectedUser && (
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-6 text-white lg:col-span-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <p className="text-purple-100 mt-2">{selectedUser.email}</p>
                    <p className="text-purple-100">{selectedUser.mobile}</p>
                    <div className="mt-4">
                      <p className="text-sm text-purple-100">Referral Code</p>
                      <p className="font-mono font-bold text-lg">{selectedUser.referral}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">{userReferrals.length}</p>
                    <p className="text-purple-100">Total Referrals</p>
                  </div>
                </div>
              </div>
            )}

            {/* Referrals List */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Referral History</h3>
                </div>
                <div className="p-6">
                  {userReferrals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No referrals found for this user
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userReferrals.map((referral) => (
                        <div key={referral._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${
                              referral.bookingCompleted && referral.rewardCredited 
                                ? 'bg-green-500' 
                                : 'bg-orange-500'
                            }`}></div>
                            <div>
                              <p className="font-medium text-gray-900">
                                Referred: {referral.referredUser?.firstName || 'Unknown User'}
                              </p>
                              <p className="text-sm text-gray-600">
                                {referral.referredUser?.email || 'Email not available'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(referral.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(referral.rewardAmount)}
                            </p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              getStatusBadge(referral).color
                            }`}>
                              {getStatusBadge(referral).text}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show users list
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Referrals</h2>
        <p className="text-gray-600 mt-1">
          Select a user to view their referral history
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search users by name, email, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => window.location.href = `/referral/user/${user._id}`}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform duration-200">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mobile:</span>
                  <span className="font-medium text-gray-900">{user.mobile}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Referral Code:</span>
                  <span className="font-mono font-medium text-purple-600">{user.referral}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Referred By:</span>
                  <span className="font-medium text-gray-900">
                    {user.referredBy || 'None'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors group-hover:bg-purple-100">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">View Referrals</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No users found</h3>
          <p className="text-gray-600 mt-1">
            {searchTerm ? 'Try adjusting your search criteria' : 'No users available'}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserReferrals;