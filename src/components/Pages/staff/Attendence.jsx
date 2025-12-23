import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './Attendence.css'; // Optional styling

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [todayStatus, setTodayStatus] = useState(null);
  
  // Get staff ID from token or props
  const staffId = localStorage.getItem('userId') || '6940f232a877ef2a9a0b81cd'; // Replace with actual user ID

  // Check today's attendance status
  const checkTodayAttendance = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
      
      // You might need to adjust this endpoint based on your API
      const response = await axiosInstance.get(`/attendance/staff/${staffId}`);
      
      if (response.data.success && response.data.attendance) {
        setAttendanceData(response.data.attendance);
        if (response.data.attendance.markIn && !response.data.attendance.markOut) {
          setTodayStatus('markedIn');
        } else if (response.data.attendance.markOut) {
          setTodayStatus('markedOut');
        }
      } else {
        setTodayStatus('notMarked');
      }
    } catch (error) {
      console.error('Error checking attendance:', error);
      setTodayStatus('notMarked');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkTodayAttendance();
    
    // Set up auto-check every minute
    const interval = setInterval(() => {
      checkTodayAttendance();
    }, 60000); // 1 minute
    
    return () => clearInterval(interval);
  }, []);

  // Mark In function
  const handleMarkIn = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/attendance/staff/${staffId}`);
      
      if (response.data.success) {
        setAttendanceData(response.data.attendance);
        setTodayStatus('markedIn');
        
        toast.success('✅ Successfully marked in!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        console.log('Mark In Response:', response.data);
      }
    } catch (error) {
      console.error('Mark In Error:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to mark in';
      
      toast.error(`❌ ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Mark Out function
  const handleMarkOut = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/attendance/staff/${staffId}/markout`);
      
      if (response.data.success) {
        setAttendanceData(response.data.attendance);
        setTodayStatus('markedOut');
        
        toast.success('✅ Successfully marked out!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        console.log('Mark Out Response:', response.data);
      }
    } catch (error) {
      console.error('Mark Out Error:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to mark out';
      
      toast.error(`❌ ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Format time function
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Calculate working hours
  const calculateWorkingHours = () => {
    if (!attendanceData?.markIn || !attendanceData?.markOut) return null;
    
    const markIn = new Date(attendanceData.markIn);
    const markOut = new Date(attendanceData.markOut);
    const diffMs = markOut - markIn;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="attendance-container">
      <div className="attendance-card">
        <h2 className="attendance-title">Daily Attendance</h2>
        <p className="attendance-date">
          📅 {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        
        {/* Status Indicator */}
        <div className={`status-indicator ${todayStatus}`}>
          {todayStatus === 'notMarked' && '⏳ Waiting for Mark In'}
          {todayStatus === 'markedIn' && '✅ Marked In - Ready for Mark Out'}
          {todayStatus === 'markedOut' && '🏁 Attendance Completed'}
        </div>
        
        {/* Attendance Details */}
        {attendanceData && (
          <div className="attendance-details">
            <div className="detail-row">
              <span className="detail-label">Mark In Time:</span>
              <span className="detail-value">
                {formatTime(attendanceData.markIn)} ({formatDate(attendanceData.date)})
              </span>
            </div>
            
            {attendanceData.markOut && (
              <>
                <div className="detail-row">
                  <span className="detail-label">Mark Out Time:</span>
                  <span className="detail-value">{formatTime(attendanceData.markOut)}</span>
                </div>
                
                <div className="detail-row total-hours">
                  <span className="detail-label">Total Working Hours:</span>
                  <span className="detail-value">{calculateWorkingHours()}</span>
                </div>
              </>
            )}
            
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`status-badge ${attendanceData.status}`}>
                {attendanceData.status}
              </span>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="action-buttons">
          {todayStatus === 'notMarked' && (
            <button 
              className="btn-mark-in"
              onClick={handleMarkIn}
              disabled={loading}
            >
              {loading ? 'Processing...' : '📥 Mark In'}
            </button>
          )}
          
          {todayStatus === 'markedIn' && (
            <button 
              className="btn-mark-out"
              onClick={handleMarkOut}
              disabled={loading}
            >
              {loading ? 'Processing...' : '📤 Mark Out'}
            </button>
          )}
          
          {todayStatus === 'markedOut' && (
            <button className="btn-completed" disabled>
              ✅ Today's Attendance Completed
            </button>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="quick-actions">
          <button 
            className="btn-refresh"
            onClick={checkTodayAttendance}
            disabled={loading}
          >
            🔄 Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;