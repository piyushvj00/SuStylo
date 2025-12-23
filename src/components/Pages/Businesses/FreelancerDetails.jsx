// components/Pages/Businesses/FreelancerDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../config/AxiosInstance';
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Award,
  Car,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Loader,
  Image as ImageIcon,
  FileText,
  Wifi,
  Wind,
  Scissors,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FreelancerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchFreelancerDetails();
  }, [id]);

  const fetchFreelancerDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/freelancer/${id}`);
      if (response.data.success) {
        setFreelancer(response.data.freelancer);
      }
    } catch (error) {
      console.error('Error fetching freelancer details:', error);
      toast.error('Failed to fetch freelancer details');
      navigate('/businesses/freelancers');
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Pending Approval
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1.5" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading freelancer details...</p>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Freelancer not found</p>
          <Link
            to="/businesses/freelancers"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Freelancers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            to="/businesses/freelancers"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Freelancers
          </Link>
        </div>

        {/* Freelancer Header */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            {/* Header Background */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-teal-600 relative">
              {freelancer.photos && freelancer.photos.length > 0 ? (
                <img
                  src={freelancer.photos[0]}
                  alt={freelancer.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-16 w-16 text-white/50" />
                </div>
              )}
            </div>

            {/* Freelancer Info */}
            <div className="px-8 pb-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between -mt-12">
                {/* Logo/Icon */}
                <div className="w-24 h-24 rounded-2xl bg-white shadow-lg border-4 border-white flex items-center justify-center">
                  <User className="h-12 w-12 text-blue-600" />
                </div>

                {/* Actions */}
                <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                  {getStatusBadge(freelancer.approvalStatus)}
                  {freelancer.isActive ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                  <Link
                    to={`/businesses/freelancers/edit/${id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Freelancer
                  </Link>
                </div>
              </div>

              <div className="mt-6">
                <h1 className="text-3xl font-bold text-gray-900">{freelancer.fullName}</h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <Award className="h-4 w-4 mr-2" />
                  <span>{freelancer.experience || 0} years of experience</span>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">{freelancer.address?.street || 'Not specified'}</p>
                      <p className="text-sm">
                        {freelancer.address?.city || 'City not specified'}, {freelancer.address?.state || 'State not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">{freelancer.phone}</p>
                      <p className="text-sm">Phone</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium truncate">{freelancer.email}</p>
                      <p className="text-sm">Email</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Star className="h-5 w-5 mr-3 text-yellow-500 fill-current" />
                    <div>
                      <p className="font-medium">{freelancer.rating?.average || 0} / 5</p>
                      <p className="text-sm">{freelancer.rating?.count || 0} reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {['overview', 'services', 'reviews', 'documents'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 capitalize ${activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Transport & Booking Info */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Transport Charge</span>
                          <span className="font-semibold text-blue-600">₹{freelancer.transportCharge || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Average Reach Time</span>
                          <span className="font-semibold">{freelancer.averageReachTime || 0} minutes</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Pre-booking</span>
                          <span className={`font-semibold ${freelancer.bookingTypes?.preBooking
                              ? 'text-green-600'
                              : 'text-red-600'
                            }`}>
                            {freelancer.bookingTypes?.preBooking ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Urgent Booking</span>
                          <span className={`font-semibold ${freelancer.bookingTypes?.urgentBooking
                              ? 'text-green-600'
                              : 'text-red-600'
                            }`}>
                            {freelancer.bookingTypes?.urgentBooking ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Facilities & Equipment</h3>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.facilities && freelancer.facilities.length > 0 ? (
                        freelancer.facilities.map((facility, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-teal-50 text-teal-700"
                          >
                            {facility.replace(/[\[\]"]/g, '')}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No facilities listed</p>
                      )}
                    </div>
                  </div>

                  {/* Gallery */}
                  {freelancer.photos && freelancer.photos.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {freelancer.photos.map((photo, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden">
                            <img
                              src={photo}
                              alt={`Portfolio ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Stats */}
                <div className="space-y-6">
                  {/* Stats Card */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Stats</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Services</span>
                        <span className="font-semibold">
                          {typeof freelancer.services === 'object' 
                            ? Object.values(freelancer.services).reduce((total, genderServices) => {
                                return total + Object.values(genderServices).reduce((catTotal, cat) => {
                                  return catTotal + (cat.services?.length || 0);
                                }, 0);
                              }, 0)
                            : 0
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Experience</span>
                        <span className="font-semibold">{freelancer.experience || 0} years</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Reviews</span>
                        <span className="font-semibold">{freelancer.rating?.count || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average Rating</span>
                        <span className="font-semibold text-yellow-600">
                          {freelancer.rating?.average || 0} / 5
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Commission */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Percentage</span>
                        <span className="font-semibold text-blue-600">
                          {freelancer.commission?.percentage || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status</span>
                        <span className={`font-semibold ${freelancer.commission?.isCommissionApplicable
                            ? 'text-green-600'
                            : 'text-red-600'
                          }`}>
                          {freelancer.commission?.isCommissionApplicable ? 'Applicable' : 'Not Applicable'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Card */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                    <div className="space-y-3">
                      {freelancer.contact?.website && (
                        <div className="flex items-center text-gray-600">
                          <Globe className="h-4 w-4 mr-3" />
                          <a
                            href={freelancer.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate"
                          >
                            {freelancer.contact.website}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-3" />
                        <span>{freelancer.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-3" />
                        <span className="truncate">{freelancer.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Services Offered</h3>
                {freelancer.services && typeof freelancer.services === 'object' ? (
                  <div className="space-y-6">
                    {/* Male Services */}
                    {freelancer.services.male && Object.keys(freelancer.services.male).length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-700 mb-4">Male Services</h4>
                        <div className="space-y-4">
                          {Object.entries(freelancer.services.male).map(([categoryName, categoryData]) => (
                            <div key={`male-${categoryName}`} className="border border-gray-200 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium text-gray-900">{categoryName}</h5>
                                <span className="text-sm text-gray-500">
                                  {categoryData.services?.length || 0} services
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {categoryData.services?.map((service) => (
                                  <div
                                    key={service._id}
                                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h6 className="font-medium text-gray-900">{service.name}</h6>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                          {service.description}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-semibold text-gray-900">
                                          ₹{service.discountPrice || service.price}
                                        </div>
                                        {service.discountPrice && (
                                          <div className="text-sm text-gray-500 line-through">
                                            ₹{service.price}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                                      <span>{service.duration} mins</span>
                                      <div className="flex items-center gap-2">
                                        <span className="capitalize">{service.gender}</span>
                                        {service.atHome && (
                                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                            At Home
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Female Services */}
                    {freelancer.services.female && Object.keys(freelancer.services.female).length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-700 mb-4">Female Services</h4>
                        <div className="space-y-4">
                          {Object.entries(freelancer.services.female).map(([categoryName, categoryData]) => (
                            <div key={`female-${categoryName}`} className="border border-gray-200 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium text-gray-900">{categoryName}</h5>
                                <span className="text-sm text-gray-500">
                                  {categoryData.services?.length || 0} services
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {categoryData.services?.map((service) => (
                                  <div
                                    key={service._id}
                                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h6 className="font-medium text-gray-900">{service.name}</h6>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                          {service.description}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-semibold text-gray-900">
                                          ₹{service.discountPrice || service.price}
                                        </div>
                                        {service.discountPrice && (
                                          <div className="text-sm text-gray-500 line-through">
                                            ₹{service.price}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                                      <span>{service.duration} mins</span>
                                      <div className="flex items-center gap-2">
                                        <span className="capitalize">{service.gender}</span>
                                        {service.atHome && (
                                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                            At Home
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No services listed</p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Reviews</h3>
                {freelancer.reviews && freelancer.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {freelancer.reviews.map((review) => (
                      <div key={review._id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                              {review.user?.name ? (
                                <span className="text-white font-semibold">
                                  {review.user.name.charAt(0).toUpperCase()}
                                </span>
                              ) : (
                                <UserCheck className="h-5 w-5 text-white" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {review.user?.name || 'Anonymous User'}
                              </h4>
                              <div className="flex items-center mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating
                                          ? 'text-yellow-500 fill-current'
                                          : 'text-gray-300'
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500 ml-2">
                                  {formatDate(review.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${review.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : review.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {review.status}
                          </span>
                        </div>
                        <p className="mt-4 text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet</p>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Documents</h3>
                {freelancer.agreementDocs && freelancer.agreementDocs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {freelancer.agreementDocs.map((doc, index) => (
                      <a
                        key={index}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">
                              Agreement Document {index + 1}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">Click to view/download</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No documents uploaded</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FreelancerDetails;