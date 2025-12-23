// components/Pages/Businesses/EditFreelancer.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/AxiosInstance';
import {
  ArrowLeft,
  Save,
  Loader,
  X,
  Plus,
  Trash2,
  Upload,
  Check,
  AlertCircle
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditFreelancer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [freelancer, setFreelancer] = useState({
    fullName: '',
    phone: '',
    email: '',
    experience: 0,
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    address: {
      street: '',
      area: '',
      city: '',
      state: '',
      pinCode: '',
      country: 'India'
    },
    facilities: [],
    transportCharge: 0,
    averageReachTime: 30,
    commission: {
      isCommissionApplicable: true,
      percentage: 0
    },
    bookingTypes: {
      preBooking: true,
      urgentBooking: true
    },
    approvalStatus: 'approved',
    isActive: true
  });
  const [newFacility, setNewFacility] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchFreelancerData();
  }, [id]);

  const fetchFreelancerData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/freelancer/${id}`);
      if (response.data.success) {
        const freelancerData = response.data.freelancer;
        setFreelancer({
          fullName: freelancerData.fullName || '',
          phone: freelancerData.phone || '',
          email: freelancerData.email || '',
          experience: freelancerData.experience || 0,
          contact: {
            phone: freelancerData.contact?.phone || freelancerData.phone || '',
            email: freelancerData.contact?.email || freelancerData.email || '',
            website: freelancerData.contact?.website || ''
          },
          address: {
            street: freelancerData.address?.street || '',
            area: freelancerData.address?.area || '',
            city: freelancerData.address?.city || '',
            state: freelancerData.address?.state || '',
            pinCode: freelancerData.address?.pinCode || '',
            country: freelancerData.address?.country || 'India'
          },
          facilities: Array.isArray(freelancerData.facilities) 
            ? freelancerData.facilities.map(f => f.replace(/[\[\]"]/g, ''))
            : [],
          transportCharge: freelancerData.transportCharge || 0,
          averageReachTime: freelancerData.averageReachTime || 30,
          commission: {
            isCommissionApplicable: freelancerData.commission?.isCommissionApplicable || true,
            percentage: freelancerData.commission?.percentage || 0
          },
          bookingTypes: {
            preBooking: freelancerData.bookingTypes?.preBooking !== false,
            urgentBooking: freelancerData.bookingTypes?.urgentBooking !== false
          },
          approvalStatus: freelancerData.approvalStatus || 'approved',
          isActive: freelancerData.isActive !== undefined ? freelancerData.isActive : true
        });
      }
    } catch (error) {
      console.error('Error fetching freelancer data:', error);
      toast.error('Failed to fetch freelancer data');
      navigate('/businesses/freelancers');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!freelancer.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!freelancer.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(freelancer.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!freelancer.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(freelancer.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!freelancer.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }

    if (!freelancer.address.state.trim()) {
      newErrors['address.state'] = 'State is required';
    }

    if (freelancer.experience < 0) {
      newErrors.experience = 'Experience cannot be negative';
    }

    if (freelancer.transportCharge < 0) {
      newErrors.transportCharge = 'Transport charge cannot be negative';
    }

    if (freelancer.averageReachTime < 0) {
      newErrors.averageReachTime = 'Average reach time cannot be negative';
    }

    if (freelancer.commission.percentage < 0 || freelancer.commission.percentage > 100) {
      newErrors['commission.percentage'] = 'Commission percentage must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setSaving(true);
      
      // Prepare data for API
      const payload = {
        fullName: freelancer.fullName,
        contact: {
          phone: freelancer.contact.phone || freelancer.phone,
          email: freelancer.contact.email || freelancer.email,
          website: freelancer.contact.website
        },
        address: freelancer.address,
        transportCharge: freelancer.transportCharge,
        experience: freelancer.experience,
        commission: freelancer.commission,
        bookingTypes: freelancer.bookingTypes,
        approvalStatus: freelancer.approvalStatus,
        isActive: freelancer.isActive
      };

      // Add facilities if any
      if (freelancer.facilities.length > 0) {
        payload.facilities = freelancer.facilities;
      }

      const response = await axiosInstance.put(`/freelancer/${id}`, payload);

      if (response.data.success) {
        toast.success('Freelancer updated successfully!');
        navigate(`/businesses/freelancers/${id}`);
      }
    } catch (error) {
      console.error('Error updating freelancer:', error);
      toast.error(error.response?.data?.message || 'Failed to update freelancer');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'bookingTypes') {
        setFreelancer(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: checked
          }
        }));
      } else {
        setFreelancer(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        }));
      }
    } else {
      setFreelancer(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const addFacility = () => {
    if (newFacility.trim() && !freelancer.facilities.includes(newFacility.trim())) {
      setFreelancer(prev => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()]
      }));
      setNewFacility('');
    }
  };

  const removeFacility = (index) => {
    setFreelancer(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading freelancer data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Freelancer</h1>
              <p className="text-gray-600">Update freelancer information</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={freelancer.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={freelancer.experience}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.experience ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.experience}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={freelancer.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={freelancer.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="contact.website"
                    value={freelancer.contact.website}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={freelancer.address.street}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area
                  </label>
                  <input
                    type="text"
                    name="address.area"
                    value={freelancer.address.area}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={freelancer.address.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors['address.city'] ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors['address.city'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors['address.city']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={freelancer.address.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors['address.state'] ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors['address.state'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors['address.state']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="address.pinCode"
                    value={freelancer.address.pinCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={freelancer.address.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transport Charge (₹)
                  </label>
                  <input
                    type="number"
                    name="transportCharge"
                    value={freelancer.transportCharge}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.transportCharge ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.transportCharge && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.transportCharge}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average Reach Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="averageReachTime"
                    value={freelancer.averageReachTime}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.averageReachTime ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.averageReachTime && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.averageReachTime}
                    </p>
                  )}
                </div>
              </div>

              {/* Booking Types */}
              <div className="mt-6 space-y-3">
                <h3 className="text-md font-medium text-gray-900 mb-2">Booking Types</h3>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="bookingTypes.preBooking"
                      checked={freelancer.bookingTypes.preBooking}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Pre-booking Available</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="bookingTypes.urgentBooking"
                      checked={freelancer.bookingTypes.urgentBooking}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Urgent Booking Available</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Facilities & Equipment</h2>
              
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                    placeholder="Add a facility or equipment (e.g., Professional tools, Portable chair)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addFacility}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {freelancer.facilities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {freelancer.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-teal-50 text-teal-700"
                    >
                      {facility}
                      <button
                        type="button"
                        onClick={() => removeFacility(index)}
                        className="ml-2 text-teal-500 hover:text-teal-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No facilities added</p>
              )}
            </div>

            {/* Commission Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="commission.isCommissionApplicable"
                    checked={freelancer.commission.isCommissionApplicable}
                    onChange={handleChange}
                    id="commissionApplicable"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="commissionApplicable" className="ml-2 text-sm text-gray-700">
                    Commission Applicable
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="commission.percentage"
                      value={freelancer.commission.percentage}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors['commission.percentage'] ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                  {errors['commission.percentage'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors['commission.percentage']}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Status
                  </label>
                  <select
                    name="approvalStatus"
                    value={freelancer.approvalStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center h-12">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={freelancer.isActive}
                      onChange={handleChange}
                      id="isActive"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active Freelancer
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    When inactive, the freelancer won't be visible to customers
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {saving ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditFreelancer;