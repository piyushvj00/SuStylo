// components/Pages/Businesses/SalonDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../config/AxiosInstance';
import {
  ArrowLeft,
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Users,
  Scissors,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Loader,
  Image as ImageIcon,
  FileText,
  Wifi,
  Car,
  Wind,
  Clock,
  DollarSign,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SalonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchSalonDetails();
  }, [id]);

  const fetchSalonDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/salons/${id}`);
      if (response.data.success) {
        setSalon(response.data.salon);
      }
    } catch (error) {
      console.error('Error fetching salon details:', error);
      toast.error('Failed to fetch salon details');
      navigate('/businesses/salons');
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
          <Loader className="h-12 w-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading salon details...</p>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Salon not found</p>
          <Link
            to="/businesses/salons"
            className="mt-4 inline-flex items-center text-purple-600 hover:text-purple-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Salons
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
            to="/businesses/salons"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Salons
          </Link>
        </div>

        {/* Salon Header */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            {/* Header Background */}
            <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600 relative">
              {salon.photos && salon.photos.length > 0 ? (
                <img
                  src={salon.photos[0]}
                  alt={salon.salonName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Store className="h-16 w-16 text-white/50" />
                </div>
              )}
            </div>

            {/* Salon Info */}
            <div className="px-8 pb-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between -mt-12">
                {/* Logo/Icon */}
                <div className="w-24 h-24 rounded-2xl bg-white shadow-lg border-4 border-white flex items-center justify-center">
                  <Store className="h-12 w-12 text-purple-600" />
                </div>

                {/* Actions */}
                <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                  {getStatusBadge(salon.approvalStatus)}
                  {salon.isActive ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                  <Link
                    to={`/businesses/salons/edit/${id}`}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Salon
                  </Link>
                </div>
              </div>

              <div className="mt-6">
                <h1 className="text-3xl font-bold text-gray-900">{salon.salonName}</h1>
                <p className="text-gray-600 mt-2">{salon.description}</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">{salon.address?.street}</p>
                      <p className="text-sm">
                        {salon.address?.area}, {salon.address?.city}, {salon.address?.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">{salon.contact?.phone}</p>
                      <p className="text-sm">Phone</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium truncate">{salon.contact?.email}</p>
                      <p className="text-sm">Email</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Star className="h-5 w-5 mr-3 text-yellow-500 fill-current" />
                    <div>
                      <p className="font-medium">{salon.rating?.average || 0} / 5</p>
                      <p className="text-sm">{salon.rating?.count || 0} reviews</p>
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
                {['overview', 'services', 'staff', 'reviews', 'documents'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 capitalize ${activeTab === tab
                        ? 'border-purple-600 text-purple-600'
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
                  {/* Facilities */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Facilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {salon.facilities && salon.facilities.length > 0 ? (
                        salon.facilities.map((facility, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-50 text-blue-700"
                          >
                            {facility === 'AC' && <Wind className="h-3 w-3 mr-1.5" />}
                            {facility === 'Parking' && <Car className="h-3 w-3 mr-1.5" />}
                            {facility === 'WiFi' && <Wifi className="h-3 w-3 mr-1.5" />}
                            {facility}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No facilities listed</p>
                      )}
                    </div>
                  </div>

                  {/* Gallery */}
                  {salon.photos && salon.photos.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {salon.photos.map((photo, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden">
                            <img
                              src={photo}
                              alt={`Salon photo ${index + 1}`}
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
                        <span className="text-gray-600">Chair Count</span>
                        <span className="font-semibold">{salon.chairCount || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Staff Count</span>
                        <span className="font-semibold">{salon.staff?.length || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Services</span>
                        <span className="font-semibold">{Array.isArray(salon.services) ? salon.services.length : 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Bookings</span>
                        <span className="font-semibold">{salon.totalBookings || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Revenue</span>
                        <span className="font-semibold text-green-600">
                          ₹{salon.totalRevenue || 0}
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
                        <span className="font-semibold text-purple-600">
                          {salon.commission?.percentage || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Flat Commission</span>
                        <span className="font-semibold">₹{salon.commission?.flat || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status</span>
                        <span className={`font-semibold ${salon.commission?.isCommissionApplicable
                            ? 'text-green-600'
                            : 'text-red-600'
                          }`}>
                          {salon.commission?.isCommissionApplicable ? 'Applicable' : 'Not Applicable'}
                        </span>
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
                {salon.services && typeof salon.services === 'object' ? (
                  <div className="space-y-6">
                    {/* Male Services */}
                    {salon.services.male && Object.keys(salon.services.male).length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-700 mb-4">Male Services</h4>
                        <div className="space-y-4">
                          {Object.entries(salon.services.male).map(([categoryName, categoryData]) => (
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
                                      <span className="capitalize">{service.gender}</span>
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
                    {salon.services.female && Object.keys(salon.services.female).length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-700 mb-4">Female Services</h4>
                        <div className="space-y-4">
                          {Object.entries(salon.services.female).map(([categoryName, categoryData]) => (
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
                                      <span className="capitalize">{service.gender}</span>
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

            {/* Staff Tab */}
            {activeTab === 'staff' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Staff Members</h3>
                {salon.staff && salon.staff.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {salon.staff.map((staff) => (
                      <div
                        key={staff._id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            {staff.avatarUrl ? (
                              <img
                                src={staff.avatarUrl}
                                alt={staff.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-semibold">
                                {staff.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{staff.name}</h4>
                            <p className="text-sm text-gray-600">{staff.email}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <span className="capitalize">{staff.gender}</span>
                              <span className="mx-2">•</span>
                              <span>{staff.age} years</span>
                              <span className="mx-2">•</span>
                              <span>{staff.experience} yrs exp</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shift:</span>
                            <span className="font-medium">
                              {staff.shiftStart} - {staff.shiftEnd}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-medium ${staff.status === 'active'
                                ? 'text-green-600'
                                : 'text-red-600'
                              }`}>
                              {staff.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No staff members listed</p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Reviews</h3>
                {salon.reviews && salon.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {salon.reviews.map((review) => (
                      <div key={review._id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
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
                {salon.agreementDocs && salon.agreementDocs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {salon.agreementDocs.map((doc, index) => (
                      <a
                        key={index}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-gray-200 rounded-xl p-4 hover:border-purple-500 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                            <FileText className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-purple-600">
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

export default SalonDetails;