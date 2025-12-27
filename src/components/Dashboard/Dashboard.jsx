
// import {
//   Layers,
//   RefreshCw,
//   ShoppingCart,
//   Users,
//   Store,
//   Calendar,
//   DollarSign,
// } from "lucide-react";

// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../config/AxiosInstance";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const salesData = [
//   { date: "2025-07-14", sales: 800 },
//   { date: "2025-07-15", sales: 1400 },
//   { date: "2025-07-16", sales: 1200 },
// ];

// const pieData = [
//   { name: "At Home", value: 16 },
//   { name: "At Salon", value: 18 },
// ];

// const COLORS = ["#0088FE", "#00C49F"];

// const savedUser = JSON.parse(localStorage.getItem("user") || "null");

// const formatNumber = (value) =>
//   Number(value || 0).toLocaleString("en-IN");

// const formatCurrency = (value) =>
//   `₹${Number(value || 0).toLocaleString("en-IN")}`;

// export default function Dashboard() {
//   const [dashboard, setDashboard] = useState({
//     counts: {
//       totalCustomers: 0,
//       totalSalons: 0,
//       totalFreelancers: 0,
//       totalCoupons: 0,
//       totalLeads: 0,
//       todayLeads: 0,
//       totalTickets: 0,
//     },
//     referrals: {
//       today: 0,
//       overall: 0,
//     },
//     earnings: {
//       overall: 0,
//       overallCommission: 0,
//       today: 0,
//     },
//     bookings: {
//       overall: {
//         total: 0,
//         atHome: 0,
//         atSalon: 0,
//       },
//       today: {
//         atHome: 0,
//         atSalon: 0,
//       },
//     },
//   });

//   useEffect(() => {
//     if (savedUser) {
//       toast.success(`Welcome ${savedUser.name || ""}!`);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchDashboardSummary = async () => {
//       try {
//         const response = await axiosInstance.get("/dash/super-admin");
//         if (response.data?.success) {
//           setDashboard(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching dashboard summary:", error);
//         toast.error("Failed to load dashboard summary");
//       }
//     };

//     fetchDashboardSummary();
//   }, []);

//   return (
//     <>
//       <ToastContainer />
//       <div className="min-h-screen bg-gray-50 overflow-x-hidden">
//         <div className="max-w-full">
//           <h1 className="text-2xl font-semibold text-gray-900 mb-6">
//             Dashboard Overview
//           </h1>

//           {/* 🔹 1. Customers, Salons, Freelancers, Coupons */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 w-full">
//             <div className="bg-white p-5 rounded-xl shadow-md flex items-start gap-5">
//               <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-purple-50 text-purple-500">
//                 <Users className="h-6 w-6" />
//               </div>
//               <div>
//                 <div className="text-sm text-gray-500">Total Customers</div>
//                 <div className="text-2xl font-bold">
//                   {formatNumber(dashboard.counts.totalCustomers)}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-5 rounded-xl shadow-md flex items-start gap-5">
//               <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
//                 <Store className="h-6 w-6" />
//               </div>
//               <div>
//                 <div className="text-sm text-gray-500">Total Salons</div>
//                 <div className="text-2xl font-bold">
//                   {formatNumber(dashboard.counts.totalSalons)}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-5 rounded-xl shadow-md flex items-start gap-5">
//               <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500">
//                 <Calendar className="h-6 w-6" />
//               </div>
//               <div>
//                 <div className="text-sm text-gray-500">Freelancers</div>
//                 <div className="text-2xl font-bold">
//                   {formatNumber(dashboard.counts.totalFreelancers)}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-5 rounded-xl shadow-md flex items-start gap-5">
//               <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-yellow-50 text-yellow-500">
//                 <ShoppingCart className="h-6 w-6" />
//               </div>
//               <div>
//                 <div className="text-sm text-gray-500">Coupons</div>
//                 <div className="text-2xl font-bold">
//                   {formatNumber(dashboard.counts.totalCoupons)}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* 🔹 2. Leads, Tickets, Earnings, Bookings */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 w-full">
//             <div className="bg-white p-5 rounded-xl shadow-md flex items-start gap-5">
//               <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-red-50 text-red-500">
//                 <RefreshCw className="h-6 w-6" />
//               </div>
//               <div>
//                 <div className="text-sm text-gray-500">Leads</div>
//                 <div className="text-2xl font-bold">
//                   {formatNumber(dashboard.counts.totalLeads)}
//                 </div>
//                 <div className="text-xs text-gray-400">
//                   Today: {formatNumber(dashboard.counts.todayLeads)}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-5 rounded-xl shadow-md flex items-start gap-5">
//               <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-cyan-50 text-cyan-500">
//                 <Layers className="h-6 w-6" />
//               </div>
//               <div>
//                 <div className="text-sm text-gray-500">Tickets</div>
//                 <div className="text-2xl font-bold">
//                   {formatNumber(dashboard.counts.totalTickets)}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-5 rounded-xl shadow-md flex items-start gap-5">
//               <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-green-50 text-green-500">
//                 <DollarSign className="h-6 w-6" />
//               </div>
//               <div>
//                 <div className="text-sm text-gray-500">Earnings</div>
//                 <div className="text-2xl font-bold">
//                   {formatCurrency(dashboard.earnings.overall)}
//                 </div>
//                 <div className="text-xs text-gray-400">
//                   Today: {formatCurrency(dashboard.earnings.today)}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-5 rounded-xl shadow-md flex items-start gap-5">
//               <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-orange-50 text-orange-500">
//                 <Store className="h-6 w-6" />
//               </div>
//               <div>
//                 <div className="text-sm text-gray-500">Bookings</div>
//                 <div className="text-2xl font-bold">
//                   {formatNumber(dashboard.bookings.overall.total)}
//                 </div>
//                 <div className="text-xs text-gray-400">
//                   Home: {dashboard.bookings.overall.atHome} | Salon:{" "}
//                   {dashboard.bookings.overall.atSalon}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Charts (same) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h2 className="text-lg font-medium mb-4">Weekly Sales</h2>
//               <div className="w-full h-[250px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={salesData}>
//                     <XAxis dataKey="date" />
//                     <YAxis />
//                     <Tooltip />
//                     <Line
//                       type="monotone"
//                       dataKey="sales"
//                       stroke="#10B981"
//                       strokeWidth={2}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="bg-white p-4 rounded-lg shadow">
//               <h2 className="text-lg font-medium mb-4">Bookings Split</h2>
//               <div className="h-[250px] w-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={pieData}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={80}
//                       label
//                     >
//                       {pieData.map((_, index) => (
//                         <Cell
//                           key={index}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }




