import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { Eye, Trash2, Loader, Mail, User, Calendar, Phone, MessageSquare, Users, FileText } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/contacts/all');
      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const viewContact = async (id) => {
    try {
      const response = await axiosInstance.get(`/contacts/${id}`);
      if (response.data.success) {
        setSelectedContact(response.data.contact);
        setViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching contact details:', error);
      toast.error('Failed to fetch contact details');
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await axiosInstance.delete(`/contacts/${id}`);
      // Remove the deleted contact from state
      setContacts(prev => prev.filter(contact => contact._id !== id));
      toast.success('Contact deleted successfully!');
    } catch (error) {
      console.error('Error deleting contact:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to delete contact');
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

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.fullName?.toLowerCase().includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.mobile?.includes(searchTerm) ||
      contact.message?.toLowerCase().includes(searchLower)
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
            <h3 className="text-lg font-semibold text-gray-800">Loading Contacts</h3>
            <p className="text-gray-600 mt-1">Fetching your messages...</p>
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
                  Contact Messages
                </h1>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Total {contacts.length} contact message{contacts.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">{contacts.length}</div>
                  <div className="text-xs text-gray-500">Total Messages</div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {new Set(contacts.map(c => c.email)).size}
                  </div>
                  <div className="text-xs text-gray-500">Unique Emails</div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(contacts.map(c => c.mobile)).size}
                  </div>
                  <div className="text-xs text-gray-500">Unique Mobiles</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, mobile, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
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

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Contact Information</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Message</span>
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
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="text-6xl">📭</div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">No messages found</h3>
                            <p className="text-gray-600 mt-1">
                              {searchTerm
                                ? 'No contacts match your search criteria'
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
                        className="hover:bg-gray-50 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform"></div>
                              <div className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                                {contact.fullName}
                              </div>
                            </div>
                            <div className="flex flex-col space-y-1 pl-4">
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-xs">{contact.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Phone className="h-3 w-3" />
                                <span>{contact.mobile}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700 line-clamp-2">
                            {contact.message}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {formatDate(contact.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => viewContact(contact._id)}
                              className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:scale-105"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="hidden sm:inline text-sm font-medium">View</span>
                            </button>
                            <button
                              onClick={() => deleteContact(contact._id)}
                              disabled={deleteLoading === contact._id}
                              className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete"
                            >
                              {deleteLoading === contact._id ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              <span className="hidden sm:inline text-sm font-medium">Delete</span>
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
              {searchTerm && (
                <span className="ml-2">
                  • <button
                    onClick={() => setSearchTerm('')}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear search
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
                      <h2 className="text-2xl font-bold text-gray-900">Contact Message Details</h2>
                      <p className="text-gray-600 mt-1">
                        Received on {formatDate(selectedContact.createdAt)}
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
                    {/* Contact Information */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Contact Information</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-gray-900 font-medium">{selectedContact.fullName}</p>
                          </div>
                        </div>

                        {/* Mobile */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>Mobile Number</span>
                          </label>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-gray-900 font-medium">{selectedContact.mobile}</p>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>Email Address</span>
                          </label>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <a
                              href={`mailto:${selectedContact.email}`}
                              className="text-blue-600 font-medium hover:text-blue-800 hover:underline"
                            >
                              {selectedContact.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Message Content</span>
                      </label>
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {selectedContact.message}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Message Sent</span>
                        </label>
                        <p className="text-gray-900">{formatDate(selectedContact.createdAt)}</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Message ID
                        </label>
                        <p className="text-gray-500 font-mono text-sm truncate">
                          {selectedContact._id}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`
Name: ${selectedContact.fullName}
Email: ${selectedContact.email}
Mobile: ${selectedContact.mobile}
Message: ${selectedContact.message}
Date: ${formatDate(selectedContact.createdAt)}
                        `);
                        toast.success('Contact details copied to clipboard!');
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                    >
                      Copy Details
                    </button>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          const to = selectedContact.email;
                          const subject = encodeURIComponent("Reply to your Contact Message");
                          const body = encodeURIComponent(
                            `Hi ${selectedContact.fullName},\n\n` +
                            `Regarding your message:\n"${selectedContact.message}"\n\n` +
                            `Your reply here...\n\n` +
                            `Best Regards,\nAdmin`
                          );

                          window.open(
                            `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`,
                            "_blank"
                          );
                        }}
                        className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 font-semibold"
                      >
                        Reply via Email
                      </button>
                      <button
                        onClick={() => setViewModal(false)}
                        className="px-5 py-2.5 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200 font-semibold"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add custom styles for animation */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Contact;