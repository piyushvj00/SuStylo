// components/Pages/Referral/ReferralList.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { Search, Filter, Calendar, User, Award, Loader, Eye } from 'lucide-react';

const ReferralList = () => {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedReferral, setSelectedReferral] = useState(null);
    const [viewModal, setViewModal] = useState(false);

    useEffect(() => {
        fetchReferrals();
    }, []);

    const fetchReferrals = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/users/admin/referrals');
            if (response.data.success) {
                setReferrals(response.data.referrals);
            }
        } catch (error) {
            console.error('Error fetching referrals:', error);
            alert('Failed to fetch referrals');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (referral) => {
        if (referral.bookingCompleted && referral.rewardCredited) {
            return { text: 'Completed', color: 'bg-green-100 text-green-800 border-green-200' };
        } else if (referral.bookingCompleted && !referral.rewardCredited) {
            return { text: 'Booking Done', color: 'bg-blue-100 text-blue-800 border-blue-200' };
        } else {
            return { text: 'Pending', color: 'bg-orange-100 text-orange-800 border-orange-200' };
        }
    };

    const filteredReferrals = referrals.filter(referral => {
        const matchesSearch =
            referral.referrer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            referral.referrer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            referral.referrer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            referral.referredUser?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            referral.referredUser?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            referral.referralCode?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'completed' && referral.bookingCompleted && referral.rewardCredited) ||
            (statusFilter === 'pending' && (!referral.bookingCompleted || !referral.rewardCredited));

        return matchesSearch && matchesStatus;
    });

    const viewReferralDetails = (referral) => {
        setSelectedReferral(referral);
        setViewModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-4">
                    <Loader className="h-8 w-8 animate-spin text-purple-600" />
                    <p className="text-gray-600">Loading referrals...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">All Referrals</h2>
                    <p className="text-gray-600 mt-1">
                        {referrals.length} total referral{referrals.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or referral code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="lg:w-48">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Referrals Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Referrer & Referred
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Reward
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReferrals.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <User className="h-12 w-12 text-gray-400" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">No referrals found</h3>
                                                <p className="text-gray-600 mt-1">
                                                    {searchTerm || statusFilter !== 'all'
                                                        ? 'Try adjusting your search or filter criteria'
                                                        : 'No referrals have been made yet'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredReferrals.map((referral) => {
                                    const status = getStatusBadge(referral);
                                    return (
                                        <tr key={referral._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <User className="h-4 w-4 text-gray-400" />
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {referral.referrer?.firstName} {referral.referrer?.lastName}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Referred: {referral.referredUser?.firstName || 'Unknown User'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Code: {referral.referralCode}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Award className="h-4 w-4 text-yellow-500" />
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {formatCurrency(referral.rewardAmount)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${status.color}`}>
                                                    {status.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{formatDate(referral.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => viewReferralDetails(referral)}
                                                    className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span className="text-sm font-medium">View</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal */}
            {viewModal && selectedReferral && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Referral Details</h3>
                                <button
                                    onClick={() => setViewModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Referrer Info */}
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-blue-900 mb-3">Referrer Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-blue-700">Name</label>
                                            <p className="font-medium text-blue-900">
                                                {selectedReferral.referrer?.firstName} {selectedReferral.referrer?.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-blue-700">Email</label>
                                            <p className="font-medium text-blue-900">{selectedReferral.referrer?.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-blue-700">Mobile</label>
                                            <p className="font-medium text-blue-900">{selectedReferral.referrer?.mobile}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-blue-700">Referral Code</label>
                                            <p className="font-medium text-blue-900">{selectedReferral.referralCode}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Referred User Info */}
                                <div className="bg-green-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-green-900 mb-3">Referred User</h4>
                                    {selectedReferral.referredUser ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-green-700">Name</label>
                                                <p className="font-medium text-green-900">
                                                    {selectedReferral.referredUser.firstName} {selectedReferral.referredUser.lastName}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-green-700">Email</label>
                                                <p className="font-medium text-green-900">{selectedReferral.referredUser.email}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-green-700">Mobile</label>
                                                <p className="font-medium text-green-900">{selectedReferral.referredUser.mobile}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-green-700">Referred By</label>
                                                <p className="font-medium text-green-900">{selectedReferral.referredUser.referredBy}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-green-700">User registration pending</p>
                                    )}
                                </div>

                                {/* Referral Details */}
                                <div className="bg-purple-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-purple-900 mb-3">Referral Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-purple-700">Reward Amount</label>
                                            <p className="font-medium text-purple-900">
                                                {formatCurrency(selectedReferral.rewardAmount)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-purple-700">Status</label>
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(selectedReferral).color
                                                    }`}>
                                                    {getStatusBadge(selectedReferral).text}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm text-purple-700">Booking Completed</label>
                                            <p className="font-medium text-purple-900">
                                                {selectedReferral.bookingCompleted ? 'Yes' : 'No'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-purple-700">Reward Credited</label>
                                            <p className="font-medium text-purple-900">
                                                {selectedReferral.rewardCredited ? 'Yes' : 'No'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-purple-700">Created Date</label>
                                            <p className="font-medium text-purple-900">
                                                {formatDate(selectedReferral.createdAt)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-purple-700">Last Updated</label>
                                            <p className="font-medium text-purple-900">
                                                {formatDate(selectedReferral.updatedAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setViewModal(false)}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferralList;