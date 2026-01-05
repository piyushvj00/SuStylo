// // components/Pages/Businesses/EditSalon.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axiosInstance from '../../../config/AxiosInstance';
// import {
//   ArrowLeft,
//   Save,
//   Loader,
//   X,
//   Plus,
//   Trash2,
//   Upload,
//   Check,
//   AlertCircle
// } from 'lucide-react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const EditSalon = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [salon, setSalon] = useState({
//     salonName: '',
//     description: '',
//     contact: {
//       phone: '',
//       email: '',
//       website: ''
//     },
//     address: {
//       street: '',
//       area: '',
//       city: '',
//       state: '',
//       pinCode: '',
//       country: 'India'
//     },
//     facilities: [],
//     chairCount: 0,
//     commission: {
//       isCommissionApplicable: true,
//       percentage: 0,
//       flat: 0
//     },
//     approvalStatus: 'approved',
//     isActive: true
//   });
//   const [newFacility, setNewFacility] = useState('');
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     fetchSalonData();
//   }, [id]);

//   const fetchSalonData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/salons/${id}`);
//       if (response.data.success) {
//         const salonData = response.data.salon;
//         setSalon({
//           salonName: salonData.salonName || '',
//           description: salonData.description || '',
//           contact: {
//             phone: salonData.contact?.phone || '',
//             email: salonData.contact?.email || '',
//             website: salonData.contact?.website || ''
//           },
//           address: {
//             street: salonData.address?.street || '',
//             area: salonData.address?.area || '',
//             city: salonData.address?.city || '',
//             state: salonData.address?.state || '',
//             pinCode: salonData.address?.pinCode || '',
//             country: salonData.address?.country || 'India'
//           },
//           facilities: Array.isArray(salonData.facilities) ? salonData.facilities : [],
//           chairCount: salonData.chairCount || 0,
//           commission: {
//             isCommissionApplicable: salonData.commission?.isCommissionApplicable || true,
//             percentage: salonData.commission?.percentage || 0,
//             flat: salonData.commission?.flat || 0
//           },
//           approvalStatus: salonData.approvalStatus || 'approved',
//           isActive: salonData.isActive !== undefined ? salonData.isActive : true
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching salon data:', error);
//       toast.error('Failed to fetch salon data');
//       navigate('/businesses/salons');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!salon.salonName.trim()) {
//       newErrors.salonName = 'Salon name is required';
//     }

//     if (!salon.contact.phone.trim()) {
//       newErrors['contact.phone'] = 'Phone number is required';
//     } else if (!/^\d{10}$/.test(salon.contact.phone)) {
//       newErrors['contact.phone'] = 'Phone number must be 10 digits';
//     }

//     if (!salon.contact.email.trim()) {
//       newErrors['contact.email'] = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(salon.contact.email)) {
//       newErrors['contact.email'] = 'Invalid email address';
//     }

//     if (!salon.address.city.trim()) {
//       newErrors['address.city'] = 'City is required';
//     }

//     if (!salon.address.state.trim()) {
//       newErrors['address.state'] = 'State is required';
//     }

//     if (!salon.address.pinCode.trim()) {
//       newErrors['address.pinCode'] = 'PIN code is required';
//     } else if (!/^\d{6}$/.test(salon.address.pinCode)) {
//       newErrors['address.pinCode'] = 'PIN code must be 6 digits';
//     }

//     if (salon.chairCount < 0) {
//       newErrors.chairCount = 'Chair count cannot be negative';
//     }

//     if (salon.commission.percentage < 0 || salon.commission.percentage > 100) {
//       newErrors['commission.percentage'] = 'Commission percentage must be between 0 and 100';
//     }

//     if (salon.commission.flat < 0) {
//       newErrors['commission.flat'] = 'Flat commission cannot be negative';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
    
// //     if (!validateForm()) {
// //       toast.error('Please fix the errors in the form');
// //       return;
// //     }

// //     try {
// //       setSaving(true);
      
