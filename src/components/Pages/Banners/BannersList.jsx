// components/Pages/Banners/BannersList.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Loader, 
  Search, 
  Image as ImageIcon,
  Plus,
  Home,
  Store,
  Info,
  Calendar,
  User,
  Filter,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const BannersList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPage, setFilterPage] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/banners');
      if (response.data.success) {
        setBanners(response.data.banners);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await axiosInstance.delete(`/banners/${id}`);
      setBanners(prev => prev.filter(banner => banner._id !== id));
      toast.success('Banner deleted successfully!');
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error(error.response?.data?.message || 'Failed to delete banner');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPageIcon = (page) => {
    switch (page) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'salons':
        return <Store className="h-4 w-4" />;
      case 'about':
        return <Info className="h-4 w-4" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getPageColor = (page) => {
    switch (page) {
      case 'home':
        return 'bg-blue-100 text-blue-800';
      case 'salons':
        return 'bg-purple-100 text-purple-800';
      case 'about':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter banners
  const filteredBanners = banners.filter(banner => {
    const matchesSearch = 
      banner.page?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.section?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPage = filterPage === 'all' || banner.page === filterPage;

    return matchesSearch && matchesPage;
  });

  // Get unique pages for filter
  const uniquePages = [...new Set(banners.map(banner => banner.page))];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBanners = filteredBanners.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader className="h-12 w-12 animate-spin text-indigo-600" />
            <div className="absolute inset-0 rounded-full border-2 border-indigo-200 animate-ping"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">Loading Banners</h3>
            <p className="text-gray-600 mt-1">Fetching banner data...</p>
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
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                  Banner Management
                </h1>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Total {banners.length} banner{banners.length !== 1 ? 's' : ''} created
                </p>
              </div>

              {/* Stats and Create Button */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                  {uniquePages.map(page => (
                    <div key={page} className="bg-white rounded-xl p-2 shadow-sm border border-gray-200">
                      <div className="text-lg font-bold text-gray-900">
                        {banners.filter(b => b.page === page).length}
                      </div>
                      <div className="text-xs text-gray-500 capitalize truncate">{page}</div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/banners/create"
                  className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Banner
                </Link>
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
                    placeholder="Search by page or section..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
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
                    value={filterPage}
                    onChange={(e) => setFilterPage(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Pages</option>
                    {uniquePages.map(page => (
                      <option key={page} value={page} className="capitalize">
                        {page}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentBanners.map((banner) => (
              <div
                key={banner._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Banner Image */}
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={banner.image}
                    alt={`${banner.page} banner`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPageColor(banner.page)}`}>
                      {getPageIcon(banner.page)}
                      <span className="ml-1 capitalize">{banner.page}</span>
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-black/50 text-white">
                      {banner.section}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="text-white text-sm">
                      Created by: {banner.createdBy?.name || 'Admin'}
                    </div>
                  </div>
                </div>

                {/* Banner Info */}
                <div className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 capitalize">{banner.page}</h3>
                        <p className="text-sm text-gray-600">Section: {banner.section}</p>
                      </div>
                      <a
                        href={banner.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Full Image"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-3 w-3 mr-2" />
                      <span>Created: {formatDate(banner.createdAt)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-3 w-3 mr-2" />
                      <span>By: {banner.createdBy?.name || 'Admin'}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    ID: {banner._id.substring(0, 8)}...
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(banner.image, '_blank')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="View Image"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <Link
                      to={`/banners/edit/${banner._id}`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      title="Edit Banner"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => deleteBanner(banner._id)}
                      disabled={deleteLoading === banner._id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                      title="Delete Banner"
                    >
                      {deleteLoading === banner._id ? (
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
          {currentBanners.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filterPage !== 'all' ? 'No matching banners found' : 'No banners created yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterPage !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by creating your first banner'}
              </p>
              <Link
                to="/banners/create"
                className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-xl hover:opacity-90 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Banner
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBanners.length)} of {filteredBanners.length} banners
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
                          ? 'bg-indigo-600 text-white'
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

export default BannersList;