import {
  Layers,
  RefreshCw,
  ShoppingCart,
  Users,
  Store,
  Calendar,
  DollarSign,
  Award,
  Wallet,
  Ticket,
  TrendingUp,
  UserCheck,
  Clock,
  Home,
  Building,
  Percent,
  Gift,
  MessageSquare,
  Target,
  Star,
  CreditCard,
  BarChart3
} from "lucide-react";

import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/AxiosInstance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  Legend
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Static data for charts
const salesData = [
  { date: "Mon", sales: 4000 },
  { date: "Tue", sales: 3000 },
  { date: "Wed", sales: 2000 },
  { date: "Thu", sales: 2780 },
  { date: "Fri", sales: 1890 },
  { date: "Sat", sales: 2390 },
  { date: "Sun", sales: 3490 },
];

const bookingData = [
  { name: "Mon", atHome: 4, atSalon: 3 },
  { name: "Tue", atHome: 3, atSalon: 4 },
  { name: "Wed", atHome: 5, atSalon: 2 },
  { name: "Thu", atHome: 2, atSalon: 5 },
  { name: "Fri", atHome: 4, atSalon: 3 },
  { name: "Sat", atHome: 6, atSalon: 2 },
  { name: "Sun", atHome: 3, atSalon: 4 },
];

const pieData = [
  { name: "At Home", value: 16 },
  { name: "At Salon", value: 18 },
];

