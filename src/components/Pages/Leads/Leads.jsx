import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../config/AxiosInstance'; // Assuming axiosInstance is in the same directory

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f9',
    minHeight: '100vh',
  },
  title: {
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  },
  tableContainer: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #eee',
    verticalAlign: 'top',
  },
  tr: {
    ':hover': {
      backgroundColor: '#f1f1f1',
    },
  },
  // Status badges
  statusPending: {
    backgroundColor: '#ffc107',
    color: '#333',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  statusApproved: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  statusRejected: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  // Action buttons
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  approveButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  disabledButton: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
};

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch leads
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/leads/');
      setLeads(response.data.leads || []);
      toast.success(`Successfully loaded ${response.data.leads.length} leads!`);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to fetch leads.');
      toast.error('Failed to load leads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Function to handle lead status change (approve/reject)
  const handleStatusChange = async (leadId, action) => {
    try {
      // Optimistically update the status in the UI
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead._id === leadId ? { ...lead, status: 'processing' } : lead
        )
      );

      const endpoint = `/leads/${leadId}/${action}`;
      const response = await axiosInstance.post(endpoint, {});

      // Update the lead in the state with the final status and response data
      if (response.data.success) {
        toast.success(response.data.message || `Lead ${action}ed successfully!`);
        // Re-fetch the leads to get the most accurate, updated data
        fetchLeads();
      } else {
        throw new Error(response.data.message || `Operation failed for lead ${leadId}`);
      }
    } catch (err) {
      console.error(`Error ${action}ing lead ${leadId}:`, err);
      // Revert status update on failure
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead._id === leadId ? { ...lead, status: leads.find(l => l._id === leadId)?.status || 'pending' } : lead
        )
      );
      toast.error(`Failed to ${action} lead: ${err.message || 'Server error'}`);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return styles.statusApproved;
      case 'rejected':
        return styles.statusRejected;
      case 'pending':
      case 'processing':
      default:
        return styles.statusPending;
    }
  };

  if (loading) return <div style={styles.container}><p style={styles.title}>Loading leads...</p></div>;
  if (error) return <div style={styles.container}><p style={{ ...styles.title, color: 'red' }}>Error: {error}</p></div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💼 Lead Management Dashboard</h2>
      
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Owner/Salon Name</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Contact</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td style={styles.td}>
                  **{lead.ownerName}** <br />
                  <small>
                    {lead.leadType === 'Salon' ? lead.salonName : lead.serviceArea}
                  </small>
                </td>
                <td style={styles.td}>{lead.leadType}</td>
                <td style={styles.td}>
                  {lead.email} <br /> {lead.contact}
                </td>
                <td style={styles.td}>
                  {lead.address?.street}, {lead.address?.city}, {lead.address?.state} - {lead.address?.pinCode}
                </td>
                <td style={styles.td}>
                  <span style={getStatusStyle(lead.status)}>
                    {lead.status.toUpperCase()}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.buttonGroup}>
                    <button
                      style={{
                        ...styles.approveButton,
                        ...(lead.status !== 'pending' && styles.disabledButton),
                      }}
                      onClick={() => handleStatusChange(lead._id, 'approve')}
                      disabled={lead.status !== 'pending'}
                    >
                      Approve
                    </button>
                    <button
                      style={{
                        ...styles.rejectButton,
                        ...(lead.status !== 'pending' && styles.disabledButton),
                      }}
                      onClick={() => handleStatusChange(lead._id, 'reject')}
                      disabled={lead.status !== 'pending'}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default LeadManagement;