// //       // Prepare form data for multipart/form-data
// //       const formData = new FormData();
// //       Object.keys(salon).forEach(key => {
// //         if (key === 'contact' || key === 'address' || key === 'commission') {
// //           formData.append(key, JSON.stringify(salon[key]));
// //         } else if (key === 'facilities') {
// //           formData.append(key, JSON.stringify(salon[key]));
// //         } else {
// //           formData.append(key, salon[key]);
// //         }
// //       });

// //       const response = await axiosInstance.put(`/salons/${id}`, formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //         },
// //       });

// //       if (response.data.success) {
// //         toast.success('Salon updated successfully!');
// //         navigate(`/businesses/salons/${id}`);
// //       }
// //     } catch (error) {
// //       console.error('Error updating salon:', error);
// //       toast.error(error.response?.data?.message || 'Failed to update salon');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };


// // components/Pages/Businesses/EditSalon.jsx - handleSubmit function ko update karein:

// const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   if (!validateForm()) {
//     toast.error('Please fix the errors in the form');
//     return;
//   }

//   try {
//     setSaving(true);
    
//     // Prepare data properly - don't stringify objects
//     const formData = new FormData();
    
//     // Directly append scalar values
//     formData.append('salonName', salon.salonName);
//     formData.append('description', salon.description);
//     formData.append('chairCount', salon.chairCount.toString());
//     formData.append('approvalStatus', salon.approvalStatus);
//     formData.append('isActive', salon.isActive.toString());
    
//     // Append contact as object (not stringified)
//     formData.append('contact[phone]', salon.contact.phone);
//     formData.append('contact[email]', salon.contact.email);
//     formData.append('contact[website]', salon.contact.website || '');
    
//     // Append address as object (not stringified)
//     formData.append('address[street]', salon.address.street || '');
//     formData.append('address[area]', salon.address.area || '');
//     formData.append('address[city]', salon.address.city || '');
//     formData.append('address[state]', salon.address.state || '');
//     formData.append('address[pinCode]', salon.address.pinCode || '');
//     formData.append('address[country]', salon.address.country || 'India');
    
//     // Append facilities as array
//     salon.facilities.forEach((facility, index) => {
//       formData.append(`facilities[${index}]`, facility);
//     });
    
//     // Append commission data
//     formData.append('commission[isCommissionApplicable]', salon.commission.isCommissionApplicable.toString());
//     formData.append('commission[percentage]', salon.commission.percentage.toString());
//     formData.append('commission[flat]', salon.commission.flat.toString());

//     const response = await axiosInstance.put(`/salons/${id}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     if (response.data.success) {
//       toast.success('Salon updated successfully!');
//       navigate(`/businesses/salons/${id}`);
//     }
//   } catch (error) {
//     console.error('Error updating salon:', error);
//     toast.error(error.response?.data?.message || 'Failed to update salon');
//   } finally {
//     setSaving(false);
//   }
// };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setSalon(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: type === 'checkbox' ? checked : value
//         }
//       }));
//     } else {
//       setSalon(prev => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value
//       }));
//     }