const COLORS = ["#0088FE", "#00C49F"];
const BAR_COLORS = ["#8884d8", "#82ca9d"];

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
useEffect(() => {
  const adminData = JSON.parse(localStorage.getItem("admin") || "null");
  const roleFromStorage = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (adminData && (adminData.role || roleFromStorage) && token) {
    const role = adminData.role || roleFromStorage;

    setUserRole(role);

    const name =
      adminData.name ||
      adminData.fullName ||
      `${adminData.firstName || ""} ${adminData.lastName || ""}`;

    toast.success(`Welcome ${name}!`);

    fetchDashboardData(role);
  } else {
    toast.error("User not found. Please login again.");
    window.location.href = "/login";
  }
}, []);

  const fetchDashboardData = async (role) => {
    try {
      setLoading(true);
      let endpoint = '';
      
      switch(role) {
        case 'super_admin':
          endpoint = '/dash/super-admin';
          break;
        case 'admin':
          endpoint = '/dash/admin';
          break;
        case 'freelancer':
          endpoint = '/dash/freelancer';
          break;
        default:
          endpoint = '/dash/super-admin'; // Default
      }

      const response = await axiosInstance.get(endpoint);
      if (response.data?.success) {
        setDashboard(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = () => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (savedUser) {
      fetchDashboardData(savedUser.role);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Render Super Admin Dashboard
  const renderSuperAdminDashboard = () => (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Complete platform overview and analytics</p>
        </div>
        <button
          onClick={refreshDashboard}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </button>
      </div>

      {/* Stats Grid - Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Customers */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-purple-600">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {formatNumber(dashboard?.counts?.totalCustomers || 0)}
          </h3>
          <p className="text-gray-600 mt-1">Customers</p>
        </div>

        {/* Total Salons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Store className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-blue-600">Registered</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {formatNumber(dashboard?.counts?.totalSalons || 0)}
          </h3>
          <p className="text-gray-600 mt-1">Salons</p>
        </div>

        {/* Total Freelancers */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-teal-500">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {formatNumber(dashboard?.counts?.totalFreelancers || 0)}
          </h3>
          <p className="text-gray-600 mt-1">Freelancers</p>
        </div>

        {/* Total Coupons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-yellow-600">Issued</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {formatNumber(dashboard?.counts?.totalCoupons || 0)}
          </h3>
          <p className="text-gray-600 mt-1">Coupons</p>
        </div>
      </div>

      {/* Stats Grid - Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Earnings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">Revenue</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {formatCurrency(dashboard?.earnings?.overall || 0)}
          </h3>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">
              Today: {formatCurrency(dashboard?.earnings?.today || 0)}
            </span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-indigo-600">Overall</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {formatNumber(dashboard?.bookings?.overall?.total || 0)}
          </h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="text-center">
              <Home className="h-4 w-4 text-blue-500 mx-auto mb-1" />
              <span className="text-sm text-gray-600">
                {formatNumber(dashboard?.bookings?.overall?.atHome || 0)}
              </span>
            </div>
            <div className="text-center">
              <Building className="h-4 w-4 text-green-500 mx-auto mb-1" />
              <span className="text-sm text-gray-600">
                {formatNumber(dashboard?.bookings?.overall?.atSalon || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Total Leads */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-500">
              <Target className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-red-600">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {formatNumber(dashboard?.counts?.totalLeads || 0)}
          </h3>
          <div className="flex items-center mt-2">
            <Clock className="h-4 w-4 text-orange-500 mr-1" />
            <span className="text-sm text-orange-600">
              Today: {formatNumber(dashboard?.counts?.todayLeads || 0)}
            </span>
          </div>
        </div>

        {/* Total Tickets */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-cyan-600">Open</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {formatNumber(dashboard?.counts?.totalTickets || 0)}
          </h3>
          <p className="text-gray-600 mt-1">Support Tickets</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Earnings Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-600">Weekly</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Earnings']}
                  labelStyle={{ color: '#666' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Booking Analysis</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-sm text-gray-600">At Home</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">At Salon</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12}
                />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="atHome" 
                  name="At Home" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="atSalon" 
                  name="At Salon" 
                  fill="#82ca9d" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Referrals */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 mr-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Referrals</h3>
              <p className="text-gray-600 text-sm">User referral statistics</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today</span>
              <span className="text-xl font-bold text-pink-600">
                {formatNumber(dashboard?.referrals?.today || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overall</span>
              <span className="text-xl font-bold text-pink-600">
                {formatNumber(dashboard?.referrals?.overall || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Commission */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 mr-4">
              <Percent className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Commission</h3>
              <p className="text-gray-600 text-sm">Platform commission</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Commission</span>
              <span className="text-xl font-bold text-amber-600">
                {formatCurrency(dashboard?.earnings?.overallCommission || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenue</span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(dashboard?.earnings?.overall || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Today's Bookings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 mr-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Today's Bookings</h3>
              <p className="text-gray-600 text-sm">Real-time booking stats</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">At Home</span>
              <span className="text-xl font-bold text-blue-600">
                {formatNumber(dashboard?.bookings?.today?.atHome || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">At Salon</span>
              <span className="text-xl font-bold text-green-600">
                {formatNumber(dashboard?.bookings?.today?.atSalon || 0)}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Today</span>
                <span className="text-xl font-bold text-purple-600">
                  {formatNumber((dashboard?.bookings?.today?.atHome || 0) + (dashboard?.bookings?.today?.atSalon || 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Render Admin Dashboard
  const renderAdminDashboard = () => (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Salon Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your salon performance and analytics</p>
        </div>
        <button
          onClick={refreshDashboard}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Bookings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-purple-600">Lifetime</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {formatNumber(dashboard?.totalBookings || 0)}
          </h3>
          <p className="text-gray-600 mt-1">Total Bookings</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="text-center">
              <Home className="h-4 w-4 text-blue-500 mx-auto mb-1" />
              <span className="text-sm text-gray-600">
                {formatNumber(dashboard?.todayBookings?.atHome || 0)} Today
              </span>
            </div>
            <div className="text-center">
              <Building className="h-4 w-4 text-green-500 mx-auto mb-1" />
              <span className="text-sm text-gray-600">
                {formatNumber(dashboard?.todayBookings?.atSalon || 0)} Today
              </span>
            </div>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">Revenue</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {formatCurrency(dashboard?.earnings?.total || 0)}
          </h3>
          <p className="text-gray-600 mt-1">Total Earnings</p>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">
              Today: {formatCurrency(dashboard?.earnings?.today || 0)}
            </span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-blue-600">Clients</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {formatNumber(dashboard?.totalCustomers || 0)}
          </h3>
          <p className="text-gray-600 mt-1">Total Customers</p>
          <div className="mt-4 flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm text-gray-600">
              Avg Rating: {dashboard?.avgRating || 0}/5
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Staff */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-purple-100 mr-3">
              <UserCheck className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Staff</h4>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(dashboard?.staff?.total || 0)}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Present: {formatNumber(dashboard?.staff?.present || 0)}
          </div>
        </div>

        {/* Coupons */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-yellow-100 mr-3">
              <Gift className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Coupons</h4>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(dashboard?.coupons?.total || 0)}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Used: {formatNumber(dashboard?.coupons?.used || 0)}
          </div>
        </div>

        {/* Tickets */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-red-100 mr-3">
              <Ticket className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Tickets</h4>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(dashboard?.tickets || 0)}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Support requests
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-green-100 mr-3">
              <Wallet className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Wallet</h4>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(dashboard?.walletBalance || 0)}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Available balance
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Booking Trend Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Booking Trends</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-sm text-gray-600">At Home</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">At Salon</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12}
                />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="atHome" 
                  name="At Home" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="atSalon" 
                  name="At Salon" 
                  fill="#82ca9d" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-600">Weekly</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                  labelStyle={{ color: '#666' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );

  // Render Freelancer Dashboard
  const renderFreelancerDashboard = () => (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Freelancer Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your services and earnings</p>
        </div>
        <button
          onClick={refreshDashboard}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Bookings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-blue-600">Lifetime</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {formatNumber(dashboard?.totalBookings || 0)}
          </h3>
          <p className="text-gray-600 mt-1">Total Bookings</p>
          <div className="mt-4 flex items-center">
            <Clock className="h-4 w-4 text-orange-500 mr-1" />
            <span className="text-sm text-orange-600">
              Today: {formatNumber(dashboard?.todayBookings?.total || 0)}
            </span>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">Revenue</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {formatCurrency(dashboard?.earnings?.total || 0)}
          </h3>
          <p className="text-gray-600 mt-1">Total Earnings</p>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">
              Today: {formatCurrency(dashboard?.earnings?.today || 0)}
            </span>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <Star className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-yellow-600">Rating</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {dashboard?.avgRating || 0}/5
          </h3>
          <p className="text-gray-600 mt-1">Average Rating</p>
          <div className="mt-4 flex items-center">
            <Users className="h-4 w-4 text-purple-500 mr-1" />
            <span className="text-sm text-gray-600">
              Based on {formatNumber(dashboard?.ratingCount || 0)} reviews
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Today's Bookings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-blue-100 mr-3">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Today's Bookings</h4>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(dashboard?.todayBookings?.total || 0)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center">
              <Home className="h-3 w-3 text-blue-500 mx-auto mb-1" />
              <span className="text-gray-600">
                {formatNumber(dashboard?.todayBookings?.atHome || 0)} Home
              </span>
            </div>
            <div className="text-center">
              <Building className="h-3 w-3 text-green-500 mx-auto mb-1" />
              <span className="text-gray-600">
                {formatNumber(dashboard?.todayBookings?.atSalon || 0)} Salon
              </span>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-purple-100 mr-3">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Customers</h4>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(dashboard?.totalCustomers || 0)}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Total clients served
          </div>
        </div>

        {/* Services Offered */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-green-100 mr-3">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Services</h4>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(dashboard?.totalServices || 0)}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Offered services
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-amber-100 mr-3">
              <Wallet className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Wallet</h4>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(dashboard?.walletBalance || 0)}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Available balance
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Earnings Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Earnings Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-600">Weekly</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Earnings']}
                  labelStyle={{ color: '#666' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Booking Distribution</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-sm text-gray-600">At Home</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">At Salon</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Bookings']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );

  // Main render based on user role
  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {userRole === 'super_admin' && renderSuperAdminDashboard()}
          {userRole === 'admin' && renderAdminDashboard()}
          {userRole === 'freelancer' && renderFreelancerDashboard()}
          {!userRole && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to determine user role</h2>
              <p className="text-gray-600">Please login again to access your dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}