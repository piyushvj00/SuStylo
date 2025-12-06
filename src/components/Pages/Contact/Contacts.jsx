// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../../config/AxiosInstance'; // Adjust the path
// import { Eye, Trash2, Loader } from 'lucide-react';

// const Contact = () => {
//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [viewModal, setViewModal] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(null);

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const fetchContacts = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get('/contact/all');
//       if (response.data.success) {
//         setContacts(response.data.contacts);
//       }
//     } catch (error) {
//       console.error('Error fetching contacts:', error);
//       alert('Failed to fetch contacts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const viewContact = async (id) => {
//     try {
//       const response = await axiosInstance.get(`/contact/${id}`);
//       if (response.data.success) {
//         setSelectedContact(response.data.contact);
//         setViewModal(true);
//       }
//     } catch (error) {
//       console.error('Error fetching contact details:', error);
//       alert('Failed to fetch contact details');
//     }
//   };

//   const deleteContact = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this contact?')) {
//       return;
//     }

//     try {
//       setDeleteLoading(id);
//       await axiosInstance.delete(`/contact/${id}`);
//       // Remove the deleted contact from state
//       setContacts(prev => prev.filter(contact => contact._id !== id));
//       alert('Contact deleted successfully');
//     } catch (error) {
//       console.error('Error deleting contact:', error);
//       if (error.response?.data?.message) {
//         alert(error.response.data.message);
//       } else {
//         alert('Failed to delete contact');
//       }
//     } finally {
//       setDeleteLoading(null);
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

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex items-center space-x-2">
//           <Loader className="h-6 w-6 animate-spin text-green-600" />
//           <span className="text-gray-600">Loading contacts...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
//           <p className="text-gray-600 mt-2">
//             Total {contacts.length} contact message{contacts.length !== 1 ? 's' : ''}
//           </p>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Title
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Role
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {contacts.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
//                       No contact messages found
//                     </td>
//                   </tr>
//                 ) : (
//                   contacts.map((contact) => (
//                     <tr key={contact._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
//                           {contact.title}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{contact.mail}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           contact.role === 'admin' 
//                             ? 'bg-purple-100 text-purple-800'
//                             : 'bg-blue-100 text-blue-800'
//                         }`}>
//                           {contact.role}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(contact.createdAt)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => viewContact(contact._id)}
//                             className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
//                           >
//                             <Eye className="h-4 w-4" />
//                             <span>View</span>
//                           </button>
//                           <button
//                             onClick={() => deleteContact(contact._id)}
//                             disabled={deleteLoading === contact._id}
//                             className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
//                           >
//                             {deleteLoading === contact._id ? (
//                               <Loader className="h-4 w-4 animate-spin" />
//                             ) : (
//                               <Trash2 className="h-4 w-4" />
//                             )}
//                             <span>Delete</span>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* View Modal */}
//         {viewModal && selectedContact && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold text-gray-900">Contact Details</h2>
//                   <button
//                     onClick={() => setViewModal(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Title
//                     </label>
//                     <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
//                       {selectedContact.title}
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Description
//                     </label>
//                     <p className="text-gray-900 bg-gray-50 p-2 rounded-md whitespace-pre-wrap">
//                       {selectedContact.description}
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Email
//                     </label>
//                     <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
//                       {selectedContact.mail}
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Role
//                     </label>
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       selectedContact.role === 'admin' 
//                         ? 'bg-purple-100 text-purple-800'
//                         : 'bg-blue-100 text-blue-800'
//                     }`}>
//                       {selectedContact.role}
//                     </span>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Created At
//                     </label>
//                     <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
//                       {formatDate(selectedContact.createdAt)}
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Last Updated
//                     </label>
//                     <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
//                       {formatDate(selectedContact.updatedAt)}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-6 flex justify-end">
//                   <button
//                     onClick={() => setViewModal(false)}
//                     className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Contact;




import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { Eye, Trash2, Loader, Mail, User, Calendar, Tag, MessageSquare, Users } from 'lucide-react';

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/contact/all');
      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      alert('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const viewContact = async (id) => {
    try {
      const response = await axiosInstance.get(`/contact/${id}`);
      if (response.data.success) {
        setSelectedContact(response.data.contact);
        setViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching contact details:', error);
      alert('Failed to fetch contact details');
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await axiosInstance.delete(`/contact/${id}`);
      // Remove the deleted contact from state
      setContacts(prev => prev.filter(contact => contact._id !== id));
      alert('Contact deleted successfully');
    } catch (error) {
      console.error('Error deleting contact:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to delete contact');
      }
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'vendor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return '👨‍💼';
      case 'vendor':
        return '🏪';
      case 'user':
        return '👤';
      default:
        return '📧';
    }
  };

  // Get display role for table view
  const getDisplayRole = (contact) => {
    if (contact.from && contact.to) {
      return `${contact.from.role} → ${contact.to.role}`;
    }
    return contact.role || 'user';
  };

  // Get display email for table view
  const getDisplayEmail = (contact) => {
    if (contact.from && contact.mail) {
      return `${contact.from.email} → ${contact.to?.email || contact.mail}`;
    }
    return contact.mail;
  };

  // Filter contacts based on search and role filter
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.mail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.from?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.to?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || 
      contact.role === filterRole ||
      contact.from?.role === filterRole ||
      contact.to?.role === filterRole;
    
    return matchesSearch && matchesRole;
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
            <h3 className="text-lg font-semibold text-gray-800">Loading Contacts</h3>
            <p className="text-gray-600 mt-1">Fetching your messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Contact Messages
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Total {contacts.length} contact message{contacts.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{contacts.length}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">
                  {contacts.filter(c => c.from?.role === 'admin' || c.to?.role === 'admin' || c.role === 'admin').length}
                </div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">
                  {contacts.filter(c => c.from?.role === 'vendor' || c.to?.role === 'vendor' || c.role === 'vendor').length}
                </div>
                <div className="text-xs text-gray-500">Vendor</div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-green-600">
                  {contacts.filter(c => c.from?.role === 'user' || c.to?.role === 'user' || c.role === 'user').length}
                </div>
                <div className="text-xs text-gray-500">User</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search  */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title, email, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Role Filter */}
            <div className="lg:w-48">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="vendor">Vendor</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4" />
                      <span>Title & Description</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Roles</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="text-6xl">📭</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">No messages found</h3>
                          <p className="text-gray-600 mt-1">
                            {searchTerm || filterRole !== 'all' 
                              ? 'Try adjusting your search or filter criteria' 
                              : 'No contact messages have been received yet'
                            }
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr 
                      key={contact._id} 
                      className="hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
                      onClick={() => viewContact(contact._id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform"></div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                              {contact.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {contact.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <div className="text-sm text-gray-900">
                            {getDisplayEmail(contact)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          {contact.from && contact.to ? (
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(contact.from.role)}`}>
                                {contact.from.role}
                              </span>
                              <span className="text-gray-400 text-xs">→</span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(contact.to.role)}`}>
                                {contact.to.role}
                              </span>
                            </div>
                          ) : (
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getRoleColor(contact.role)}`}>
                              {contact.role || 'user'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {formatDate(contact.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => viewContact(contact._id)}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:scale-105"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="text-sm font-medium">View</span>
                          </button>
                          <button
                            onClick={() => deleteContact(contact._id)}
                            disabled={deleteLoading === contact._id}
                            className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleteLoading === contact._id ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="text-sm font-medium">Delete</span>
                          </button>
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
        {filteredContacts.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            Showing {filteredContacts.length} of {contacts.length} messages
            {(searchTerm || filterRole !== 'all') && (
              <span className="ml-2">
                • <button 
                    onClick={() => { setSearchTerm(''); setFilterRole('all'); }} 
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear filters
                  </button>
              </span>
            )}
          </div>
        )}

        {/* View Modal */}
        {viewModal && selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-scale-in">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
                    <p className="text-gray-600 mt-1">
                      {selectedContact.from ? `Message from ${selectedContact.from.email}` : `Message from ${selectedContact.mail}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  {/* Title */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                      <Tag className="h-4 w-4" />
                      <span>Title</span>
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedContact.title}
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Description</span>
                    </label>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {selectedContact.description}
                      </p>
                    </div>
                  </div>

                  {/* Participants Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Message Participants</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Sender */}
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <label className="block text-sm font-semibold text-blue-700 mb-2">
                          From
                        </label>
                        {selectedContact.from ? (
                          <>
                            <p className="text-blue-900 font-medium">{selectedContact.from.email}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-lg">{getRoleIcon(selectedContact.from.role)}</span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(selectedContact.from.role)}`}>
                                {selectedContact.from.role}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-blue-900 font-medium">{selectedContact.mail}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-lg">{getRoleIcon(selectedContact.role)}</span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(selectedContact.role)}`}>
                                {selectedContact.role || 'user'}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Receiver */}
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <label className="block text-sm font-semibold text-green-700 mb-2">
                          To
                        </label>
                        {selectedContact.to ? (
                          <>
                            <p className="text-green-900 font-medium">{selectedContact.to.email}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-lg">{getRoleIcon(selectedContact.to.role)}</span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(selectedContact.to.role)}`}>
                                {selectedContact.to.role}
                              </span>
                            </div>
                          </>
                        ) : (
                          <p className="text-green-900 font-medium">System / General Contact</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Created At</span>
                      </label>
                      <p className="text-gray-900">{formatDate(selectedContact.createdAt)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Updated
                      </label>
                      <p className="text-gray-900">{formatDate(selectedContact.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setViewModal(false)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200 font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;