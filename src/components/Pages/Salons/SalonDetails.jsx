import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance'; // Adjust the path as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Salon ID is hardcoded as per the cURL command in the prompt
const SALON_ID = '68c51e3dd1043548a3fa9910';

const containerStyle = {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif'
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
    marginBottom: '20px'
};

const titleStyle = {
    color: '#333'
};

const buttonStyle = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s'
};

const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white',
};

const saveButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    color: 'white',
    marginRight: '10px'
};

const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: 'white'
};

const sectionStyle = {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #f0f0f0',
    borderRadius: '6px',
    backgroundColor: '#f9f9f9'
};

const sectionTitleStyle = {
    marginTop: '0',
    marginBottom: '10px',
    color: '#555',
    borderBottom: '1px dotted #ccc',
    paddingBottom: '5px'
};

const detailRowStyle = {
    display: 'flex',
    marginBottom: '8px'
};

const labelStyle = {
    fontWeight: 'bold',
    minWidth: '150px',
    color: '#333'
};

const valueStyle = {
    flexGrow: '1'
};

const inputStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: 'calc(100% - 10px)',
    boxSizing: 'border-box'
};

const errorTextStyle = {
    color: 'red',
    fontSize: '0.9em'
}

const SalonDetail = () => {
    const [salon, setSalon] = useState(null);
    const [formData, setFormData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    // --- API Calls ---

    const fetchSalonData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/salons/${SALON_ID}`);
            if (response.data.success) {
                setSalon(response.data.salon);
                // Initialize formData with current salon details
                setFormData({
                    salonName: response.data.salon.salonName,
                    description: response.data.salon.description,
                    phone: response.data.salon.contact.phone,
                    email: response.data.salon.contact.email,
                    website: response.data.salon.contact.website,
                });
                toast.success('Salon data loaded successfully!', { position: "bottom-right" });
            } else {
                toast.error('Failed to fetch salon details.', { position: "bottom-right" });
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Could not connect to the API or salon not found.');
            toast.error('Error fetching salon data. Check console for details.', { position: "bottom-right" });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        const errors = validateFormData(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast.error('Please correct the validation errors.', { position: "bottom-right" });
            return;
        }

        try {
            // Note: The structure for a PUT/PATCH request might vary based on your backend.
            // Assuming it expects a flat object for primary updates.
            const updatePayload = {
                salonName: formData.salonName,
                description: formData.description,
                contact: {
                    phone: formData.phone,
                    email: formData.email,
                    website: formData.website,
                },
                // You might need to send other fields like address, commission, etc.
                // For simplicity, only editable fields are included here.
            };

            const response = await axiosInstance.put(`/salons/${SALON_ID}`, updatePayload);

            if (response.data.success) {
                setSalon(response.data.salon);
                setIsEditing(false);
                setFormErrors({});
                toast.success('Salon details updated successfully!', { position: "bottom-right" });
            } else {
                toast.error(`Update failed: ${response.data.message || 'Server error'}`, { position: "bottom-right" });
            }
        } catch (err) {
            console.error('Update error:', err);
            toast.error('Error updating salon data. Check console for details.', { position: "bottom-right" });
        }
    };

    // --- Handlers & Helpers ---

    useEffect(() => {
        fetchSalonData();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
        // Reset form errors when starting edit
        setFormErrors({});
        // Deep copy of data to form for independent editing
        setFormData({
            salonName: salon.salonName,
            description: salon.description,
            phone: salon.contact.phone,
            email: salon.contact.email,
            website: salon.contact.website,
        });
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setFormErrors({});
        // Revert form data back to the last saved state
        if (salon) {
             setFormData({
                salonName: salon.salonName,
                description: salon.description,
                phone: salon.contact.phone,
                email: salon.contact.email,
                website: salon.contact.website,
            });
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for the field being edited
        setFormErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const validateFormData = (data) => {
        const errors = {};
        if (!data.salonName || data.salonName.trim() === '') {
            errors.salonName = 'Salon Name is required.';
        }
        if (!/^\d{10}$/.test(data.phone)) {
            errors.phone = 'Phone number must be exactly 10 digits.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = 'Email format is invalid.';
        }
        // Basic check for website structure
        if (data.website && !/^((http|https):\/\/)?([\w\d]+\.)+[\w\d]{2,}(\/[\w\d-._~:/?#[\]@!$&'()*+,;=]*)?$/i.test(data.website)) {
             errors.website = 'Website URL is invalid.';
        }
        return errors;
    };


    // --- Render Logic ---

    if (loading) return <div style={containerStyle}>Loading salon data...</div>;
    if (error) return <div style={{...containerStyle, color: 'red'}}>Error: {error}</div>;
    if (!salon) return <div style={containerStyle}>No salon data available.</div>;

    const renderDetailField = (label, value, fieldName = null) => (
        <div style={detailRowStyle}>
            <span style={labelStyle}>{label}:</span>
            {isEditing && fieldName in formData ? (
                <div style={valueStyle}>
                    <input
                        style={inputStyle}
                        type="text"
                        name={fieldName}
                        value={formData[fieldName] || ''}
                        onChange={handleFormChange}
                    />
                    {formErrors[fieldName] && <div style={errorTextStyle}>{formErrors[fieldName]}</div>}
                </div>
            ) : (
                <span style={valueStyle}>{value}</span>
            )}
        </div>
    );

    const address = salon.address;
    const contact = salon.contact;

    return (
        <div style={containerStyle}>
            <ToastContainer />
            <div style={headerStyle}>
                <h2 style={titleStyle}>{salon.salonName} Details</h2>
                {isEditing ? (
                    <div>
                        <button style={saveButtonStyle} onClick={handleUpdate}>Save</button>
                        <button style={cancelButtonStyle} onClick={handleCancelClick}>Cancel</button>
                    </div>
                ) : (
                    <button style={editButtonStyle} onClick={handleEditClick}>
                        Edit Details
                    </button>
                )}
            </div>

            <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>General Information</h3>
                {renderDetailField('Salon Name', salon.salonName, 'salonName')}
                {renderDetailField('Description', salon.description, 'description')}
                <div style={detailRowStyle}>
                    <span style={labelStyle}>Rating:</span>
                    <span style={valueStyle}>{salon.rating.average} / 5 ({salon.rating.count} reviews)</span>
                </div>
                <div style={detailRowStyle}>
                    <span style={labelStyle}>Approval Status:</span>
                    <span style={valueStyle}>{salon.approvalStatus}</span>
                </div>
                <div style={detailRowStyle}>
                    <span style={labelStyle}>Commission Percentage:</span>
                    <span style={valueStyle}>{salon.commission.percentage}%</span>
                </div>
            </div>

            <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Contact Information</h3>
                {renderDetailField('Phone', contact.phone, 'phone')}
                {renderDetailField('Email', contact.email, 'email')}
                {renderDetailField('Website', contact.website, 'website')}
            </div>

            <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Address</h3>
                <div style={detailRowStyle}>
                    <span style={labelStyle}>Street:</span>
                    <span style={valueStyle}>{address.street}</span>
                </div>
                <div style={detailRowStyle}>
                    <span style={labelStyle}>Area, City:</span>
                    <span style={valueStyle}>{address.area}, {address.city}</span>
                </div>
                <div style={detailRowStyle}>
                    <span style={labelStyle}>State, Pin:</span>
                    <span style={valueStyle}>{address.state}, {address.pinCode}</span>
                </div>
                <div style={detailRowStyle}>
                    <span style={labelStyle}>Coordinates:</span>
                    <span style={valueStyle}>{salon.location.coordinates[1]}, {salon.location.coordinates[0]}</span>
                </div>
            </div>

            {/* Staff Section (Read-only for simplicity) */}
            <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Staff ({salon.staff.length})</h3>
                <ul style={{listStyleType: 'none', padding: 0}}>
                    {salon.staff.map(member => (
                        <li key={member._id} style={{marginBottom: '5px', padding: '5px', borderBottom: '1px dotted #eee'}}>
                            **{member.name}** ({member.gender}, {member.age} yrs) - Expertise: {member.expertise.join(', ')}
                        </li>
                    ))}
                </ul>
            </div>
            {/* Services (Read-only for simplicity) */}
             <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Facilities</h3>
                <div style={detailRowStyle}>
                    <span style={valueStyle}>
                         {/* Parsing nested JSON string array - depends on how the backend handles it */}
                        {JSON.parse(JSON.parse(salon.facilities[0]))?.join(', ') || 'N/A'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SalonDetail;