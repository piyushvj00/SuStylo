// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../../config/AxiosInstance';
// import { 
//   Eye, 
//   Trash2, 
//   Loader, 
//   Calendar, 
//   User, 
//   DollarSign, 
//   Clock, 
//   Filter, 
//   Search,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   TrendingUp,
//   TrendingDown
// } from 'lucide-react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const BookingsList = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [viewModal, setViewModal] = useState(false);
//   const [approveModal, setApproveModal] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     approved: 0,
//     completed: 0,
//     cancelled: 0,
//     totalRevenue: 0
//   });

//   // Fetch bookings based on user role
//   useEffect(() => {
//     fetchBookings();
//   }, [filterStatus]);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       let endpoint = '/booking/admin';

//       // Check user role from token
//       const token = localStorage.getItem('token');
//       if (token) {
//         const payload = JSON.parse(atob(token.split('.')[1]));

//         // If user is salon owner or freelancer, use provider endpoint
//         if (payload.role === 'admin' || payload.role === 'freelancer') {
//           endpoint = '/booking/provider';
//         }
//       }

//       const response = await axiosInstance.get(endpoint);

//       if (response.data.success) {
//         const allBookings = response.data.bookings || [];

//         // Apply filters
//         let filteredBookings = allBookings;
//         if (filterStatus !== 'all') {
//           filteredBookings = allBookings.filter(booking => booking.status === filterStatus);
//         }

//         setBookings(filteredBookings);
//         calculateStats(allBookings);
//       }
//     } catch (error) {
//       console.error('Error fetching bookings:', error);
//       toast.error('Failed to fetch bookings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (bookings) => {
//     const stats = {
//       total: bookings.length,
//       pending: 0,
//       approved: 0,
//       completed: 0,
//       cancelled: 0,
//       totalRevenue: 0
//     };

//     bookings.forEach(booking => {
//       stats[booking.status] = (stats[booking.status] || 0) + 1;

//       // Add to revenue if booking is completed or confirmed
//       if (['completed', 'confirmed', 'approved'].includes(booking.status) && booking.paymentStatus === 'paid') {
//         stats.totalRevenue += booking.totalAmount || 0;
//       }
//     });

//     setStats(stats);
//   };

//   const viewBooking = async (id) => {
//     try {
//       const response = await axiosInstance.get(`/booking/user/`); // You'll need to create a single booking endpoint
//       // For now, find booking from state
//       const booking = bookings.find(b => b._id === id);
//       if (booking) {
//         setSelectedBooking(booking);
//         setViewModal(true);
//       }
//     } catch (error) {
//       console.error('Error fetching booking details:', error);
//       toast.error('Failed to fetch booking details');
//     }
//   };

//   const approveBooking = async (id, approvedPrice) => {
//     try {
//       const response = await axiosInstance.put(`/booking/${id}/approve`, {
//         status: 'approved',
//         approvedPrice: approvedPrice
//       });

//       if (response.data.success) {
//         toast.success('Booking approved successfully!');
//         fetchBookings(); // Refresh list
//         setApproveModal(false);
//         setSelectedBooking(null);
//       }
//     } catch (error) {
//       console.error('Error approving booking:', error);
//       toast.error(error.response?.data?.message || 'Failed to approve booking');
//     }
//   };

//   const rejectBooking = async (id) => {
//     try {
//       const response = await axiosInstance.put(`/booking/${id}/approve`, {
//         status: 'rejected'
//       });

//       if (response.data.success) {
//         toast.success('Booking rejected successfully!');
//         fetchBookings();
//       }
//     } catch (error) {
//       console.error('Error rejecting booking:', error);
//       toast.error('Failed to reject booking');
//     }
//   };

//   const cancelBooking = async (id, reason) => {
//     if (!reason) {
//       toast.error('Please provide a cancellation reason');
//       return;
//     }

//     try {
//       const response = await axiosInstance.put(`/booking/${id}/cancel`, {
//         reason: reason
//       });

//       if (response.data.success) {
//         toast.success('Booking cancelled successfully!');
//         fetchBookings();
//       }
//     } catch (error) {
//       console.error('Error cancelling booking:', error);
//       toast.error('Failed to cancel booking');
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
//       'approved': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
//       'confirmed': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
//       'completed': { color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
//       'cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle },
//       'rejected': { color: 'bg-red-100 text-red-800', icon: XCircle }
//     };

//     const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
//     const Icon = config.icon;

//     return (
//       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
//         <Icon className="h-3 w-3 mr-1" />
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </span>
//     );
//   };

