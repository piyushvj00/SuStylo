// components/Pages/Banners/CreateBanner.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Layout
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateBanner = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.page.trim()) {
      newErrors.page = 'Page is required';
    }

    if (!formData.section.trim()) {
      newErrors.section = 'Section is required';
    }

    if (!formData.image) {
      newErrors.image = 'Banner image is required';
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
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      
      const data = new FormData();
      data.append('page', formData.page);
      data.append('section', formData.section);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await axiosInstance.post('/banners', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Banner created successfully!');
        navigate('/banners');
      }
    } catch (error) {
      console.error('Error creating banner:', error);
      toast.error(error.response?.data?.message || 'Failed to create banner');
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Create New Banner</h1>
              <p className="text-gray-600">Add a new banner image for your website</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Banner Preview */}
            {preview && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Banner Preview</h2>
                <div className="relative">
                  <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={preview}
                      alt="Banner preview"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black/70 text-white">
                      {formData.page} - {formData.section}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Page & Section Selection */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Banner Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Page Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Page *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
            </div>

            {/* Image Upload */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Banner Image</h2>
              
              {!preview ? (
                <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${errors.image
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
                      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                        <Upload className="h-8 w-8 text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Click to upload banner image
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Upload a high-quality image for your banner
                      </p>
                      <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Choose Image
                      </div>
                      <p className="text-sm text-gray-500 mt-4">
                        Recommended: 1920x600px • Max 5MB • JPG, PNG, WebP
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Image selected. You can change it by uploading a new one.
                  </p>
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
              )}
              
              {errors.image && (
                <p className="mt-4 text-sm text-red-600 flex items-center justify-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.image}
                </p>
              )}
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 Banner Guidelines</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                  <span><strong>Hero Banners:</strong> Use 1920x600px images with minimal text overlay</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                  <span><strong>Featured Section:</strong> Use 1200x400px images with clear CTAs</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                  <span><strong>Image Quality:</strong> Always use high-resolution, optimized images</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                  <span><strong>Branding:</strong> Maintain consistent colors and typography</span>
                </li>
              </ul>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/banners')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Banner
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

export default CreateBanner;