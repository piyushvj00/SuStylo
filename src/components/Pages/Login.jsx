import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../config/AxiosInstance";

const Login = ({ setUser }) => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle Login with phone + password
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phone || phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Call your /login API
      const response = await axiosInstance.post("/login", {
        phone,
        password,
      });

      const { success, message, user, token } = response.data;

      if (success) {
        // ✅ Save token & user in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        toast.success(message || "Login successful!");

        // ✅ Role-based redirect
        if (user.role === "admin" || user.role === "superadmin") {
          navigate("/admin/dashboard");
        } else if (user.role === "vendor") {
          navigate("/vendor/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error(message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            {/* Left side - Image */}
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full"
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1374&q=80"
                alt="Office"
              />
            </div>

            {/* Right side - Login Form */}
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                  Login
                </h1>

                <form onSubmit={handleLogin}>
                  {/* Phone */}
                  <label className="block text-gray-800 dark:text-gray-400 font-medium text-sm">
                    Phone Number
                  </label>
                  <input
                    className="block w-full border px-3 py-2 rounded-md bg-gray-100 focus:bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                  />

                  {/* Password */}
                  <label className="block mt-4 text-gray-800 dark:text-gray-400 font-medium text-sm">
                    Password
                  </label>
                  <input
                    className="block w-full border px-3 py-2 rounded-md bg-gray-100 focus:bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
