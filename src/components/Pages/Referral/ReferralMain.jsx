// components/Pages/Referral/ReferralMain.js
import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ReferralOverview from './ReferralOverview';
import ReferralList from './ReferralList';
import UserReferrals from './UserReferrals';
import RewardSettings from './RewardSettings';
import { Users, TrendingUp, Settings, List, Award } from 'lucide-react';

const ReferralMain = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Overview', href: '/referral', icon: TrendingUp, current: location.pathname === '/referral' },
    { name: 'All Referrals', href: '/referral/all', icon: List, current: location.pathname === '/referral/all' },
    { name: 'User Referrals', href: '/referral/users', icon: Users, current: location.pathname.startsWith('/referral/user') },
    { name: 'Reward Settings', href: '/referral/settings', icon: Settings, current: location.pathname === '/referral/settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Referral & Rewards
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Manage referral program and reward settings
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-sm border border-gray-200">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  item.current
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200/50 p-6">
          <Routes>
            <Route path="/" element={<ReferralOverview />} />
            <Route path="/all" element={<ReferralList />} />
            <Route path="/users" element={<UserReferrals />} />
            <Route path="/user/:userId" element={<UserReferrals />} />
            <Route path="/settings" element={<RewardSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ReferralMain;