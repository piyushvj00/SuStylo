import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { Plus, Eye, Trash2, Edit, Calendar, Tag, Percent, DollarSign, Loader, Search, Filter } from 'lucide-react';

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
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percent',
    discountValue: '',
    expiryDate: '',
    minOrderValue: '',
    isActive: true,
    business_id: '',
    image: null
  });

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (selectedBusiness) {
      fetchCoupons();
    }
  }, [selectedBusiness]);

  const fetchBusinesses = async () => {
    try {
      const response = await axiosInstance.post('/details/list', {
        page: 1,
        limit: 100
      });
      
      if (response.data.success) {
        setBusinesses(response.data.data);
        // Automatically select the first business if available
        if (response.data.data.length > 0) {
          setSelectedBusiness(response.data.data[0]._id);
          setFormData(prev => ({
            ...prev,
            business_id: response.data.data[0]._id
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      alert('Failed to fetch businesses');
    }
  };

  const fetchCoupons = async () => {
    if (!selectedBusiness) return;
    
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/coupon/business/${selectedBusiness}`);
      setCoupons(response.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      alert('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const viewCoupon = async (id) => {
    try {
      const response = await axiosInstance.get(`/coupon/details/${id}`);
      setSelectedCoupon(response.data);
      setViewModal(true);
    } catch (error) {
      console.error('Error fetching coupon details:', error);
      alert('Failed to fetch coupon details');
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await axiosInstance.delete(`/coupon/delete/${id}`);
      setCoupons(prev => prev.filter(coupon => coupon._id !== id));
      alert('Coupon deleted successfully');
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          submitData.append('image', formData[key]);
        } else {
          submitData.append(key, formData[key]);
        }
      });

      const response = await axiosInstance.post('/coupon/create', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.coupon) {
        setCoupons(prev => [response.data.coupon, ...prev]);
        setCreateModal(false);
        resetForm();
        alert('Coupon created successfully');
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert('Failed to create coupon');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          submitData.append('image', formData[key]);
        } else if (formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      const response = await axiosInstance.put(`/coupon/update/${editingCoupon._id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.coupon) {
        setCoupons(prev => prev.map(coupon => 
          coupon._id === editingCoupon._id ? response.data.coupon : coupon
        ));
        setEditModal(false);
        resetForm();
        alert('Coupon updated successfully');
      }
    } catch (error) {
      console.error('Error updating coupon:', error);
      alert('Failed to update coupon');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percent',
      discountValue: '',
      expiryDate: '',
      minOrderValue: '',
      isActive: true,
      business_id: selectedBusiness || '',
      image: null
    });
    setEditingCoupon(null);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      expiryDate: coupon.expiryDate.split('T')[0],
      minOrderValue: coupon.minOrderValue || '',
      isActive: coupon.isActive,
      business_id: coupon.business_id,
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

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && coupon.isActive && !isExpired(coupon.expiryDate)) ||
      (filterStatus === 'inactive' && !coupon.isActive) ||
      (filterStatus === 'expired' && isExpired(coupon.expiryDate));
    
    return matchesSearch && matchesStatus;
  });

  const handleBusinessChange = (businessId) => {
    setSelectedBusiness(businessId);
    setFormData(prev => ({
      ...prev,
      business_id: businessId
    }));
  };

  if (loading && !selectedBusiness) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-gray-600">Loading businesses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
              <p className="text-gray-600 mt-2">
                Total {coupons.length} coupon{coupons.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Coupon</span>
            </button>
          </div>
        </div>

        {/* Business Selector */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Business
          </label>
          <select
            value={selectedBusiness}
            onChange={(e) => handleBusinessChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select a business</option>
            {businesses.map((business) => (
              <option key={business._id} value={business._id}>
                {business.name} - {business.address?.city}
              </option>
            ))}
          </select>
        </div>

        {/* Filters and Search */}
        {selectedBusiness && (
          <>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search by code or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Coupons Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <Loader className="h-6 w-6 animate-spin text-green-600" />
                  <span className="text-gray-600">Loading coupons...</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoupons.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-500">
                      <Tag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold">No coupons found</h3>
                      <p className="mt-2">
                        {searchTerm || filterStatus !== 'all' 
                          ? 'Try adjusting your search or filter criteria' 
                          : 'No coupons have been created yet'
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredCoupons.map((coupon) => (
                    <div key={coupon._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                      {/* Coupon Header */}
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 text-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold">{coupon.code}</h3>
                            <p className="text-green-100 text-sm mt-1">{coupon.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                            </div>
                            <div className="text-green-100 text-sm">OFF</div>
                          </div>
                        </div>
                      </div>

                      {/* Coupon Details */}
                      <div className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium capitalize">{coupon.discountType}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Min Order:</span>
                            <span className="font-medium">${coupon.minOrderValue || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Expires:</span>
                            <span className={`font-medium ${isExpired(coupon.expiryDate) ? 'text-red-600' : 'text-gray-900'}`}>
                              {formatDate(coupon.expiryDate)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Used:</span>
                            <span className="font-medium">{coupon.totalUsedCount} times</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              !coupon.isActive ? 'bg-red-500' :
                              isExpired(coupon.expiryDate) ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}></div>
                            <span className="text-sm font-medium">
                              {!coupon.isActive ? 'Inactive' :
                               isExpired(coupon.expiryDate) ? 'Expired' :
                               'Active'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => viewCoupon(coupon._id)}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => openEditModal(coupon)}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => deleteCoupon(coupon._id)}
                            disabled={deleteLoading === coupon._id}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
                          >
                            {deleteLoading === coupon._id ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
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
            title="Create Coupon"
            submitText="Create Coupon"
            businesses={businesses}
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
            businesses={businesses}
          />
        )}

        {/* View Coupon Modal */}
        {viewModal && selectedCoupon && (
          <ViewCouponModal
            coupon={selectedCoupon}
            onClose={() => setViewModal(false)}
            formatDate={formatDate}
            isExpired={isExpired}
            businesses={businesses}
          />
        )}
      </div>
    </div>
  );
};

// Coupon Form Component
const CouponForm = ({ formData, setFormData, onSubmit, onClose, title, submitText, isEdit = false, businesses }) => {
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., SAVE20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Coupon description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="percent">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={formData.discountType === 'percent' ? '20' : '10'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Value</label>
              <input
                type="number"
                name="minOrderValue"
                value={formData.minOrderValue}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business *</label>
              <select
                name="business_id"
                value={formData.business_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Business</option>
                {businesses.map((business) => (
                  <option key={business._id} value={business._id}>
                    {business.name} - {business.address?.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Image</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Active Coupon</label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
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
const ViewCouponModal = ({ coupon, onClose, formatDate, isExpired, businesses }) => {
  const getBusinessName = (businessId) => {
    const business = businesses.find(b => b._id === businessId);
    return business ? `${business.name} - ${business.address?.city}` : 'Unknown Business';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Coupon Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-lg text-white text-center">
              <div className="text-2xl font-bold mb-2">{coupon.code}</div>
              <div className="text-lg">{coupon.description}</div>
              <div className="text-3xl font-bold mt-2">
                {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`} OFF
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-gray-700">Discount Type:</label>
                <p className="capitalize">{coupon.discountType}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Discount Value:</label>
                <p>{coupon.discountValue}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Min Order Value:</label>
                <p>${coupon.minOrderValue || 0}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Total Used:</label>
                <p>{coupon.totalUsedCount} times</p>
              </div>
            </div>

            <div>
              <label className="font-medium text-gray-700">Business:</label>
              <p>{getBusinessName(coupon.business_id)}</p>
            </div>

            <div>
              <label className="font-medium text-gray-700">Expiry Date:</label>
              <p className={isExpired(coupon.expiryDate) ? 'text-red-600' : ''}>
                {formatDate(coupon.expiryDate)}
                {isExpired(coupon.expiryDate) && ' (Expired)'}
              </p>
            </div>

            <div>
              <label className="font-medium text-gray-700">Status:</label>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  !coupon.isActive ? 'bg-red-500' : 
                  isExpired(coupon.expiryDate) ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}></div>
                <span>
                  {!coupon.isActive ? 'Inactive' :
                   isExpired(coupon.expiryDate) ? 'Expired' :
                   'Active'}
                </span>
              </div>
            </div>

            {coupon.usageHistory && coupon.usageHistory.length > 0 && (
              <div>
                <label className="font-medium text-gray-700">Usage History:</label>
                <div className="mt-2 space-y-2">
                  {coupon.usageHistory.map((usage, index) => (
                    <div key={usage._id} className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm">
                        <div>User: {usage.user_id}</div>
                        <div>Booking: {usage.booking_id}</div>
                        <div>Used: {formatDate(usage.usedAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <label>Created:</label>
                <p>{formatDate(coupon.createdAt)}</p>
              </div>
              <div>
                <label>Updated:</label>
                <p>{formatDate(coupon.updatedAt)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
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