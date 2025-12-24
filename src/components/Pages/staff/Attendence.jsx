import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar } from 'lucide-react';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [todayStatus, setTodayStatus] = useState('notMarked');

  const staffData = localStorage.getItem("admin");
  const staff = staffData ? JSON.parse(staffData) : null;
  const staffId = staff?.id;
  console.log(staffId)

  const checkTodayAttendance = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/attendance/staff/${staffId}`);
      const attendance = response.data.attendances[0];
      console.log(response.data.attendances[0])
      if (response.data.success && attendance) {
        setAttendanceData(attendance);
        const today = new Date().toISOString().split('T')[0];
        if (attendance.date === today) {
          if (attendance.markIn) {
            setTodayStatus('markedIn');
          } else if (attendance.markOut) {
            setTodayStatus('markedOut');
          } else {
            setTodayStatus('notMarked');
          }
        } else {
          // Attendance is not for today
          setTodayStatus('notMarked');
        }

      } else {
        setTodayStatus('notMarked');
      }
    } catch (error) {
      console.log("FULL ERROR RESPONSE:", error.response?.data);
      setTodayStatus('notMarked');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkTodayAttendance();
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
      console.error('Mark In Error:', error.response?.data?.message);
      const errorMessage = error.response?.data?.message || 'Failed to mark in';
      if (error.response?.data?.message == 'Mark In already done for today') {
        setTodayStatus('markedIn');
      }
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
      console.error('Mark Out Error:', error.response?.data?.message);

      const errorMessage = error.response?.data?.message || 'Failed to mark out';
      if (error.response?.data?.message == 'Mark Out already done') {
        setTodayStatus('markedOut');
      }
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
    <div className=" p-2">
      {/* Header */}
      <div className='md:flex items-center justify-between'>
        <div className=" mb-6">
          <h2 className="text-3xl font-bold text-green-800">Daily Attendance</h2>
          <p className="mt-2 text-green-600 text-sm flex gap-2">
            <Calendar size={20}/> {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
       <div className="space-x-4 mb-6">
  {/* Mark In Button */}
  <button
    onClick={handleMarkIn}
    disabled={attendanceData?.markIn || loading} // Disabled if already marked in or loading
    className={`py-2 px-5 rounded-xl h-fit text-white font-semibold transition mb-1 md:mb-0
      ${attendanceData?.markIn ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
  >
    {loading && !attendanceData?.markIn ? 'Processing...' : ' Mark In'}
  </button>

  {/* Mark Out Button */}
  <button
    onClick={handleMarkOut}
    disabled={!attendanceData?.markIn || attendanceData?.markOut || loading} 
    // Disabled if Mark In not done OR already marked out OR loading
    className={`py-2 px-5 rounded-xl h-fit text-white font-semibold transition
      ${!attendanceData?.markIn || attendanceData?.markOut ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
  >
    {loading && attendanceData?.markIn && !attendanceData?.markOut ? 'Processing...' : ' Mark Out'}
  </button>
</div>

      </div>
      <div className="w-full bg-white rounded-3xl shadow-md p-4">
        {attendanceData && (
          <div className="p-4 rounded-xl mb-6 space-y-3">
            <div className="flex gap-3">
              <span className="font-medium text-green-700">Mark In Time:</span>
              <span className="text-green-800">{formatTime(attendanceData.markIn)} ({formatDate(attendanceData.date)})</span>
            </div>
            <div className="flex gap-3">
              <span className="font-medium text-green-700">Mark Out Time:</span>
              <span className="text-green-800">{attendanceData.markOut ? formatTime(attendanceData.markOut) : 'N/A'}</span>
            </div>
            <div className="flex gap-3">
              <span className="font-medium text-green-700">Total Hours:</span>
              <span className="text-green-800">{calculateWorkingHours() || 'N/A'}</span>
            </div>
            <div className="flex gap-3">
              <span className="font-medium text-green-700">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold 
            ${attendanceData.status === 'present' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                {attendanceData.status}
              </span>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className='flex justify-end'>
          <button
            onClick={checkTodayAttendance}
            disabled={loading}
            className="px-3  py-2 rounded-lg border border-green-300 text-green-700 hover:bg-green-100 transition disabled:opacity-50"
          >
            Refresh Status
          </button>
        </div>

      </div>
    </div>



  );
};

export default Attendance;