//   const getPaymentBadge = (status) => {
//     const color = status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
//     return (
//       <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
//         {status === 'paid' ? 'Paid' : 'Pending'}
//       </span>
//     );
//   };

//   // Filter bookings based on search
//   const filteredBookings = bookings.filter(booking => {
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       booking._id?.toLowerCase().includes(searchLower) ||
//       (booking.userId?.name || '').toLowerCase().includes(searchLower) ||
//       (booking.freelancerId?.fullName || '').toLowerCase().includes(searchLower) ||
//       (booking.salonId?.name || '').toLowerCase().includes(searchLower)
//     );
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-4">
//           <div className="relative">
//             <Loader className="h-12 w-12 animate-spin text-green-600" />
//             <div className="absolute inset-0 rounded-full border-2 border-green-200 animate-ping"></div>
//           </div>
//           <div className="text-center">
//             <h3 className="text-lg font-semibold text-gray-800">Loading Bookings</h3>
//             <p className="text-gray-600 mt-1">Fetching your bookings data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={true}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />

//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//               <div>
//                 <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
//                   Bookings Management
//                 </h1>
//                 <p className="text-gray-600 mt-2 flex items-center gap-2">
//                   <Calendar className="h-4 w-4" />
//                   Total {stats.total} booking{stats.total !== 1 ? 's' : ''}
//                 </p>
//               </div>

//               {/* Stats Cards */}
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//                 <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
//                       <div className="text-xs text-gray-500">Total Bookings</div>
//                     </div>
//                     <div className="p-2 bg-blue-50 rounded-lg">
//                       <Calendar className="h-5 w-5 text-blue-600" />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
//                       <div className="text-xs text-gray-500">Pending</div>
//                     </div>
//                     <div className="p-2 bg-yellow-50 rounded-lg">
//                       <Clock className="h-5 w-5 text-yellow-600" />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
//                       <div className="text-xs text-gray-500">Approved</div>
//                     </div>
//                     <div className="p-2 bg-green-50 rounded-lg">
//                       <CheckCircle className="h-5 w-5 text-green-600" />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="text-2xl font-bold text-purple-600">₹{stats.totalRevenue.toLocaleString()}</div>
//                       <div className="text-xs text-gray-500">Revenue</div>
//                     </div>
//                     <div className="p-2 bg-purple-50 rounded-lg">
//                       <DollarSign className="h-5 w-5 text-purple-600" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Filters and Search */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//               {/* Search */}
//               <div className="lg:col-span-1">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search bookings..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                   />
//                   <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//                     <Search className="h-5 w-5" />
//                   </div>
//                   {searchTerm && (
//                     <button
//                       onClick={() => setSearchTerm('')}
//                       className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Status Filter */}
//               <div className="lg:col-span-1">
//                 <div className="relative">
//                   <select
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="pending">Pending</option>
//                     <option value="approved">Approved</option>
//                     <option value="confirmed">Confirmed</option>
//                     <option value="completed">Completed</option>
//                     <option value="cancelled">Cancelled</option>
//                     <option value="rejected">Rejected</option>
//                   </select>
//                   <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//                     <Filter className="h-5 w-5" />
//                   </div>
//                   <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               {/* Refresh Button */}
//               <div className="lg:col-span-1">
//                 <button
//                   onClick={fetchBookings}
//                   className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
//                 >
//                   <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                   Refresh Bookings
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Bookings Table */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Booking Info
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Service & Provider
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Amount & Status
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Date & Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredBookings.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" className="px-6 py-12 text-center">
//                         <div className="flex flex-col items-center space-y-3">
//                           <div className="text-6xl">📅</div>
//                           <div>
//                             <h3 className="text-lg font-semibold text-gray-900">No bookings found</h3>
//                             <p className="text-gray-600 mt-1">
//                               {searchTerm || filterStatus !== 'all'
//                                 ? 'No bookings match your criteria'
//                                 : 'No bookings have been created yet'
//                               }
//                             </p>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredBookings.map((booking) => (
//                       <tr
//                         key={booking._id}
//                         className="hover:bg-gray-50 transition-all duration-200 group"
//                       >
//                         <td className="px-6 py-4">
//                           <div className="space-y-2">
//                             <div className="flex items-center space-x-2">
//                               <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform"></div>
//                               <div>
//                                 <div className="text-sm font-semibold text-gray-900">
//                                   Booking #{booking._id.slice(-8).toUpperCase()}
//                                 </div>
//                                 <div className="text-xs text-gray-500">
//                                   Type: {booking.bookingType || 'preBooking'}
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex items-center space-x-2 text-sm text-gray-600">
//                               <User className="h-3 w-3" />
//                               <span>Customer: {booking.userId?.name || 'N/A'}</span>
//                             </div>
//                           </div>
//                         </td>