//     // Clear error when field is edited
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const addFacility = () => {
//     if (newFacility.trim() && !salon.facilities.includes(newFacility.trim())) {
//       setSalon(prev => ({
//         ...prev,
//         facilities: [...prev.facilities, newFacility.trim()]
//       }));
//       setNewFacility('');
//     }
//   };

//   const removeFacility = (index) => {
//     setSalon(prev => ({
//       ...prev,
//       facilities: prev.facilities.filter((_, i) => i !== index)
//     }));
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <Loader className="h-12 w-12 animate-spin text-purple-600 mx-auto" />
//           <p className="mt-4 text-gray-600">Loading salon data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ToastContainer />
      
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         {/* Header */}
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <button
//                 onClick={() => navigate(-1)}
//                 className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </button>
//               <h1 className="text-2xl font-bold text-gray-900">Edit Salon</h1>
//               <p className="text-gray-600">Update salon information</p>
//             </div>
//             <button
//               onClick={handleSubmit}
//               disabled={saving}
//               className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {saving ? (
//                 <>
//                   <Loader className="h-4 w-4 mr-2 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save className="h-4 w-4 mr-2" />
//                   Save Changes
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Form */}
//         <div className="max-w-4xl mx-auto px-4 pb-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Basic Information */}
//             <div className="bg-white rounded-2xl shadow-sm p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Salon Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="salonName"
//                     value={salon.salonName}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.salonName ? 'border-red-300' : 'border-gray-300'}`}
//                   />
//                   {errors.salonName && (
//                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                       <AlertCircle className="h-3 w-3 mr-1" />
//                       {errors.salonName}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Chair Count
//                   </label>
//                   <input
//                     type="number"
//                     name="chairCount"
//                     value={salon.chairCount}
//                     onChange={handleChange}
//                     min="0"
//                     className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.chairCount ? 'border-red-300' : 'border-gray-300'}`}
//                   />
//                   {errors.chairCount && (
//                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                       <AlertCircle className="h-3 w-3 mr-1" />
//                       {errors.chairCount}
//                     </p>
//                   )}
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     name="description"
//                     value={salon.description}
//                     onChange={handleChange}
//                     rows="3"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Contact Information */}
//             <div className="bg-white rounded-2xl shadow-sm p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     name="contact.phone"
//                     value={salon.contact.phone}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors['contact.phone'] ? 'border-red-300' : 'border-gray-300'}`}
//                   />
//                   {errors['contact.phone'] && (
//                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                       <AlertCircle className="h-3 w-3 mr-1" />
//                       {errors['contact.phone']}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     name="contact.email"
//                     value={salon.contact.email}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors['contact.email'] ? 'border-red-300' : 'border-gray-300'}`}
//                   />
//                   {errors['contact.email'] && (
//                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                       <AlertCircle className="h-3 w-3 mr-1" />
//                       {errors['contact.email']}
//                     </p>
//                   )}
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Website
//                   </label>
//                   <input
//                     type="url"
//                     name="contact.website"
//                     value={salon.contact.website}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     placeholder="https://example.com"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Address Information */}
//             <div className="bg-white rounded-2xl shadow-sm p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Street
//                   </label>
//                   <input
//                     type="text"
//                     name="address.street"
//                     value={salon.address.street}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Area
//                   </label>
//                   <input
//                     type="text"
//                     name="address.area"
//                     value={salon.address.area}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     City *
//                   </label>
//                   <input
//                     type="text"
//                     name="address.city"
//                     value={salon.address.city}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors['address.city'] ? 'border-red-300' : 'border-gray-300'}`}
//                   />
//                   {errors['address.city'] && (
//                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                       <AlertCircle className="h-3 w-3 mr-1" />
//                       {errors['address.city']}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     State *
//                   </label>
//                   <input
//                     type="text"
//                     name="address.state"
//                     value={salon.address.state}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors['address.state'] ? 'border-red-300' : 'border-gray-300'}`}
//                   />
//                   {errors['address.state'] && (
//                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                       <AlertCircle className="h-3 w-3 mr-1" />
//                       {errors['address.state']}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     PIN Code *
//                   </label>
//                   <input
//                     type="text"
//                     name="address.pinCode"
//                     value={salon.address.pinCode}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors['address.pinCode'] ? 'border-red-300' : 'border-gray-300'}`}
//                   />
//                   {errors['address.pinCode'] && (
//                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                       <AlertCircle className="h-3 w-3 mr-1" />
//                       {errors['address.pinCode']}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Country
//                   </label>
//                   <input
//                     type="text"
//                     name="address.country"
//                     value={salon.address.country}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Facilities */}
//             <div className="bg-white rounded-2xl shadow-sm p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Facilities</h2>
              
//               <div className="mb-4">
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={newFacility}
//                     onChange={(e) => setNewFacility(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
//                     placeholder="Add a facility (e.g., AC, WiFi, Parking)"
//                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                   <button
//                     type="button"
//                     onClick={addFacility}
//                     className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
//                   >
//                     <Plus className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>

//               {salon.facilities.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {salon.facilities.map((facility, index) => (
//                     <div
//                       key={index}
//                       className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-blue-700"
//                     >
//                       {facility}
//                       <button
//                         type="button"
//                         onClick={() => removeFacility(index)}
//                         className="ml-2 text-blue-500 hover:text-blue-700"
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500">No facilities added</p>
//               )}
//             </div>

