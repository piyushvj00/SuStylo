import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { Plus, Eye, Trash2, Edit, Calendar, Tag, Percent, DollarSign, Loader, Search, Filter, Copy, Check, User, Image as ImageIcon, Gift, Clock, Users } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    code: '', // Optional - if empty, backend will auto-generate
    image: null
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/coupon');
      if (response.data.success) {
        setCoupons(response.data.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const viewCoupon = async (id) => {
    try {
      const response = await axiosInstance.get(`/coupon/${id}`);
      if (response.data.success) {
        setSelectedCoupon(response.data.coupon);
        setViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching coupon details:', error);
      toast.error('Failed to fetch coupon details');
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await axiosInstance.delete(`/coupon/${id}`);
      setCoupons(prev => prev.filter(coupon => coupon._id !== id));
      toast.success('Coupon deleted successfully');
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      toast.error('Please enter a coupon title');
      return;
    }

    if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
      toast.error('Please enter a valid discount value');
      return;
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        toast.error('Start date cannot be after end date');
        return;
      }
    }

    try {
      const submitData = new FormData();

      // Append all form data
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          submitData.append('image', formData[key]);
        } else if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      const response = await axiosInstance.post('/coupon', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setCoupons(prev => [response.data.coupon, ...prev]);
        setCreateModal(false);
        resetForm();
        toast.success(response.data.message || 'Coupon created successfully');
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      toast.error('Please enter a coupon title');
      return;
    }

    if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
      toast.error('Please enter a valid discount value');
      return;
    }

    try {
      const submitData = new FormData();

      // Append all form data
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          submitData.append('image', formData[key]);
        } else if (formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      const response = await axiosInstance.put(`/coupon/${editingCoupon._id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setCoupons(prev => prev.map(coupon =>
          coupon._id === editingCoupon._id ? response.data.coupon : coupon
        ));
        setEditModal(false);
        resetForm();
        toast.success(response.data.message || 'Coupon updated successfully');
      }
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to update coupon');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      code: '',
      image: null
    });
    setEditingCoupon(null);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      title: coupon.title,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || '',
      startDate: coupon.startDate ? coupon.startDate.split('T')[0] : '',
      endDate: coupon.endDate ? coupon.endDate.split('T')[0] : '',
      usageLimit: coupon.usageLimit || '',
      code: coupon.code || '',
      image: null
    });
    setEditModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const isActive = (startDate, endDate, usedCount, usageLimit) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return now >= start && now <= end && (usageLimit === 0 || usedCount < usageLimit);
  };

  const getStatusBadge = (coupon) => {
    if (coupon.status === 'inactive') {
      return { text: 'Inactive', color: 'bg-red-100 text-red-800', dot: 'bg-red-500' };
    }

    if (isExpired(coupon.endDate)) {
      return { text: 'Expired', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' };
    }

    if (!isActive(coupon.startDate, coupon.endDate, coupon.usedCount, coupon.usageLimit)) {
      return { text: 'Inactive', color: 'bg-red-100 text-red-800', dot: 'bg-red-500' };
    }

    return { text: 'Active', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' };
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(text);
      toast.success('Coupon code copied to clipboard!');
      setTimeout(() => setCopiedCode(null), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy coupon code');
    });
  };

  const filteredCoupons = coupons.filter(coupon => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      coupon.title?.toLowerCase().includes(searchLower) ||
      coupon.description?.toLowerCase().includes(searchLower) ||
      coupon.code?.toLowerCase().includes(searchLower);

    const status = getStatusBadge(coupon);
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && status.text === 'Active') ||
      (filterStatus === 'inactive' && status.text === 'Inactive') ||
      (filterStatus === 'expired' && status.text === 'Expired');

    return matchesSearch && matchesStatus;
  });

  if (loading && coupons.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-12 w-12 animate-spin text-green-600" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">Loading Coupons</h3>
            <p className="text-gray-600 mt-1">Fetching your coupon data...</p>
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
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Coupon Management
                </h1>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Total {coupons.length} coupon{coupons.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">{coupons.length}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">
                    {coupons.filter(c => getStatusBadge(c).text === 'Active').length}
                  </div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-red-600">
                    {coupons.filter(c => getStatusBadge(c).text === 'Inactive').length}
                  </div>
                  <div className="text-xs text-gray-500">Inactive</div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-yellow-600">
                    {coupons.filter(c => getStatusBadge(c).text === 'Expired').length}
                  </div>
                  <div className="text-xs text-gray-500">Expired</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by title, description, or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search className="h-5 w-5" />
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter */}
              <div className="lg:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* Create Button */}
              <button
                onClick={() => setCreateModal(true)}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow"
              >
                <Plus className="h-5 w-5" />
                <span className="font-semibold">Create Coupon</span>
              </button>
            </div>
          </div>

          {/* Coupons Grid */}
          {filteredCoupons.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-6xl">🎁</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">No coupons found</h3>
                  <p className="text-gray-600 mt-2">
                    {searchTerm || filterStatus !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'No coupons have been created yet. Create your first coupon!'
                    }
                  </p>
                </div>
                {!searchTerm && filterStatus === 'all' && (
                  <button
                    onClick={() => setCreateModal(true)}
                    className="mt-4 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="font-semibold">Create First Coupon</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoupons.map((coupon) => {
                const status = getStatusBadge(coupon);
                return (
                  <div key={coupon._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    {/* Coupon Header */}
                    <div className={`p-5 ${status.dot === 'bg-green-500' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : status.dot === 'bg-yellow-500' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-gray-500 to-gray-700'} text-white`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold truncate">{coupon.title}</h3>
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${status.color.replace('100', '500/20').replace('800', '100')} backdrop-blur-sm`}>
                              {status.text}
                            </span>
                          </div>
                          <p className="text-white/80 text-sm mt-1 truncate">{coupon.description}</p>
                        </div>
                      </div>

                      {/* Discount Value */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-3xl font-bold">
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                          <span className="text-lg font-normal"> OFF</span>
                        </div>
                        {coupon.image && (
                          <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <ImageIcon className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Coupon Details */}
                    <div className="p-5">
                      {/* Code with Copy Button */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Coupon Code</label>
                          <button
                            onClick={() => copyToClipboard(coupon.code)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                          >
                            {copiedCode === coupon.code ? (
                              <>
                                <Check className="h-3 w-3" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono font-bold text-lg text-center tracking-wider">
                          {coupon.code}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-sm">Min Order</span>
                          </div>
                          <span className="font-semibold">${coupon.minOrderAmount || 0}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">Valid Until</span>
                          </div>
                          <span className="font-semibold">{formatDate(coupon.endDate)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">Usage</span>
                          </div>
                          <span className="font-semibold">{coupon.usedCount}/{coupon.usageLimit || '∞'}</span>
                        </div>

                        {coupon.createdBy && (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <User className="h-4 w-4" />
                              <span className="text-sm">Created By</span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-sm">{coupon.createdBy?.name || 'System'}</div>
                              <div className="text-xs text-gray-500">{coupon.createdByModel}</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex space-x-2">
                        <button
                          onClick={() => viewCoupon(coupon._id)}
                          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="font-medium">View</span>
                        </button>
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="font-medium">Edit</span>
                        </button>
                        <button
                          onClick={() => deleteCoupon(coupon._id)}
                          disabled={deleteLoading === coupon._id}
                          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleteLoading === coupon._id ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="font-medium">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Results Count */}
          {filteredCoupons.length > 0 && (
            <div className="mt-6 text-sm text-gray-600 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              Showing {filteredCoupons.length} of {coupons.length} coupons
              {(searchTerm || filterStatus !== 'all') && (
                <span className="ml-2">
                  • <button
                    onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear filters
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Create Coupon Modal */}
          {createModal && (
            <CouponForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateSubmit}
              onClose={() => {
                setCreateModal(false);
                resetForm();
              }}
              title="Create New Coupon"
              submitText="Create Coupon"
            />
          )}

          {/* Edit Coupon Modal */}
          {editModal && (
            <CouponForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleEditSubmit}
              onClose={() => {
                setEditModal(false);
                resetForm();
              }}
              title="Edit Coupon"
              submitText="Update Coupon"
              isEdit={true}
            />
          )}

          {/* View Coupon Modal */}
          {viewModal && selectedCoupon && (
            <ViewCouponModal
              coupon={selectedCoupon}
              onClose={() => setViewModal(false)}
              formatDate={formatDate}
              isExpired={isExpired}
              isActive={isActive}
              copyToClipboard={copyToClipboard}
              copiedCode={copiedCode}
            />
          )}
        </div>
      </div>
    </>
  );
};

// Coupon Form Component
const CouponForm = ({ formData, setFormData, onSubmit, onClose, title, submitText, isEdit = false }) => {
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-scale-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-600 mt-1">
                {isEdit ? 'Update your coupon details' : 'Fill in the details to create a new coupon'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Coupon Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., New Year Sale, Summer Discount"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Describe the coupon offer..."
              />
            </div>

            {/* Discount Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Discount Type *
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Discount Value *
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  placeholder={formData.discountType === 'percentage' ? '20' : '10'}
                />

              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum Order Amount
                </label>
                <input
                  type="number"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Usage Limit
                </label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="0 for unlimited"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={today}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || today}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Coupon Code (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Coupon Code (Optional)
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Leave empty to auto-generate"
              />
              <p className="text-sm text-gray-500 mt-1">
                If left empty, system will generate a unique 8-character code
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Coupon Image (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors duration-200">
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                  id="coupon-image"
                />
                <label htmlFor="coupon-image" className="cursor-pointer">
                  {formData.image ? (
                    <div className="flex items-center justify-center space-x-2">
                      <ImageIcon className="h-6 w-6 text-green-600" />
                      <span className="font-medium text-green-600">{formData.image.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Click to upload image</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-colors duration-200 font-semibold"
              >
                {submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// View Coupon Modal Component
const ViewCouponModal = ({ coupon, onClose, formatDate, isExpired, isActive, copyToClipboard, copiedCode }) => {
  const status = {
    color: isExpired(coupon.endDate) ? 'bg-yellow-100 text-yellow-800' :
      !isActive(coupon.startDate, coupon.endDate, coupon.usedCount, coupon.usageLimit) ? 'bg-red-100 text-red-800' :
        'bg-green-100 text-green-800',
    text: isExpired(coupon.endDate) ? 'Expired' :
      !isActive(coupon.startDate, coupon.endDate, coupon.usedCount, coupon.usageLimit) ? 'Inactive' :
        'Active',
    dot: isExpired(coupon.endDate) ? 'bg-yellow-500' :
      !isActive(coupon.startDate, coupon.endDate, coupon.usedCount, coupon.usageLimit) ? 'bg-red-500' :
        'bg-green-500'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-scale-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Coupon Details</h2>
              <p className="text-gray-600 mt-1">
                Created on {formatDate(coupon.createdAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Coupon Card */}
          <div className={`p-6 rounded-2xl mb-6 text-white ${status.dot === 'bg-green-500' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : status.dot === 'bg-yellow-500' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-gray-500 to-gray-700'}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{coupon.title}</h3>
                <p className="text-white/80 mb-4">{coupon.description}</p>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                    {status.text}
                  </span>
                  <span className="text-sm">
                    Code: <strong>{coupon.code}</strong>
                  </span>
                </div>
              </div>
              {coupon.image && (
                <div className="ml-4">
                  <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                </div>
              )}
            </div>

            {/* Discount Value */}
            <div className="mt-6 text-center">
              <div className="text-5xl font-bold">
                {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                <span className="text-2xl font-normal ml-2">OFF</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Price Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount Type</span>
                  <span className="font-semibold capitalize">{coupon.discountType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Order Amount</span>
                  <span className="font-semibold">${coupon.minOrderAmount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Saved</span>
                  <span className="font-semibold text-green-600">
                    {coupon.discountType === 'percentage' ? `Up to ${coupon.discountValue}%` : `$${coupon.discountValue}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Usage Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Usage Limit</span>
                  <span className="font-semibold">{coupon.usageLimit || 'Unlimited'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Used Count</span>
                  <span className="font-semibold">{coupon.usedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining Uses</span>
                  <span className="font-semibold">
                    {coupon.usageLimit ? coupon.usageLimit - coupon.usedCount : '∞'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Date Range
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-semibold">{formatDate(coupon.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date</span>
                  <span className="font-semibold">{formatDate(coupon.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Remaining</span>
                  <span className={`font-semibold ${isExpired(coupon.endDate) ? 'text-red-600' : 'text-green-600'}`}>
                    {isExpired(coupon.endDate) ? 'Expired' :
                      Math.ceil((new Date(coupon.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Created By
              </h3>
              {coupon.createdBy ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name</span>
                    <span className="font-semibold">{coupon.createdBy.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-semibold">{coupon.createdBy.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">User Type</span>
                    <span className="font-semibold">{coupon.createdByModel}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Created by System</p>
                </div>
              )}
            </div>
          </div>

          {/* Copy Code Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Coupon Code</h3>
                <p className="text-gray-600">Share this code with customers</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white px-4 py-3 rounded-lg border border-gray-300">
                  <span className="font-mono font-bold text-lg tracking-wider">{coupon.code}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(coupon.code)}
                  className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="font-medium text-gray-700">Created At</label>
              <p>{formatDate(coupon.createdAt)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="font-medium text-gray-700">Last Updated</label>
              <p>{formatDate(coupon.updatedAt)}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coupon;