//                         <td className="px-6 py-4">
//                           <div className="space-y-2">
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">
//                                 {booking.services?.[0]?.serviceId?.name || 'Service'} × {booking.services?.[0]?.quantity || 1}
//                               </div>
//                               {booking.services && booking.services.length > 1 && (
//                                 <div className="text-xs text-gray-500">
//                                   +{booking.services.length - 1} more service{booking.services.length > 2 ? 's' : ''}
//                                 </div>
//                               )}
//                             </div>
//                             <div className="text-sm text-gray-600">
//                               {booking.freelancerId ? (
//                                 <span>Freelancer: {booking.freelancerId.fullName || 'N/A'}</span>
//                               ) : (
//                                 <span>Salon: {booking.salonId?.name || 'N/A'}</span>
//                               )}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {booking.isAtHome ? '🏠 At Home' : '🏪 At Salon'}
//                             </div>
//                           </div>
//                         </td>

//                         <td className="px-6 py-4">
//                           <div className="space-y-2">
//                             <div className="flex items-center space-x-2">
//                               <DollarSign className="h-4 w-4 text-green-600" />
//                               <span className="text-lg font-bold text-gray-900">
//                                 ₹{booking.totalAmount || booking.baseAmount || 0}
//                               </span>
//                               {booking.approvedPrice && booking.approvedPrice !== booking.baseAmount && (
//                                 <span className="text-xs text-gray-500 line-through">
//                                   ₹{booking.baseAmount}
//                                 </span>
//                               )}
//                             </div>
//                             <div className="space-y-1">
//                               <div>{getStatusBadge(booking.status)}</div>
//                               <div>{getPaymentBadge(booking.paymentStatus)}</div>
//                             </div>
//                           </div>
//                         </td>

//                         <td className="px-6 py-4">
//                           <div className="space-y-3">
//                             <div className="text-sm text-gray-500">
//                               {formatDate(booking.createdAt)}
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <button
//                                 onClick={() => viewBooking(booking._id)}
//                                 className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm font-medium flex items-center gap-1"
//                                 title="View Details"
//                               >
//                                 <Eye className="h-4 w-4" />
//                                 View
//                               </button>

//                               {/* Show approve button only for pending bookings */}
//                               {booking.status === 'pending' && (
//                                 <button
//                                   onClick={() => {
//                                     setSelectedBooking(booking);
//                                     setApproveModal(true);
//                                   }}
//                                   className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 text-sm font-medium flex items-center gap-1"
//                                   title="Approve Booking"
//                                 >
//                                   <CheckCircle className="h-4 w-4" />
//                                   Approve
//                                 </button>
//                               )}

//                               {/* Show cancel button for pending/approved bookings */}
//                               {['pending', 'approved'].includes(booking.status) && (
//                                 <button
//                                   onClick={() => {
//                                     const reason = prompt('Enter cancellation reason:');
//                                     if (reason) cancelBooking(booking._id, reason);
//                                   }}
//                                   className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-medium flex items-center gap-1"
//                                   title="Cancel Booking"
//                                 >
//                                   <XCircle className="h-4 w-4" />
//                                   Cancel
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Results Count */}
//           {filteredBookings.length > 0 && (
//             <div className="mt-4 text-sm text-gray-600 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
//               Showing {filteredBookings.length} of {bookings.length} bookings
//               {(searchTerm || filterStatus !== 'all') && (
//                 <span className="ml-2">
//                   • <button
//                     onClick={() => {
//                       setSearchTerm('');
//                       setFilterStatus('all');
//                     }}
//                     className="text-green-600 hover:text-green-700 font-medium"
//                   >
//                     Clear filters
//                   </button>
//                 </span>
//               )}
//             </div>
//           )}

//           {/* View Booking Modal */}
//           {viewModal && selectedBooking && (
//             <BookingDetailsModal
//               booking={selectedBooking}
//               onClose={() => setViewModal(false)}
//               formatDate={formatDate}
//             />
//           )}