//             {/* Commission Settings */}
//             <div className="bg-white rounded-2xl shadow-sm p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission Settings</h2>
              
//               <div className="space-y-4">
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="commission.isCommissionApplicable"
//                     checked={salon.commission.isCommissionApplicable}
//                     onChange={handleChange}
//                     id="commissionApplicable"
//                     className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
//                   />
//                   <label htmlFor="commissionApplicable" className="ml-2 text-sm text-gray-700">
//                     Commission Applicable
//                   </label>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Commission Percentage
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="number"
//                         name="commission.percentage"
//                         value={salon.commission.percentage}
//                         onChange={handleChange}
//                         min="0"
//                         max="100"
//                         step="0.01"
//                         className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors['commission.percentage'] ? 'border-red-300' : 'border-gray-300'}`}
//                       />
//                       <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                         <span className="text-gray-500">%</span>
//                       </div>
//                     </div>
//                     {errors['commission.percentage'] && (
//                       <p className="mt-1 text-sm text-red-600 flex items-center">
//                         <AlertCircle className="h-3 w-3 mr-1" />
//                         {errors['commission.percentage']}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Flat Commission (₹)
//                     </label>
//                     <input
//                       type="number"
//                       name="commission.flat"
//                       value={salon.commission.flat}
//                       onChange={handleChange}
//                       min="0"
//                       step="0.01"
//                       className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors['commission.flat'] ? 'border-red-300' : 'border-gray-300'}`}
//                     />
//                     {errors['commission.flat'] && (
//                       <p className="mt-1 text-sm text-red-600 flex items-center">
//                         <AlertCircle className="h-3 w-3 mr-1" />
//                         {errors['commission.flat']}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Status Settings */}
//             <div className="bg-white rounded-2xl shadow-sm p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Settings</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Approval Status
//                   </label>
//                   <select
//                     name="approvalStatus"
//                     value={salon.approvalStatus}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   >
//                     <option value="approved">Approved</option>
//                     <option value="pending">Pending</option>
//                     <option value="rejected">Rejected</option>
//                   </select>
//                 </div>

//                 <div>
//                   <div className="flex items-center h-12">
//                     <input
//                       type="checkbox"
//                       name="isActive"
//                       checked={salon.isActive}
//                       onChange={handleChange}
//                       id="isActive"
//                       className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
//                     />
//                     <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
//                       Active Salon
//                     </label>
//                   </div>
//                   <p className="text-sm text-gray-500 mt-1">
//                     When inactive, the salon won't be visible to customers
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Form Actions */}
//             <div className="flex justify-end space-x-4">
//               <button
//                 type="button"
//                 onClick={() => navigate(-1)}
//                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//               >
//                 {saving ? (
//                   <>
//                     <Loader className="h-4 w-4 mr-2 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="h-4 w-4 mr-2" />
//                     Save Changes
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EditSalon;



//===================================================================================


// components/Pages/Businesses/EditSalon.jsx
import React, { useState, useEffect, useCallback } from 'react';
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
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditSalon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [salon, setSalon] = useState({
    salonName: '',
    description: '',
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
    chairCount: 0,
    commission: {
      isCommissionApplicable: true,
      percentage: 0,
      flat: 0
    },
    approvalStatus: 'approved',
    isActive: true,
    photos: [],
    agreementDocs: []
  });
  const [newFacility, setNewFacility] = useState('');
  const [errors, setErrors] = useState({});
  const [photoFiles, setPhotoFiles] = useState([]);
  // const [docFiles, setDocFiles] = useState([]);
  const [uploading, setUploading] = useState(false);



 const fetchSalonData = useCallback(async () => {
  try {
    setLoading(true);
    const response = await axiosInstance.get(`/salons/${id}`);
    if (response.data.success) {
      const salonData = response.data.salon;
      setSalon({
        salonName: salonData.salonName || '',
        description: salonData.description || '',
        contact: {
          phone: salonData.contact?.phone || '',
          email: salonData.contact?.email || '',
          website: salonData.contact?.website || ''
        },
        address: {
          street: salonData.address?.street || '',
          area: salonData.address?.area || '',
          city: salonData.address?.city || '',
          state: salonData.address?.state || '',
          pinCode: salonData.address?.pinCode || '',
          country: salonData.address?.country || 'India'
        },
        facilities: Array.isArray(salonData.facilities) ? salonData.facilities : [],
        chairCount: salonData.chairCount || 0,
        commission: {
          isCommissionApplicable: salonData.commission?.isCommissionApplicable || true,
          percentage: salonData.commission?.percentage || 0,
          flat: salonData.commission?.flat || 0
        },
        approvalStatus: salonData.approvalStatus || 'approved',
        isActive: salonData.isActive !== undefined ? salonData.isActive : true,
        photos: Array.isArray(salonData.photos) ? salonData.photos : [],
        agreementDocs: Array.isArray(salonData.agreementDocs) ? salonData.agreementDocs : []
      });
    }
  } catch (error) {
    console.error('Error fetching salon data:', error);
    toast.error('Failed to fetch salon data');
    navigate('/businesses/salons');
  } finally {
    setLoading(false);
  }
}, [id, navigate]);


