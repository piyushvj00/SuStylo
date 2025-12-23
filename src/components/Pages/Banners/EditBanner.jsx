// components/Pages/Banners/EditBanner.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/AxiosInstance';
import {
  ArrowLeft,
  Save,
  Loader,
  Upload,
  Image as ImageIcon,
  X,
  AlertCircle,
  Home,
  Store,
  Info,
  Layout,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState(null);
  const [formData, setFormData] = useState({
    page: 'home',
    section: 'hero',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const pages = [
    { value: 'home', label: 'Home Page', icon: <Home className="h-4 w-4" /> },
    { value: 'salons', label: 'Salons Page', icon: <Store className="h-4 w-4" /> },
    { value: 'about', label: 'About Page', icon: <Info className="h-4 w-4" /> },
    { value: 'services', label: 'Services Page', icon: <Layout className="h-4 w-4" /> },
    { value: 'freelancers', label: 'Freelancers Page', icon: <Layout className="h-4 w-4" /> },
    { value: 'contact', label: 'Contact Page', icon: <Layout className="h-4 w-4" /> }
  ];

  const sections = [
    { value: 'hero', label: 'Hero Section' },
    { value: 'featured', label: 'Featured Section' },
    { value: 'promo', label: 'Promotional Section' },
    { value: 'sidebar', label: 'Sidebar' },
    { value: 'popup', label: 'Popup' }
  ];

  useEffect(() => {
    fetchBannerData();
  }, [id]);

  const fetchBannerData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/banners/${id}`);
      if (response.data.success) {
        const bannerData = response.data.banner;
        setBanner(bannerData);
        setFormData({
          page: bannerData.page || 'home',
          section: bannerData.section || 'hero',
          image: null
        });
        setPreview(bannerData.image);
      }
    } catch (error) {
      console.error('Error fetching banner data:', error);
      toast.error('Failed to fetch banner data');
      navigate('/banners');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.page.trim()) {
      newErrors.page = 'Page is required';
    }

    if (!formData.section.trim()) {
      newErrors.section = 'Section is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Please upload a valid image (JPEG, PNG, WebP)' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: undefined }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreview(banner?.image || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setSaving(true);
      
      const data = new FormData();
      data.append('page', formData.page);
      data.append('section', formData.section);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await axiosInstance.put(`/banners/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Banner updated successfully!');
        navigate('/banners');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error(error.response?.data?.message || 'Failed to update banner');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading banner data...</p>
        </div>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Banner not found</p>
          <button
            onClick={() => navigate('/banners')}
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Banners
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/banners')}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Banners
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Banner</h1>
              <p className="text-gray-600">Update banner information</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Current Banner Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Banner Preview */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Banner</h2>
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={banner.image}
                    alt={`${banner.page} banner`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black/70 text-white">
                      {banner.page} - {banner.section}
                    </span>
                  </div>
                  <a
                    href={banner.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    title="View Full Image"
                  >
                    <ExternalLink className="h-4 w-4 text-gray-700" />
                  </a>
                </div>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Banner Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Page Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Page *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {pages.map((page) => (
                        <div key={page.value}>
                          <input
                            type="radio"
                            name="page"
                            id={`page-${page.value}`}
                            value={page.value}
                            checked={formData.page === page.value}
                            onChange={handleChange}
                            className="hidden peer"
                          />
                          <label
                            htmlFor={`page-${page.value}`}
                            className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${formData.page === page.value
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                              }`}
                          >
                            <div className="mb-2">
                              {page.icon}
                            </div>
                            <span className="text-sm font-medium text-center">{page.label}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.page && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.page}
                      </p>
                    )}
                  </div>

                  {/* Section Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Section *
                    </label>
                    <div className="space-y-2">
                      {sections.map((section) => (
                        <div key={section.value}>
                          <input
                            type="radio"
                            name="section"
                            id={`section-${section.value}`}
                            value={section.value}
                            checked={formData.section === section.value}
                            onChange={handleChange}
                            className="hidden peer"
                          />
                          <label
                            htmlFor={`section-${section.value}`}
                            className={`block w-full px-4 py-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${formData.section === section.value
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{section.label}</span>
                              {formData.section === section.value && (
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                              )}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.section && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.section}
                      </p>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Update Image (Optional)
                  </label>
                  
                  {!formData.image ? (
                    <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 ${errors.image
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                      }`}>
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                            <Upload className="h-6 w-6 text-indigo-600" />
                          </div>
                          <h3 className="text-md font-semibold text-gray-900 mb-1">
                            Click to upload new image
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Leave empty to keep current image
                          </p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={preview}
                          alt="New banner preview"
                          className="w-full h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-3 right-3 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-center">
                        <label htmlFor="image-upload" className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Change Image
                        </label>
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                  
                  {errors.image && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.image}
                    </p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/banners')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl"
                  >
                    {saving ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Banner
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column - Banner Info */}
            <div className="space-y-6">
              {/* Banner Details Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Banner Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Banner ID
                    </label>
                    <div className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                      {banner._id}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created By
                    </label>
                    <div className="flex items-center text-gray-900">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {banner.createdBy?.name || 'Admin'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created Date
                    </label>
                    <div className="flex items-center text-gray-900">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDate(banner.createdAt)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Updated
                    </label>
                    <div className="flex items-center text-gray-900">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDate(banner.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.open(banner.image, '_blank')}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full Image
                  </button>
                  <button
                    onClick={() => navigate('/banners')}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to List
                  </button>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Tips</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                    <span>Keep banner images consistent across pages</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                    <span>Update banners seasonally for freshness</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                    <span>Test banners on different devices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBanner;