// components/Pages/Businesses/SalonsList.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Loader, 
  Search, 
  Store, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  Users,
  TrendingUp,
  Filter,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const SalonsList = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/salons');
      if (response.data.success) {
        setSalons(response.data.salons);
      }
    } catch (error) {
      console.error('Error fetching salons:', error);
      toast.error('Failed to fetch salons');
    } finally {
      setLoading(false);
    }
  };

  const deleteSalon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this salon? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(id);
      // Note: You need to implement the delete endpoint or use the appropriate API
      // For now, I'll simulate deletion
      await axiosInstance.delete(`/salons/${id}`);
      setSalons(prev => prev.filter(salon => salon._id !== id));
      toast.success('Salon deleted successfully!');
    } catch (error) {
      console.error('Error deleting salon:', error);
      toast.error(error.response?.data?.message || 'Failed to delete salon');
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

  // Filter salons
  const filteredSalons = salons.filter(salon => {
    const matchesSearch = 
      salon.salonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.contact?.phone?.includes(searchTerm) ||
      salon.address?.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || salon.approvalStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSalons = filteredSalons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSalons.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader className="h-12 w-12 animate-spin text-green-600" />
            <div className="absolute inset-0 rounded-full border-2 border-green-200 animate-ping"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">Loading Salons</h3>
            <p className="text-gray-600 mt-1">Fetching salon data...</p>
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
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Salon Management
                </h1>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Total {salons.length} salon{salons.length !== 1 ? 's' : ''} registered
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">{salons.length}</div>
                  <div className="text-xs text-gray-500">Total Salons</div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">
                    {salons.filter(s => s.approvalStatus === 'approved').length}
                  </div>
                  <div className="text-xs text-gray-500">Approved</div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {salons.filter(s => s.isActive).length}
                  </div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {salons.reduce((sum, salon) => sum + (salon.staff?.length || 0), 0)}
                  </div>
                  <div className="text-xs text-gray-500">Total Staff</div>
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
                    placeholder="Search by salon name, email, phone, or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

          {/* Salon Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentSalons.map((salon) => (
              <div
                key={salon._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Salon Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Store className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 truncate">
                            {salon.salonName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(salon.approvalStatus)}
                            {salon.isActive ? (
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
                          {salon.address?.city}, {salon.address?.state}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                          <span className="font-semibold">{salon.rating?.average || 0}</span>
                          <span className="text-gray-500 ml-1">
                            ({salon.rating?.count || 0} reviews)
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{salon.staff?.length || 0} staff</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salon Details */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-3 w-3 mr-2" />
                        <span className="font-medium">{salon.contact?.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-3 w-3 mr-2" />
                        <span className="truncate">{salon.contact?.email || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Facilities */}
                    {salon.facilities && salon.facilities.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Facilities
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {salon.facilities.slice(0, 3).map((facility, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-700"
                            >
                              {facility}
                            </span>
                          ))}
                          {salon.facilities.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600">
                              +{salon.facilities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Commission */}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Commission:</span>
                        <span className="text-sm font-semibold text-purple-600">
                          {salon.commission?.percentage || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Joined: {formatDate(salon.createdAt)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/businesses/salons/${salon._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/businesses/salons/edit/${salon._id}`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      title="Edit Salon"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => deleteSalon(salon._id)}
                      disabled={deleteLoading === salon._id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                      title="Delete Salon"
                    >
                      {deleteLoading === salon._id ? (
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
          {currentSalons.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No matching salons found' : 'No salons registered yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Salons will appear here once they register on the platform'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSalons.length)} of {filteredSalons.length} salons
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
                          ? 'bg-purple-600 text-white'
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

export default SalonsList;