import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thTdStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};

const buttonStyle = {
  marginRight: '5px',
  padding: '5px 10px',
  cursor: 'pointer',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const filterContainerStyle = {
  marginBottom: '20px',
  padding: '10px',
  border: '1px solid #eee',
  borderRadius: '5px',
  backgroundColor: '#f9f9f9',
};

const inputStyle = {
  padding: '8px',
  marginRight: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

// Define the shape of a single Salon object for clarity
// Note: We simplify the nested objects for the sake of the table display.
// The filter/display logic should handle the structure from the response.

const SalonsList = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // ----------------------------------------------------
  // 1. API Call to Fetch Salons
  // ----------------------------------------------------

  const fetchSalons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/salons');
      
      if (response.data.success) {
        setSalons(response.data.salons);
        toast.success('Salon list loaded successfully!');
      } else {
        // Handle API success: false response
        throw new Error(response.data.message || 'Failed to fetch salons.');
      }
    } catch (err) {
      console.error('API Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred.';
      setError(errorMessage);
      toast.error(`Error loading salons: ${errorMessage}`);
      setSalons([]); // Clear list on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalons();
  }, [fetchSalons]);

  // ----------------------------------------------------
  // 2. Filtering Logic
  // ----------------------------------------------------

  const filteredSalons = salons.filter(salon => {
    const nameMatch = salon.salonName.toLowerCase().includes(filterName.toLowerCase());
    
    const statusMatch = filterStatus === '' || salon.approvalStatus.toLowerCase() === filterStatus.toLowerCase();

    return nameMatch && statusMatch;
  });

  // ----------------------------------------------------
  // 3. Action Handlers
  // ----------------------------------------------------

  const handleViewDetails = (salonId) => {
    // In a real application, you would navigate to a detailed view:
    // navigate(`/salons/${salonId}`);
    
    // For now, we'll just log the ID and show a temporary toast
    const salon = salons.find(s => s._id === salonId);
    console.log('Viewing details for salon:', salon);
    toast.info(`Viewing details for: ${salon.salonName}`);
  };

  const handleDeleteSalon = async (salonId, salonName) => {
    if (!window.confirm(`Are you sure you want to delete the salon: ${salonName}?`)) {
      return;
    }

    try {
      // NOTE: Assuming your backend has a DELETE endpoint like '/salons/:id'
      // You would need to check your actual API for the correct method and endpoint.
      await axiosInstance.delete(`/salons/${salonId}`); 
      
      toast.success(`Salon "${salonName}" deleted successfully!`);
      // Re-fetch the list to update the UI
      fetchSalons();

    } catch (err) {
      console.error('Delete Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete salon.';
      toast.error(`Error deleting salon: ${errorMessage}`);
    }
  };


  // ----------------------------------------------------
  // 4. Render Logic
  // ----------------------------------------------------

  if (loading) {
    return <div>Loading salons...</div>;
  }

  if (error && filteredSalons.length === 0) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  // Extract unique statuses for the filter dropdown
  const uniqueStatuses = [...new Set(salons.map(s => s.approvalStatus))];

  return (
    <div style={{ padding: '20px' }}>
      <h1>💇‍♀️ Salons List</h1>
      <ToastContainer position="bottom-right" autoClose={5000} />

      {/* Filter Section */}
      <div style={filterContainerStyle}>
        <h3>🔍 Filters</h3>
        
        {/* Filter by Name */}
        <input
          type="text"
          placeholder="Search by Salon Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          style={inputStyle}
        />

        {/* Filter by Status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={inputStyle}
        >
          <option value="">All Statuses</option>
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        
        <button style={buttonStyle} onClick={() => { setFilterName(''); setFilterStatus(''); }}>
          Clear Filters
        </button>
      </div>

      <h2>Total Salons: {filteredSalons.length}</h2>

      {/* Salon Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Name</th>
            <th style={thTdStyle}>City</th>
            <th style={thTdStyle}>Phone</th>
            <th style={thTdStyle}>Rating</th>
            <th style={thTdStyle}>Status</th>
            <th style={thTdStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalons.length > 0 ? (
            filteredSalons.map((salon) => (
              <tr key={salon._id}>
                <td style={thTdStyle}>{salon.salonName}</td>
                <td style={thTdStyle}>{salon.address.city}</td>
                <td style={thTdStyle}>{salon.contact.phone}</td>
                <td style={thTdStyle}>{salon.rating.average} ({salon.rating.count})</td>
                <td style={thTdStyle}>
                  <span style={{ 
                    color: salon.approvalStatus === 'approved' ? 'green' : 'orange', 
                    fontWeight: 'bold' 
                  }}>
                    {salon.approvalStatus.charAt(0).toUpperCase() + salon.approvalStatus.slice(1)}
                  </span>
                </td>
                <td style={thTdStyle}>
                  <button 
                    style={{ ...buttonStyle, backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
                    onClick={() => handleViewDetails(salon._id)}
                  >
                    View Details
                  </button>
                  <button 
                    style={{ ...buttonStyle, backgroundColor: '#f44336', color: 'white', border: 'none' }}
                    onClick={() => handleDeleteSalon(salon._id, salon.salonName)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ ...thTdStyle, textAlign: 'center' }}>
                No salons found matching the criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalonsList;