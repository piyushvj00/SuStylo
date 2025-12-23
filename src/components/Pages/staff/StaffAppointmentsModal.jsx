import { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { Loader, Calendar, Clock, User, CheckCircle, Clock as ClockIcon, XCircle, AlertCircle, Search, RefreshCw } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StaffAppointmentsHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [staffId, setStaffId] = useState(null);

  // Get token from localStorage and extract staff ID
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode JWT token to get staff ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.id) {
          setStaffId(payload.id);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        toast.error('Failed to get user information', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  }, []);

  // Fetch appointments when staffId is available
  useEffect(() => {
    if (staffId) {
      fetchStaffAppointments();
    }
  }, [staffId]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, appointments]);

  const fetchStaffAppointments = async () => {
    if (!staffId) {
      toast.error('Unable to identify staff member', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/appointment/staff/${staffId}`);
      
      if (response.data.success) {
        setAppointments(response.data.appointments || []);
        toast.success('Appointments history loaded!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load appointments history.';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...appointments];

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(appointment =>
        appointment.bookingId?.toLowerCase().includes(term) ||
        appointment.userId?.toLowerCase().includes(term) ||
        appointment.notes?.toLowerCase().includes(term) ||
        appointment.schedule?.slot?.toLowerCase().includes(term)
      );
    }

    setFilteredAppointments(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inProgress':
        return <ClockIcon className="h-4 w-4 text-blue-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'assigned':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'inProgress':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  if (!staffId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="flex flex-col items-center justify-center py-12">
          <User className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Staff Information Required</h2>
          <p className="text-gray-500 text-center mb-6">
            Unable to identify staff member. Please ensure you are logged in.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Appointments History</h1>
            <p className="text-gray-600 mt-1">View all your past and upcoming appointments</p>
            <div className="mt-2 text-sm text-gray-500">
              Staff ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{staffId.slice(-8)}</span>
            </div>
          </div>
          <button
            onClick={fetchStaffAppointments}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Search Appointments
              </div>
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by booking ID, customer ID, notes..."
            />
          </div>

          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="assigned">Assigned</option>
              <option value="confirmed">Confirmed</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredAppointments.length} of {appointments.length} appointments
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Appointments Found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter 
                  ? 'No appointments match your filters' 
                  : appointments.length === 0
                  ? 'No appointments found for your account'
                  : 'Try clearing your filters to see all appointments'}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Slot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.bookingId 
                          ? `#${appointment.bookingId.slice(-8)}`
                          : `#${appointment._id?.slice(-8) || 'N/A'}`
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <div className="text-sm text-gray-900">
                          {formatDate(appointment.schedule?.date || appointment.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <div className="text-sm text-gray-900">
                          {appointment.schedule?.slot || 'N/A'}
                          {appointment.schedule?.chair && (
                            <span className="text-xs text-gray-500 ml-1">(Chair #{appointment.schedule.chair})</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <div className="text-sm text-gray-900 font-mono">
                          {appointment.userId?.slice(-6) || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        <span className="ml-1">{getStatusText(appointment.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(appointment.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total appointments: <span className="font-medium">{appointments.length}</span>
              {statusFilter && (
                <span className="ml-2">
                  • Filtered: <span className="font-medium">{filteredAppointments.length}</span>
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section - Only show if there are notes */}
      {filteredAppointments.some(a => a.notes) && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Recent Appointment Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments
              .filter(a => a.notes)
              .slice(0, 3)
              .map((appointment) => (
                <div key={`note-${appointment._id}`} className="bg-white p-3 rounded border border-blue-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-medium text-blue-700">
                        Booking #{appointment.bookingId?.slice(-6) || appointment._id?.slice(-6)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(appointment.schedule?.date)}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{appointment.notes}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAppointmentsHistory;