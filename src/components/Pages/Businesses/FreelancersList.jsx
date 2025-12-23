// components/Pages/Businesses/FreelancersList.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import {
  Eye,
  Edit,
  Trash2,
  Loader,
  Search,
  User,
  Star,
  MapPin,
  Phone,
  Mail,
  Car,
  Clock,
  Filter,
  CheckCircle,
  XCircle,
  Award
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const FreelancersList = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/freelancer');
      if (response.data.success) {
        setFreelancers(response.data.freelancers);
      }
    } catch (error) {
      console.error('Error fetching freelancers:', error);
      toast.error('Failed to fetch freelancers');
    } finally {
      setLoading(false);
    }
  };

  const deleteFreelancer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this freelancer? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(id);
      // Note: You need to implement the delete endpoint
      // For now, I'll simulate deletion
      await axiosInstance.delete(`/freelancer/${id}`);
      setFreelancers(prev => prev.filter(freelancer => freelancer._id !== id));
      toast.success('Freelancer deleted successfully!');
    } catch (error) {
      console.error('Error deleting freelancer:', error);
      toast.error(error.response?.data?.message || 'Failed to delete freelancer');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Filter freelancers
  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch =
      freelancer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.phone?.includes(searchTerm) ||
      freelancer.address?.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || freelancer.approvalStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFreelancers = filteredFreelancers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFreelancers.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader className="h-12 w-12 animate-spin text-blue-600" />
            <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">Loading Freelancers</h3>
            <p className="text-gray-600 mt-1">Fetching freelancer data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Freelancer Management
                </h1>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Total {freelancers.length} freelancer{freelancers.length !== 1 ? 's' : ''} registered
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">{freelancers.length}</div>
                  <div className="text-xs text-gray-500">Total Freelancers</div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">
                    {freelancers.filter(f => f.approvalStatus === 'approved').length}
                  </div>
                  <div className="text-xs text-gray-500">Approved</div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {freelancers.filter(f => f.isActive).length}
                  </div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-teal-600">
                    {freelancers.reduce((sum, freelancer) => sum + (freelancer.services?.length || 0), 0)}
                  </div>
                  <div className="text-xs text-gray-500">Total Services</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search className="h-5 w-5" />
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Freelancer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentFreelancers.map((freelancer) => (
              <div
                key={freelancer._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Freelancer Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 truncate">
                            {freelancer.fullName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(freelancer.approvalStatus)}
                            {freelancer.isActive ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">
                          {freelancer.address?.city || 'Location not specified'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                          <span className="font-semibold">{freelancer.rating?.average || 0}</span>
                          <span className="text-gray-500 ml-1">
                            ({freelancer.rating?.count || 0} reviews)
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Award className="h-3 w-3 mr-1" />
                          <span>{freelancer.experience || 0} yrs exp</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Freelancer Details */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-3 w-3 mr-2" />
                        <span className="font-medium">{freelancer.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-3 w-3 mr-2" />
                        <span className="truncate">{freelancer.email || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Services and Transport */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Services:</span>
                        <span className="text-sm font-semibold">
                          {Array.isArray(freelancer.services) ? freelancer.services.length : 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Transport Charge:</span>
                        <span className="text-sm font-semibold text-blue-600">
                          ₹{freelancer.transportCharge || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Avg. Reach Time:</span>
                        <span className="text-sm font-semibold">
                          {freelancer.averageReachTime || 0} mins
                        </span>
                      </div>
                    </div>

                    {/* Facilities */}
                    {freelancer.facilities && freelancer.facilities.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Facilities
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {freelancer.facilities.slice(0, 3).map((facility, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-teal-50 text-teal-700"
                            >
                              {facility.replace(/[\[\]"]/g, '')}
                            </span>
                          ))}
                          {freelancer.facilities.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600">
                              +{freelancer.facilities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Joined: {formatDate(freelancer.createdAt)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/businesses/freelancers/${freelancer._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/businesses/freelancers/edit/${freelancer._id}`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      title="Edit Freelancer"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => deleteFreelancer(freelancer._id)}
                      disabled={deleteLoading === freelancer._id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                      title="Delete Freelancer"
                    >
                      {deleteLoading === freelancer._id ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {currentFreelancers.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">👨‍💼</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No matching freelancers found' : 'No freelancers registered yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Freelancers will appear here once they register on the platform'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredFreelancers.length)} of {filteredFreelancers.length} freelancers
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium ${currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FreelancersList;