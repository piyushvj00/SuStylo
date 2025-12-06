// components/Pages/Referral/ReferralOverview.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { Users, TrendingUp, Award, CreditCard, Loader, Calendar } from 'lucide-react';

const ReferralOverview = () => {
    const [stats, setStats] = useState({
        totalReferrals: 0,
        completedReferrals: 0,
        pendingReferrals: 0,
        totalRewards: 0,
        currentReward: 0
    });
    const [recentReferrals, setRecentReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchOverviewData();
    }, []);

    const fetchOverviewData = async () => {
        try {
            setLoading(true);

            // Fetch referrals
            const referralsResponse = await axiosInstance.get('/users/admin/referrals');
            const rewardResponse = await axiosInstance.get('/users/admin/get-reward');

            if (referralsResponse.data.success) {
                const referrals = referralsResponse.data.referrals;
                const total = referrals.length;
                const completed = referrals.filter(ref => ref.bookingCompleted && ref.rewardCredited).length;
                const pending = referrals.filter(ref => !ref.bookingCompleted || !ref.rewardCredited).length;
                const totalRewards = referrals
                    .filter(ref => ref.rewardCredited)
                    .reduce((sum, ref) => sum + ref.rewardAmount, 0);

                setStats({
                    totalReferrals: total,
                    completedReferrals: completed,
                    pendingReferrals: pending,
                    totalRewards: totalRewards,
                    currentReward: rewardResponse.data.reward || 0
                });

                setRecentReferrals(referrals.slice(0, 5));

                // Generate chart data (last 7 days)
                generateChartData(referrals);
            }
        } catch (error) {
            console.error('Error fetching overview data:', error);
            alert('Failed to fetch referral data');
        } finally {
            setLoading(false);
        }
    };

    const generateChartData = (referrals) => {
        const last7Days = [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        const chartData = last7Days.map(date => {
            const dayReferrals = referrals.filter(ref =>
                new Date(ref.createdAt).toISOString().split('T')[0] === date
            );
            return {
                date,
                count: dayReferrals.length,
                completed: dayReferrals.filter(ref => ref.bookingCompleted).length
            };
        });

        setChartData(chartData);
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
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-4">
                    <Loader className="h-8 w-8 animate-spin text-purple-600" />
                    <p className="text-gray-600">Loading referral data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-6 text-white shadow-lg shadow-purple-500/25">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Total Referrals</p>
                            <p className="text-3xl font-bold mt-2">{stats.totalReferrals}</p>
                        </div>
                        <Users className="h-8 w-8 text-white/80" />
                    </div>
                    <div className="mt-4 text-sm text-purple-100">
                        All time referral count
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg shadow-green-500/25">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Completed</p>
                            <p className="text-3xl font-bold mt-2">{stats.completedReferrals}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-white/80" />
                    </div>
                    <div className="mt-4 text-sm text-green-100">
                        Successful referrals
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/25">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Pending</p>
                            <p className="text-3xl font-bold mt-2">{stats.pendingReferrals}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-white/80" />
                    </div>
                    <div className="mt-4 text-sm text-orange-100">
                        Awaiting completion
                    </div>
                </div>

                <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg shadow-pink-500/25">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-pink-100 text-sm font-medium">Total Rewards</p>
                            <p className="text-3xl font-bold mt-2">{formatCurrency(stats.totalRewards)}</p>
                        </div>
                        <CreditCard className="h-8 w-8 text-white/80" />
                    </div>
                    <div className="mt-4 text-sm text-pink-100">
                        Rewards distributed
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Current Reward */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/25">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-indigo-100 text-sm font-medium">Current Reward Amount</p>
                            <p className="text-4xl font-bold mt-2">{formatCurrency(stats.currentReward)}</p>
                        </div>
                        <Award className="h-10 w-10 text-white/80" />
                    </div>
                    <div className="mt-4 text-sm text-indigo-100">
                        Per successful referral
                    </div>
                    <button
                        onClick={() => window.location.href = '/referral/settings'}
                        className="mt-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                    >
                        Update Reward
                    </button>
                </div>

                {/* Mini Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Last 7 Days</h3>
                    <div className="space-y-3">
                        {chartData.map((day, index) => (
                            <div key={day.date} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 w-20">
                                    {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                                </span>
                                <div className="flex-1 mx-4">
                                    <div className="bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${(day.count / Math.max(...chartData.map(d => d.count))) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 w-8 text-right">
                                    {day.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Referrals */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Referrals</h3>
                </div>
                <div className="p-6">
                    {recentReferrals.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No referrals found
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentReferrals.map((referral) => (
                                <div key={referral._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-3 h-3 rounded-full ${referral.bookingCompleted && referral.rewardCredited
                                                ? 'bg-green-500'
                                                : 'bg-orange-500'
                                            }`}></div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {referral.referrer?.firstName} {referral.referrer?.lastName}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Referred {referral.referredUser?.firstName || 'Unknown User'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(referral.rewardAmount)}
                                        </p>
                                        <p className={`text-sm ${referral.bookingCompleted && referral.rewardCredited
                                                ? 'text-green-600'
                                                : 'text-orange-600'
                                            }`}>
                                            {referral.bookingCompleted && referral.rewardCredited ? 'Completed' : 'Pending'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {recentReferrals.length > 0 && (
                        <div className="mt-6 text-center">
                            <a
                                href="/referral/all"
                                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                            >
                                View all referrals →
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReferralOverview;