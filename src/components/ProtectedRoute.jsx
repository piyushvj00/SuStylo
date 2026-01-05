


// import { Navigate, useLocation } from "react-router-dom";

// const roleAccessMap = {
//   super_admin: ["*"],

//   admin: [
//     "/dashboard",
//     "/bookings",
//     "/businesses",
//   ],

//   freelancer: [
//     "/dashboard",
//     "/bookings",
//     "/businesses",
//   ],

//   staff: [
//     "/attendence",
//     "/appointments",
//   ],
// };

// const ProtectedRoute = ({ children }) => {
//   const location = useLocation();
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!role) {
//     return <Navigate to="/login" replace />;
//   }

//   // ✅ super_admin can access everything
//   if (role === "super_admin") {
//     return children;
//   }

//   const allowedRoutes = roleAccessMap[role] || [];

//   const isAllowed = allowedRoutes.some((path) => {
//     if (path === "*") return true;
//     return location.pathname === path || location.pathname.startsWith(path + "/");
//   });

//   if (!isAllowed) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;




// ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

const roleAccessMap = {
  super_admin: ["*"],

  admin: [
    "/dashboard",
    "/bookings",
    "/businesses",
  ],

  freelancer: [
    "/dashboard",
    "/bookings",
    "/businesses",
  ],

  staff: [
    "/attendence",
    "/appointments",
  ],
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Staff dashboard redirect fix
  if (role === "staff" && location.pathname === "/dashboard") {
    return <Navigate to="/attendence" replace />;
  }

  // ✅ super_admin full access
  if (role === "super_admin") {
    return children;
  }

  const allowedRoutes = roleAccessMap[role] || [];

  const isAllowed = allowedRoutes.some(
    (path) =>
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
  );

  if (!isAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