//           {/* Approve Booking Modal */}
//           {approveModal && selectedBooking && (
//             <ApproveBookingModal
//               booking={selectedBooking}
//               onApprove={approveBooking}
//               onReject={rejectBooking}
//               onClose={() => setApproveModal(false)}
//             />
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// // Booking Details Modal Component
// const BookingDetailsModal = ({ booking, onClose, formatDate }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
//               <p className="text-gray-600 mt-1">
//                 ID: {booking._id}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
//             >
//               <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Left Column - Customer & Service Details */}
//             <div className="space-y-6">
//               {/* Customer Info */}
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                   <User className="h-5 w-5" />
//                   <span>Customer Information</span>
//                 </h3>
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                     <div className="bg-white rounded-lg p-3 border border-gray-200">
//                       <p className="text-gray-900">{booking.userId?.name || 'N/A'}</p>
//                     </div>
//                   </div>
//                   {booking.address && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                       <div className="bg-white rounded-lg p-3 border border-gray-200">
//                         <p className="text-gray-900">
//                           {booking.address.line1}, {booking.address.city} - {booking.address.pincode}
//                         </p>
//                         {booking.address.landmark && (
//                           <p className="text-sm text-gray-600 mt-1">Landmark: {booking.address.landmark}</p>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Service Details */}
//               <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                   <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                   </svg>
//                   <span>Service Details</span>
//                 </h3>
//                 <div className="space-y-3">
//                   {booking.services?.map((service, index) => (
//                     <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <p className="font-medium text-gray-900">
//                             {service.serviceId?.name || 'Service'}
//                           </p>
//                           <p className="text-sm text-gray-600">Quantity: {service.quantity}</p>
//                         </div>
//                         <p className="font-bold text-gray-900">₹{service.price}</p>
//                       </div>
//                     </div>
//                   ))}
//                   <div className="bg-white rounded-lg p-3 border border-gray-200">
//                     <div className="flex justify-between items-center">
//                       <span className="font-semibold text-gray-900">Base Amount</span>
//                       <span className="font-bold text-gray-900">₹{booking.baseAmount}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Provider & Financial Details */}
//             <div className="space-y-6">
//               {/* Provider Info */}
//               <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                   <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                   </svg>
//                   <span>Service Provider</span>
//                 </h3>
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       {booking.freelancerId ? 'Freelancer' : 'Salon'}
//                     </label>
//                     <div className="bg-white rounded-lg p-3 border border-gray-200">
//                       <p className="text-gray-900 font-medium">
//                         {booking.freelancerId?.fullName || booking.salonId?.name || 'N/A'}
//                       </p>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
//                     <div className="bg-white rounded-lg p-3 border border-gray-200">
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-900">
//                           {booking.bookingType === 'urgentBooking' ? 'Urgent Booking' : 'Pre Booking'}
//                         </span>
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${booking.isAtHome ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
//                           {booking.isAtHome ? 'At Home' : 'At Salon'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Financial Details */}
//               <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-100">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                   <DollarSign className="h-5 w-5" />
//                   <span>Financial Details</span>
//                 </h3>
//                 <div className="space-y-3">
//                   <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-700">Base Amount</span>
//                       <span className="font-medium">₹{booking.baseAmount}</span>
//                     </div>
//                     {booking.approvedPrice && booking.approvedPrice !== booking.baseAmount && (
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-700">Approved Price</span>
//                         <div className="flex items-center space-x-2">
//                           <span className="text-xs text-gray-500 line-through">₹{booking.baseAmount}</span>
//                           <span className="font-bold text-green-600">₹{booking.approvedPrice}</span>
//                           {booking.approvedPrice > booking.baseAmount ? (
//                             <TrendingUp className="h-4 w-4 text-green-600" />
//                           ) : (
//                             <TrendingDown className="h-4 w-4 text-red-600" />
//                           )}
//                         </div>
//                       </div>
//                     )}
//                     {booking.commissionAmount > 0 && (
//                       <div className="flex justify-between">
//                         <span className="text-gray-700">Commission</span>
//                         <span className="font-medium text-red-600">-₹{booking.commissionAmount}</span>
//                       </div>
//                     )}
//                     <div className="pt-2 border-t border-gray-200">
//                       <div className="flex justify-between items-center">
//                         <span className="font-semibold text-gray-900">Total Amount</span>
//                         <span className="text-xl font-bold text-gray-900">₹{booking.totalAmount}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-white rounded-lg p-3 border border-gray-200">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-700">Payment Status</span>
//                       <span className={`px-2 py-1 rounded text-xs font-medium ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                         {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
//                       </span>
//                     </div>
//                     <div className="mt-2 flex justify-between items-center">
//                       <span className="text-gray-700">Payment Type</span>
//                       <span className="font-medium">{booking.paymentType || 'Cash'}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Timestamps */}
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
//               <p className="text-gray-900">{formatDate(booking.createdAt)}</p>
//             </div>
//             <div className="bg-gray-50 rounded-lg p-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
//               <p className="text-gray-900">{formatDate(booking.updatedAt)}</p>
//             </div>
//             <div className="bg-gray-50 rounded-lg p-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <p className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
//                 {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//               </p>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200">
//             <button
//               onClick={() => {
//                 navigator.clipboard.writeText(JSON.stringify(booking, null, 2));
//                 toast.success('Booking details copied to clipboard!');
//               }}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
//             >
//               Copy Details
//             </button>
//             <button
//               onClick={onClose}
//               className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 font-semibold"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Approve Booking Modal Component
// const ApproveBookingModal = ({ booking, onApprove, onReject, onClose }) => {
//   const [approvedPrice, setApprovedPrice] = useState(booking.totalAmount || booking.baseAmount);
//   const [isFreelancer, setIsFreelancer] = useState(false);

//   useEffect(() => {
//     // Check if current user is freelancer (can increase price)
//     const token = localStorage.getItem('token');
//     if (token) {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       setIsFreelancer(payload.role === 'freelancer');
//     }
//   }, []);

//   const canIncreasePrice = isFreelancer;
//   const originalPrice = booking.baseAmount;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl max-w-md w-full">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold text-gray-900">Approve Booking</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           <div className="space-y-4">
//             <div className="bg-blue-50 rounded-lg p-4">
//               <p className="text-sm text-gray-700">
//                 Booking #{booking._id.slice(-8).toUpperCase()}
//               </p>
//               <p className="text-lg font-bold text-gray-900 mt-1">₹{originalPrice}</p>
//               <p className="text-sm text-gray-600 mt-1">
//                 {booking.services?.length || 0} service{booking.services?.length !== 1 ? 's' : ''}
//               </p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Approve Price {!canIncreasePrice && '(Cannot increase price)'}
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <DollarSign className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="number"
//                   value={approvedPrice}
//                   onChange={(e) => setApprovedPrice(parseInt(e.target.value) || 0)}
//                   min={canIncreasePrice ? 0 : originalPrice}
//                   max={originalPrice * 2}
//                   className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 />
//               </div>
//               {canIncreasePrice && approvedPrice > originalPrice && (
//                 <p className="text-xs text-green-600 mt-1">
//                   ⚠️ You're increasing price by ₹{approvedPrice - originalPrice}
//                 </p>
//               )}
//               {!canIncreasePrice && approvedPrice < originalPrice && (
//                 <p className="text-xs text-green-600 mt-1">
//                   ✅ You can reduce price as salon owner
//                 </p>
//               )}
//             </div>

//             {approvedPrice !== originalPrice && (
//               <div className="bg-yellow-50 rounded-lg p-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-700">Original Price</span>
//                   <span className="text-gray-700 line-through">₹{originalPrice}</span>
//                 </div>
//                 <div className="flex justify-between items-center mt-1">
//                   <span className="font-medium text-gray-900">Final Price</span>
//                   <span className="font-bold text-green-600">₹{approvedPrice}</span>
//                 </div>
//                 <div className="flex justify-between items-center mt-1">
//                   <span className="text-sm text-gray-700">Difference</span>
//                   <span className={`font-medium ${approvedPrice > originalPrice ? 'text-green-600' : 'text-red-600'}`}>
//                     {approvedPrice > originalPrice ? '+' : ''}{approvedPrice - originalPrice}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="mt-6 flex justify-end space-x-3">
//             <button
//               onClick={() => {
//                 onReject(booking._id);
//               }}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
//             >
//               Reject
//             </button>
//             <button
//               onClick={() => {
//                 onApprove(booking._id, approvedPrice);
//               }}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
//             >
//               Approve at ₹{approvedPrice}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingsList;



// पूरा updated BookingsList.js file
import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import {
  Eye,
  Trash2,
  Loader,
  Calendar,
  User,
  DollarSign,
  Clock,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0
  });



