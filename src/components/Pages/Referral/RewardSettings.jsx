// components/Pages/Referral/RewardSettings.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { Settings, Award, Save, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const RewardSettings = () => {
  const [currentReward, setCurrentReward] = useState(0);
  const [newReward, setNewReward] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCurrentReward();
  }, []);

  const fetchCurrentReward = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users/admin/get-reward');
      if (response.data.success) {
        setCurrentReward(response.data.reward);
      }
    } catch (error) {
      console.error('Error fetching reward:', error);
      setMessage({ type: 'error', text: 'Failed to fetch current reward' });
    } finally {
      setLoading(false);
    }
  };

  const updateReward = async (e) => {
    e.preventDefault();
    
    if (!newReward || isNaN(newReward) || parseInt(newReward) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid reward amount' });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const response = await axiosInstance.post('/users/admin/update-reward', {
        amount: parseInt(newReward)
      });

      if (response.data.success) {
        setCurrentReward(parseInt(newReward));
        setNewReward('');
        setMessage({ 
          type: 'success', 
          text: `Referral reward updated to ₹${newReward}` 
        });
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error updating reward:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update reward' 
      });
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading reward settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Reward Settings</h2>
        <p className="text-gray-600 mt-2">
          Configure the referral reward amount for your users
        </p>
      </div>

      {/* Current Reward Display */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-8 text-white text-center shadow-lg shadow-green-500/25">
        <Award className="h-12 w-12 mx-auto mb-4 text-white/80" />
        <p className="text-green-100 text-sm font-medium">Current Reward Amount</p>
        <p className="text-5xl font-bold mt-2">{formatCurrency(currentReward)}</p>
        <p className="text-green-100 mt-4">Per successful referral</p>
      </div>

      {/* Update Form */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Update Reward Amount</h3>
        
        <form onSubmit={updateReward} className="space-y-6">
          {/* Message Alert */}
          {message.text && (
            <div className={`p-4 rounded-xl border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center space-x-2">
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="reward" className="block text-sm font-medium text-gray-700 mb-2">
              New Reward Amount (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                id="reward"
                min="1"
                step="1"
                value={newReward}
                onChange={(e) => setNewReward(e.target.value)}
                placeholder="Enter amount in rupees"
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Enter the new reward amount that will be given for each successful referral
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600">
                Current reward: <span className="font-semibold text-gray-900">{formatCurrency(currentReward)}</span>
              </p>
            </div>
            <button
              type="submit"
              disabled={saving || !newReward}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
            >
              {saving ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span className="font-medium">
                {saving ? 'Updating...' : 'Update Reward'}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Award className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-semibold text-blue-900">How it works</h4>
          </div>
          <p className="text-blue-800 text-sm">
            Users receive this reward amount when someone they refer completes their first booking.
            The reward is credited to their wallet balance.
          </p>
        </div>

        <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-semibold text-purple-900">Best Practices</h4>
          </div>
          <p className="text-purple-800 text-sm">
            Set a competitive reward amount to encourage referrals. Consider your user base
            and business model when adjusting this amount.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RewardSettings;