useEffect(() => {
  fetchSalonData();
}, [fetchSalonData]);


  const validateForm = () => {
    const newErrors = {};

    if (!salon.salonName.trim()) {
      newErrors.salonName = 'Salon name is required';
    }

    if (!salon.contact.phone.trim()) {
      newErrors['contact.phone'] = 'Phone number is required';
    } else if (!/^\d{10}$/.test(salon.contact.phone)) {
      newErrors['contact.phone'] = 'Phone number must be 10 digits';
    }

    if (!salon.contact.email.trim()) {
      newErrors['contact.email'] = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(salon.contact.email)) {
      newErrors['contact.email'] = 'Invalid email address';
    }

    if (!salon.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }

    if (!salon.address.state.trim()) {
      newErrors['address.state'] = 'State is required';
    }

    if (!salon.address.pinCode.trim()) {
      newErrors['address.pinCode'] = 'PIN code is required';
    } else if (!/^\d{6}$/.test(salon.address.pinCode)) {
      newErrors['address.pinCode'] = 'PIN code must be 6 digits';
    }

    if (salon.chairCount < 0) {
      newErrors.chairCount = 'Chair count cannot be negative';
    }

    if (salon.commission.percentage < 0 || salon.commission.percentage > 100) {
      newErrors['commission.percentage'] = 'Commission percentage must be between 0 and 100';
    }

    if (salon.commission.flat < 0) {
      newErrors['commission.flat'] = 'Flat commission cannot be negative';
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
      
      // First, handle photo uploads if any
      // let updatedPhotos = salon.photos;
      // if (photoFiles.length > 0) {
      //   const photoFormData = new FormData();
      //   photoFiles.forEach(file => {
      //     photoFormData.append('photos', file);
      //   });

      //   const photoResponse = await axiosInstance.put(`/salons/${id}`, photoFormData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   });

      //   if (photoResponse.data.success) {
      //     updatedPhotos = photoResponse.data.salon.photos;
      //   }
      // }

      // Now update other salon data
      const formData = new FormData();
      
      // Append basic info
      formData.append('salonName', salon.salonName);
      formData.append('description', salon.description);
      formData.append('chairCount', salon.chairCount.toString());
      formData.append('approvalStatus', salon.approvalStatus);
      formData.append('isActive', salon.isActive.toString());
      
      // Append contact
      formData.append('contact[phone]', salon.contact.phone);
      formData.append('contact[email]', salon.contact.email);
      formData.append('contact[website]', salon.contact.website || '');
      
      // Append address
      formData.append('address[street]', salon.address.street || '');
      formData.append('address[area]', salon.address.area || '');
      formData.append('address[city]', salon.address.city || '');
      formData.append('address[state]', salon.address.state || '');
      formData.append('address[pinCode]', salon.address.pinCode || '');
      formData.append('address[country]', salon.address.country || 'India');
      
      // Append facilities
      salon.facilities.forEach((facility, index) => {
        formData.append(`facilities[${index}]`, facility);
      });
      
      // Append commission
      formData.append('commission[isCommissionApplicable]', salon.commission.isCommissionApplicable.toString());
      formData.append('commission[percentage]', salon.commission.percentage.toString());
      formData.append('commission[flat]', salon.commission.flat.toString());

      const response = await axiosInstance.put(`/salons/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Salon updated successfully!');
        navigate(`/businesses/salons/${id}`);
      }
    } catch (error) {
      console.error('Error updating salon:', error);
      toast.error(error.response?.data?.message || 'Failed to update salon');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSalon(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setSalon(prev => ({
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
    if (newFacility.trim() && !salon.facilities.includes(newFacility.trim())) {
      setSalon(prev => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()]
      }));
      setNewFacility('');
    }
  };

  const removeFacility = (index) => {
    setSalon(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index)
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotoFiles(prev => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = async (photoUrl) => {
    try {
      setUploading(true);
      // You need to implement an API to remove photos
      // For now, we'll just remove from local state
      setSalon(prev => ({
        ...prev,
        photos: prev.photos.filter(photo => photo !== photoUrl)
      }));
      toast.success('Photo removed');
    } catch (error) {
      console.error('Error removing photo:', error);
      toast.error('Failed to remove photo');
    } finally {
      setUploading(false);
    }
  };

  // const handleDocUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   setDocFiles(prev => [...prev, ...files]);
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading salon data...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Salon</h1>
              <p className="text-gray-600">Update salon information</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Salon Name *
                  </label>
                  <input
                    type="text"
                    name="salonName"
                    value={salon.salonName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.salonName ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.salonName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.salonName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chair Count
                  </label>
                  <input
                    type="number"
                    name="chairCount"
                    value={salon.chairCount}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.chairCount ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.chairCount && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.chairCount}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={salon.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Salon Photos</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add New Photos
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1">
                    <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors cursor-pointer text-center">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload photos</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Selected Photos Preview */}
              {photoFiles.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-3">New Photos to Upload</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {photoFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Photos */}
              {salon.photos.length > 0 && (
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">Current Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {salon.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Salon photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(photo)}
                          disabled={uploading}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="contact.phone"
                    value={salon.contact.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors['contact.phone'] ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors['contact.phone'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors['contact.phone']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="contact.email"
                    value={salon.contact.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors['contact.email'] ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors['contact.email'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors['contact.email']}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="contact.website"
                    value={salon.contact.website}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    value={salon.address.street}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area
                  </label>
                  <input
                    type="text"
                    name="address.area"
                    value={salon.address.area}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={salon.address.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors['address.city'] ? 'border-red-300' : 'border-gray-300'}`}
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
                    value={salon.address.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors['address.state'] ? 'border-red-300' : 'border-gray-300'}`}
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
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="address.pinCode"
                    value={salon.address.pinCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors['address.pinCode'] ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors['address.pinCode'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors['address.pinCode']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={salon.address.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Facilities</h2>
              
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                    placeholder="Add a facility (e.g., AC, WiFi, Parking)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addFacility}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {salon.facilities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {salon.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-blue-700"
                    >
                      {facility}
                      <button
                        type="button"
                        onClick={() => removeFacility(index)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
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
                    checked={salon.commission.isCommissionApplicable}
                    onChange={handleChange}
                    id="commissionApplicable"
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="commissionApplicable" className="ml-2 text-sm text-gray-700">
                    Commission Applicable
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Percentage
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="commission.percentage"
                        value={salon.commission.percentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.01"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors['commission.percentage'] ? 'border-red-300' : 'border-gray-300'}`}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Flat Commission (₹)
                    </label>
                    <input
                      type="number"
                      name="commission.flat"
                      value={salon.commission.flat}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors['commission.flat'] ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {errors['commission.flat'] && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors['commission.flat']}
                      </p>
                    )}
                  </div>
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
                    value={salon.approvalStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      checked={salon.isActive}
                      onChange={handleChange}
                      id="isActive"
                      className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active Salon
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    When inactive, the salon won't be visible to customers
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
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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

export default EditSalon;