const fetchBookings = useCallback(async () => {
  try {
    setLoading(true);
    let endpoint = '/booking/admin';

    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (payload.role === 'admin' || payload.role === 'freelancer') {
        endpoint = '/booking/provider';
      }
    }

    const response = await axiosInstance.get(endpoint);

    if (response.data.success) {
      const allBookings = response.data.bookings || [];

      let filteredBookings = allBookings;
      if (filterStatus !== 'all') {
        filteredBookings = allBookings.filter(
          booking => booking.status === filterStatus
        );
      }

      setBookings(filteredBookings);
      calculateStats(allBookings);
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    toast.error('Failed to fetch bookings');
  } finally {
    setLoading(false);
  }
}, [filterStatus]);


useEffect(() => {
  fetchBookings();
}, [fetchBookings]);


  const calculateStats = (bookings) => {
    const stats = {
      total: bookings.length,
      pending: 0,
      approved: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0
    };

    bookings.forEach(booking => {
      stats[booking.status] = (stats[booking.status] || 0) + 1;

      // Add to revenue if booking is completed or confirmed
      if (['completed', 'confirmed', 'approved'].includes(booking.status) && booking.paymentStatus === 'paid') {
        stats.totalRevenue += booking.totalAmount || 0;
      }
    });

    setStats(stats);
  };

  const viewBooking = async (id) => {
    try {
      // const response = await axiosInstance.get(`/booking/user/`); // You'll need to create a single booking endpoint
      // For now, find booking from state
      const booking = bookings.find(b => b._id === id);
      if (booking) {
        setSelectedBooking(booking);
        setViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Failed to fetch booking details');
    }
  };

  const approveBooking = async (id, approvedPrice) => {
    try {
      const response = await axiosInstance.put(`/booking/${id}/approve`, {
        status: 'approved',
        approvedPrice: approvedPrice
      });

      if (response.data.success) {
        toast.success('Booking approved successfully!');
        fetchBookings(); // Refresh list
        setApproveModal(false);
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      toast.error(error.response?.data?.message || 'Failed to approve booking');
    }
  };

  const rejectBooking = async (id) => {
    try {
      const response = await axiosInstance.put(`/booking/${id}/approve`, {
        status: 'rejected'
      });

      if (response.data.success) {
        toast.success('Booking rejected successfully!');
        fetchBookings();
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Failed to reject booking');
    }
  };

  // Cancel modal open function
  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
    setCancelReason('');
    setCancelModal(true);
  };

  // Cancel modal close function
  const closeCancelModal = () => {
    setCancelModal(false);
    setBookingToCancel(null);
    setCancelReason('');
  };

  // Cancel booking function
  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    try {
      const response = await axiosInstance.put(`/booking/${bookingToCancel._id}/cancel`, {
        reason: cancelReason
      });

      if (response.data.success) {
        toast.success('Booking cancelled successfully!');
        fetchBookings();
        closeCancelModal();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'approved': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'confirmed': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      'completed': { color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle },
      'rejected': { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const color = status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
        {status === 'paid' ? 'Paid' : 'Pending'}
      </span>
    );
  };

  // Filter bookings based on search
  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking._id?.toLowerCase().includes(searchLower) ||
      (booking.userId?.name || '').toLowerCase().includes(searchLower) ||
      (booking.freelancerId?.fullName || '').toLowerCase().includes(searchLower) ||
      (booking.salonId?.name || '').toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader className="h-12 w-12 animate-spin text-green-600" />
            <div className="absolute inset-0 rounded-full border-2 border-green-200 animate-ping"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">Loading Bookings</h3>
            <p className="text-gray-600 mt-1">Fetching your bookings data...</p>
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
                  Bookings Management
                </h1>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Total {stats.total} booking{stats.total !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                      <div className="text-xs text-gray-500">Total Bookings</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                      <div className="text-xs text-gray-500">Pending</div>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                      <div className="text-xs text-gray-500">Approved</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">₹{stats.totalRevenue.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search bookings..."
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

              {/* Status Filter */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Filter className="h-5 w-5" />
                  </div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Refresh Button */}
              <div className="lg:col-span-1">
                <button
                  onClick={fetchBookings}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Bookings
                </button>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Booking Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Service & Provider
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount & Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date & Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="text-6xl">📅</div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">No bookings found</h3>
                            <p className="text-gray-600 mt-1">
                              {searchTerm || filterStatus !== 'all'
                                ? 'No bookings match your criteria'
                                : 'No bookings have been created yet'
                              }
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="hover:bg-gray-50 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform"></div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  Booking #{booking._id.slice(-8).toUpperCase()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Type: {booking.bookingType || 'preBooking'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <User className="h-3 w-3" />
                              <span>Customer: {booking.userId?.name || 'N/A'}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {booking.services?.[0]?.serviceId?.name || 'Service'} × {booking.services?.[0]?.quantity || 1}
                              </div>
                              {booking.services && booking.services.length > 1 && (
                                <div className="text-xs text-gray-500">
                                  +{booking.services.length - 1} more service{booking.services.length > 2 ? 's' : ''}
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {booking.freelancerId ? (
                                <span>Freelancer: {booking.freelancerId.fullName || 'N/A'}</span>
                              ) : (
                                <span>Salon: {booking.salonId?.name || 'N/A'}</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.isAtHome ? '🏠 At Home' : '🏪 At Salon'}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-lg font-bold text-gray-900">
                                ₹{booking.totalAmount || booking.baseAmount || 0}
                              </span>
                              {booking.approvedPrice && booking.approvedPrice !== booking.baseAmount && (
                                <span className="text-xs text-gray-500 line-through">
                                  ₹{booking.baseAmount}
                                </span>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div>{getStatusBadge(booking.status)}</div>
                              <div>{getPaymentBadge(booking.paymentStatus)}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-3">
                            <div className="text-sm text-gray-500">
                              {formatDate(booking.createdAt)}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => viewBooking(booking._id)}
                                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm font-medium flex items-center gap-1"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>

                              {/* Show approve button only for pending bookings */}
                              {booking.status === 'pending' && (
                                <button
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setApproveModal(true);
                                  }}
                                  className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 text-sm font-medium flex items-center gap-1"
                                  title="Approve Booking"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Approve
                                </button>
                              )}

                              {/* Show cancel button for pending/approved bookings */}
                              {['pending', 'approved', 'confirmed'].includes(booking.status) && (
                                <button
                                  onClick={() => openCancelModal(booking)}
                                  className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-medium flex items-center gap-1"
                                  title="Cancel Booking"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Results Count */}
          {filteredBookings.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              Showing {filteredBookings.length} of {bookings.length} bookings
              {(searchTerm || filterStatus !== 'all') && (
                <span className="ml-2">
                  • <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                    }}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear filters
                  </button>
                </span>
              )}
            </div>
          )}

          {/* View Booking Modal */}
          {viewModal && selectedBooking && (
            <BookingDetailsModal
              booking={selectedBooking}
              onClose={() => setViewModal(false)}
              formatDate={formatDate}
            />
          )}

          {/* Approve Booking Modal */}
          {approveModal && selectedBooking && (
            <ApproveBookingModal
              booking={selectedBooking}
              onApprove={approveBooking}
              onReject={rejectBooking}
              onClose={() => setApproveModal(false)}
            />
          )}

          {/* Cancel Booking Modal */}
          {cancelModal && bookingToCancel && (
            <CancelBookingModal
              booking={bookingToCancel}
              onCancel={handleCancelBooking}
              onClose={closeCancelModal}
              cancelReason={cancelReason}
              setCancelReason={setCancelReason}
            />
          )}
        </div>
      </div>
    </>
  );
};

// Booking Details Modal Component (No changes needed)
const BookingDetailsModal = ({ booking, onClose, formatDate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
              <p className="text-gray-600 mt-1">
                ID: {booking._id}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Customer & Service Details */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Customer Information</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-900">{booking.userId?.name || 'N/A'}</p>
                    </div>
                  </div>
                  {booking.address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-gray-900">
                          {booking.address.line1}, {booking.address.city} - {booking.address.pincode}
                        </p>
                        {booking.address.landmark && (
                          <p className="text-sm text-gray-600 mt-1">Landmark: {booking.address.landmark}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Service Details</span>
                </h3>
                <div className="space-y-3">
                  {booking.services?.map((service, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {service.serviceId?.name || 'Service'}
                          </p>
                          <p className="text-sm text-gray-600">Quantity: {service.quantity}</p>
                        </div>
                        <p className="font-bold text-gray-900">₹{service.price}</p>
                      </div>
                    </div>
                  ))}
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Base Amount</span>
                      <span className="font-bold text-gray-900">₹{booking.baseAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Provider & Financial Details */}
            <div className="space-y-6">
              {/* Provider Info */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Service Provider</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {booking.freelancerId ? 'Freelancer' : 'Salon'}
                    </label>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-900 font-medium">
                        {booking.freelancerId?.fullName || booking.salonId?.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900">
                          {booking.bookingType === 'urgentBooking' ? 'Urgent Booking' : 'Pre Booking'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${booking.isAtHome ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {booking.isAtHome ? 'At Home' : 'At Salon'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Financial Details</span>
                </h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Base Amount</span>
                      <span className="font-medium">₹{booking.baseAmount}</span>
                    </div>
                    {booking.approvedPrice && booking.approvedPrice !== booking.baseAmount && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Approved Price</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 line-through">₹{booking.baseAmount}</span>
                          <span className="font-bold text-green-600">₹{booking.approvedPrice}</span>
                          {booking.approvedPrice > booking.baseAmount ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    )}
                    {booking.commissionAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Commission</span>
                        <span className="font-medium text-red-600">-₹{booking.commissionAmount}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total Amount</span>
                        <span className="text-xl font-bold text-gray-900">₹{booking.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Payment Status</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-gray-700">Payment Type</span>
                      <span className="font-medium">{booking.paymentType || 'Cash'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
              <p className="text-gray-900">{formatDate(booking.createdAt)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
              <p className="text-gray-900">{formatDate(booking.updatedAt)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <p className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(booking, null, 2));
                toast.success('Booking details copied to clipboard!');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
            >
              Copy Details
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Approve Booking Modal Component (Updated)
const ApproveBookingModal = ({ booking, onApprove, onReject, onClose }) => {
  const [approvedPrice, setApprovedPrice] = useState(booking.totalAmount || booking.baseAmount);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [isSalonOwner, setIsSalonOwner] = useState(false);

  useEffect(() => {
    // Check if current user is freelancer or salon owner
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setIsFreelancer(payload.role === 'freelancer');
      setIsSalonOwner(payload.role === 'admin');
    }
  }, []);

  const canIncreasePrice = isFreelancer;
  const canChangePrice = isFreelancer || isSalonOwner;
  const originalPrice = booking.baseAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Approve Booking</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                Booking #{booking._id.slice(-8).toUpperCase()}
              </p>
              <p className="text-lg font-bold text-gray-900 mt-1">₹{originalPrice}</p>
              <p className="text-sm text-gray-600 mt-1">
                {booking.services?.length || 0} service{booking.services?.length !== 1 ? 's' : ''}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                {isFreelancer ? "Freelancer" : isSalonOwner ? "Salon Owner" : "Admin"}
              </div>
            </div>

            {/* Only show price field if user can change price */}
            {canChangePrice && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approve Price {!canIncreasePrice && '(Cannot increase price)'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={approvedPrice}
                    onChange={(e) => setApprovedPrice(parseInt(e.target.value) || 0)}
                    min={canIncreasePrice ? 0 : originalPrice}
                    max={originalPrice * 2}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                {canIncreasePrice && approvedPrice > originalPrice && (
                  <p className="text-xs text-green-600 mt-1">
                    ⚠️ You're increasing price by ₹{approvedPrice - originalPrice}
                  </p>
                )}
                {!canIncreasePrice && isSalonOwner && approvedPrice < originalPrice && (
                  <p className="text-xs text-green-600 mt-1">
                    ✅ You can reduce price as salon owner
                  </p>
                )}
                {!canIncreasePrice && isSalonOwner && approvedPrice > originalPrice && (
                  <p className="text-xs text-red-600 mt-1">
                    ❌ Salon owners cannot increase price
                  </p>
                )}
              </div>
            )}

            {/* Show current price if user cannot change it */}
            {!canChangePrice && (
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Price (Cannot be changed)
                </label>
                <div className="text-lg font-bold text-gray-900">
                  ₹{originalPrice}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Only freelancers and salon owners can modify the booking price
                </p>
              </div>
            )}

            {approvedPrice !== originalPrice && canChangePrice && (
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Original Price</span>
                  <span className="text-gray-700 line-through">₹{originalPrice}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-medium text-gray-900">Final Price</span>
                  <span className="font-bold text-green-600">₹{approvedPrice}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-700">Difference</span>
                  <span className={`font-medium ${approvedPrice > originalPrice ? 'text-green-600' : 'text-red-600'}`}>
                    {approvedPrice > originalPrice ? '+' : ''}{approvedPrice - originalPrice}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                onReject(booking._id);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Reject
            </button>
            <button
              onClick={() => {
                onApprove(booking._id, approvedPrice);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              {canChangePrice ? `Approve at ₹${approvedPrice}` : 'Approve Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cancel Booking Modal Component (New)
const CancelBookingModal = ({
  booking,
  onCancel,
  onClose,
  cancelReason,
  setCancelReason
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Cancel Booking</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Cancel Booking #{booking._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-red-600 mt-1">
                    Amount: <span className="font-semibold">₹{booking.totalAmount}</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    This action cannot be undone. The booking will be marked as cancelled.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Reason *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter reason for cancellation..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This reason will be recorded with the booking.
              </p>
            </div>

            {/* Common cancellation reasons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCancelReason("Customer unavailable")}
                className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Customer unavailable
              </button>
              <button
                onClick={() => setCancelReason("Schedule conflict")}
                className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Schedule conflict
              </button>
              <button
                onClick={() => setCancelReason("Service not available")}
                className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Service not available
              </button>
              <button
                onClick={() => setCancelReason("Other reason")}
                className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Other reason
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Go Back
            </button>
            <button
              onClick={onCancel}
              disabled={!cancelReason.trim()}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${!cancelReason.trim() ? 'bg-red-300 text-white cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsList;