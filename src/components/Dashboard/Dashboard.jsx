
import {
  Car,
  CreditCard,
  Layers,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
  Store,
  Calendar,
  DollarSign,
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
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cardsData = [
  {
    bgColor: "bg-teal-600",
    icon: Layers,
    title: "Today Orders",
    amount: "₹0.00",
    paymentDetails: "Cash: ₹0.00 | Card: ₹0.00 | Credit: ₹0.00",
  },
  {
    bgColor: "bg-orange-400",
    icon: Layers,
    title: "Yesterday Orders",
    amount: "₹0.00",
    paymentDetails: "Cash: ₹0.00 | Card: ₹0.00 | Credit: ₹0.00",
  },
  {
    bgColor: "bg-blue-500",
    icon: ShoppingCart,
    title: "This Month",
    amount: "₹0.00",
    paymentDetails: null,
  },
  {
    bgColor: "bg-cyan-700",
    icon: CreditCard,
    title: "Last Month",
    amount: "₹0.00",
    paymentDetails: null,
  },
  {
    bgColor: "bg-green-600",
    icon: CreditCard,
    title: "All-Time Sales",
    amount: "₹0.00",
    paymentDetails: null,
  },
];

// Sample data for the line chart
const salesData = [
  { date: "2025-07-14", sales: 800 },
  { date: "2025-07-15", sales: 1400 },
  { date: "2025-07-16", sales: 1200 },
];

// Sample data for the pie chart
const pieData = [
  { name: "Mini Lettuce", value: 35 },
  { name: "Organic Baby Carrot", value: 30 },
  { name: "Yellow Sweet Corn", value: 35 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const savedUser = JSON.parse(localStorage.getItem("user") || "null");

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function Dashboard({ user }) {
  const [summary, setSummary] = useState({
    users: { total: 0, last7Days: 0, today: 0, thisMonth: 0 },
    courses: { total: 0, active: 0, free: 0, paid: 0 },
    testSeries: { total: 0, active: 0, free: 0, paid: 0 },
    books: { total: 0, inStock: 0, outOfStock: 0 },
    orders: { total: 0, paidOrCompleted: 0, pendingOrOther: 0 },
    revenue: { total: 0, thisMonth: 0, today: 0 },
    enrollments: { totalCourseEnrollments: 0, uniquePayingUsers: 0 },
    batchesTopics: {
      totalBatches: 0,
      upcoming: 0,
      running: 0,
      completed: 0,
      totalTopics: 0,
    },
  });

  useEffect(() => {
    if (savedUser) {
      toast.success(`Welcome ${savedUser.name || ""}!`);
    }
  }, []);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        // 🔥 new API call
        const response = await axiosInstance.get("/admin/dashboard/summary");
        const data = response.data;

        setSummary((prev) => ({
          ...prev,
          ...data,
        }));
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        toast.error("Failed to load dashboard summary");
      }
    };

    fetchDashboardSummary();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <div className="max-w-full">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Dashboard Overview
          </h1>

          {/* 🔹 1. Users, Courses, Test Series, Books */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 w-full">
            {/* Users */}
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-start gap-5">
              <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-lg bg-purple-50 text-purple-500">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">
                  Total Users
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatNumber(summary.users.total)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Today: {formatNumber(summary.users.today)} | Last 7 days:{" "}
                  {formatNumber(summary.users.last7Days)}
                </div>
                <div className="text-xs text-gray-400">
                  This month: {formatNumber(summary.users.thisMonth)}
                </div>
              </div>
            </div>

            {/* Courses */}
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-start gap-5">
              <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                <Layers className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">
                  Courses
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatNumber(summary.courses.total)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Active: {formatNumber(summary.courses.active)}
                </div>
                <div className="text-xs text-gray-400">
                  Free: {formatNumber(summary.courses.free)} | Paid:{" "}
                  {formatNumber(summary.courses.paid)}
                </div>
              </div>
            </div>

            {/* Test Series */}
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-start gap-5">
              <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">
                  Test Series
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatNumber(summary.testSeries.total)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Active: {formatNumber(summary.testSeries.active)}
                </div>
                <div className="text-xs text-gray-400">
                  Free: {formatNumber(summary.testSeries.free)} | Paid:{" "}
                  {formatNumber(summary.testSeries.paid)}
                </div>
              </div>
            </div>

            {/* Books */}
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-start gap-5">
              <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-lg bg-yellow-50 text-yellow-500">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">Books</div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatNumber(summary.books.total)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  In Stock: {formatNumber(summary.books.inStock)}
                </div>
                <div className="text-xs text-gray-400">
                  Out of Stock: {formatNumber(summary.books.outOfStock)}
                </div>
              </div>
            </div>
          </div>

          {/* 🔹 2. Orders, Revenue, Enrollments, Batches/Topics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 w-full">
            {/* Orders */}
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-start gap-5">
              <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-lg bg-red-50 text-red-500">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">
                  Orders
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatNumber(summary.orders.total)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Paid/Completed:{" "}
                  {formatNumber(summary.orders.paidOrCompleted)}
                </div>
                <div className="text-xs text-gray-400">
                  Pending/Other:{" "}
                  {formatNumber(summary.orders.pendingOrOther)}
                </div>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-start gap-5">
              <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-lg bg-green-50 text-green-500">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">
                  Revenue
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatCurrency(summary.revenue.total)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Today: {formatCurrency(summary.revenue.today)}
                </div>
                <div className="text-xs text-gray-400">
                  This Month: {formatCurrency(summary.revenue.thisMonth)}
                </div>
              </div>
            </div>

            {/* Enrollments */}
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-start gap-5">
              <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-lg bg-cyan-50 text-cyan-500">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">
                  Enrollments
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatNumber(
                    summary.enrollments.totalCourseEnrollments
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Paying Users:{" "}
                  {formatNumber(summary.enrollments.uniquePayingUsers)}
                </div>
              </div>
            </div>

            {/* Batches & Topics */}
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-5">
                <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                  <Store className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">
                    Batches & Topics
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {formatNumber(summary.batchesTopics.totalBatches)}{" "}
                    Batches
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Upcoming: {formatNumber(summary.batchesTopics.upcoming)} |{" "}
                    Running: {formatNumber(summary.batchesTopics.running)}
                  </div>
                  <div className="text-xs text-gray-400">
                    Completed: {formatNumber(summary.batchesTopics.completed)}
                  </div>
                  <div className="text-xs text-gray-400">
                    Topics: {formatNumber(summary.batchesTopics.totalTopics)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts - same as before */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
            {/* Weekly Sales Line Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Weekly Sales</h2>
                <div className="text-sm text-gray-500">
                  <span className="mr-4">Sales</span>
                  <span>Orders</span>
                </div>
              </div>
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      domain={[0, 1600]}
                      ticks={[
                        0, 200, 400, 600, 800, 1000, 1200, 1400, 1600,
                      ]}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#10B981"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Best Selling Products */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">
                Best Selling Products
              </h2>
              <div className="flex flex-col items-center">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              COLORS[index % COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders (agar baad me chahiye) */}
          {/* <RecentOrders recentData={recentData} /> */}
        </div>
      </div>
    </>
  );
}
