
// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Home,
//   Users,
//   ShoppingCart,
//   Settings,
//   Phone,
//   FileText,
//   Building,
//   ImageIcon,
//   Calendar,
//   ChevronDown,
// } from "lucide-react";

// const Sidebar = ({ isCollapsed }) => {
//   const location = useLocation();
//   const [isBusinessOpen, setBusinessOpen] = useState(true);
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     const userRole = localStorage.getItem("role");
//     setRole(userRole);
//   }, []);

//   const toggleBusiness = () => {
//     setBusinessOpen(!isBusinessOpen);
//   };

//   const isActive = (path) => {
//     return (
//       location.pathname === path ||
//       location.pathname.startsWith(`${path}/`)
//     );
//   };

//   const menuItems = [
//     { name: "Dashboard", Icon: Home, path: "/dashboard" },
//     { name: "Customer", Icon: Users, path: "/users" },
//     { name: "Coupons", Icon: ShoppingCart, path: "/coupons" },
//     { name: "Contact", Icon: Phone, path: "/contact" },
//     { name: "Blog", Icon: FileText, path: "/blog" },
//     { name: "Banners", Icon: ImageIcon, path: "/banners" },
//     { name: "Attendence", Icon: Settings, path: "/attendence" },
//     { name: "Appointments", Icon: Settings, path: "/appointments" },
//     { name: "Leads", Icon: Settings, path: "/leads" },
//     { name: "Bookings", Icon: Calendar, path: "/bookings" },
//   ];

//   const businessSubItems = [
//     { name: "Salons", Icon: Building, path: "/businesses/salons" },
//     { name: "Freelancers", Icon: Users, path: "/businesses/freelancers" },
//   ];

//   // 🔐 Role based filtering
//   const getVisibleMenuItems = () => {
//     if (role === "super_admin") return menuItems;

//     if (role === "admin" || role === "freelancer") {
//       return menuItems.filter((item) =>
//         ["Dashboard", "Bookings"].includes(item.name)
//       );
//     }

//     if (role === "staff") {
//       return menuItems.filter((item) =>
//         ["Attendence", "Appointments"].includes(item.name)
//       );
//     }

//     return [];
//   };

//   const visibleMenuItems = getVisibleMenuItems();

//   const showBusinesses =
//     role === "super_admin" || role === "admin" || role === "freelancer";

//   const isBusinessActive = () => {
//     return businessSubItems.some((item) => isActive(item.path));
//   };

//   return (
//     <div className="h-full flex flex-col">
//       <div className="p-6 text-green-600 text-2xl font-bold whitespace-nowrap overflow-hidden transition-all duration-300">
//         {isCollapsed ? "A" : "Admin"}
//       </div>

//       <nav className="flex-1 space-y-2 px-4 overflow-y-auto overflow-x-hidden">
//         {visibleMenuItems.map(({ name, Icon, path }) => (
//           <Link
//             to={path}
//             key={name}
//             className={`flex items-center p-2 rounded-md transition-colors duration-200 ${isActive(path)
//               ? "bg-green-50 text-green-600"
//               : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
//               }`}
//           >
//             <Icon size={18} className="flex-shrink-0" />
//             <span
//               className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"
//                 }`}
//             >
//               {name}
//             </span>
//           </Link>
//         ))}

//         {/* 🏢 Businesses Section */}
//         {showBusinesses && (
//           <div>
//             <div
//               className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${isBusinessActive()
//                 ? "bg-green-50 text-green-600"
//                 : "text-gray-700 hover:text-green-600"
//                 }`}
//               onClick={toggleBusiness}
//             >
//               <div className="flex items-center space-x-3">
//                 <Building size={18} className="flex-shrink-0" />
//                 <span
//                   className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"
//                     }`}
//                 >
//                   Businesses
//                 </span>
//               </div>
//               {!isCollapsed && (
//                 <ChevronDown
//                   size={16}
//                   className={`transition-transform duration-200 ${isBusinessOpen ? "rotate-180" : ""
//                     }`}
//                 />
//               )}
//             </div>

//             <div
//               className={`overflow-hidden transition-all duration-300 ease-in-out ${isBusinessOpen && !isCollapsed ? "max-h-96" : "max-h-0"
//                 }`}
//             >
//               <div className="ml-6 mt-1 space-y-1 text-sm">
//                 {businessSubItems.map(({ name, Icon, path }) => (
//                   <Link
//                     to={path}
//                     key={name}
//                     className={`flex items-center py-1 transition-colors duration-200 ${isActive(path)
//                       ? "text-green-600 font-medium"
//                       : "text-gray-600 hover:text-green-600"
//                       }`}
//                   >
//                     <Icon size={14} className="mr-2" />
//                     {name}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;




import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  ShoppingCart,
  Settings,
  Phone,
  FileText,
  Building,
  ImageIcon,
  Calendar,
  ChevronDown,
} from "lucide-react";

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const [isBusinessOpen, setBusinessOpen] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  const toggleBusiness = () => {
    setBusinessOpen(!isBusinessOpen);
  };

  const isActive = (path) => {
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const menuItems = [
    { name: "Dashboard", Icon: Home, path: "/dashboard" },
    { name: "Customer", Icon: Users, path: "/users" },
    { name: "Coupons", Icon: ShoppingCart, path: "/coupons" },
    { name: "Contact", Icon: Phone, path: "/contact" },
    { name: "Blog", Icon: FileText, path: "/blog" },
    { name: "Banners", Icon: ImageIcon, path: "/banners" },
    { name: "Attendence", Icon: Settings, path: "/attendence" },
    { name: "Appointments", Icon: Settings, path: "/appointments" },
    { name: "Leads", Icon: Settings, path: "/leads" },
    { name: "Bookings", Icon: Calendar, path: "/bookings" },
  ];

  const businessSubItems = [
    { name: "Salons", Icon: Building, path: "/businesses/salons" },
    { name: "Freelancers", Icon: Users, path: "/businesses/freelancers" },
  ];

  // 🔐 Role based filtering (ONLY CHANGE HERE)
  const getVisibleMenuItems = () => {
    if (role === "super_admin") {
      return menuItems.filter(
        (item) =>
          !["Attendence", "Appointments"].includes(item.name)
      );
    }

    if (role === "admin" || role === "freelancer") {
      return menuItems.filter((item) =>
        ["Dashboard", "Bookings"].includes(item.name)
      );
    }

    if (role === "staff") {
      return menuItems.filter((item) =>
        ["Attendence", "Appointments"].includes(item.name)
      );
    }

    return [];
  };

  const visibleMenuItems = getVisibleMenuItems();

  // ✅ Businesses should remain visible
  const showBusinesses =
    role === "super_admin" || role === "admin" || role === "freelancer";

  const isBusinessActive = () => {
    return businessSubItems.some((item) => isActive(item.path));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 text-green-600 text-2xl font-bold whitespace-nowrap overflow-hidden transition-all duration-300">
        {isCollapsed ? "A" : "Admin"}
      </div>

      <nav className="flex-1 space-y-2 px-4 overflow-y-auto overflow-x-hidden">
        {visibleMenuItems.map(({ name, Icon, path }) => (
          <Link
            to={path}
            key={name}
            className={`flex items-center p-2 rounded-md transition-colors duration-200 ${isActive(path)
                ? "bg-green-50 text-green-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
              }`}
          >
            {/* ✅ Icon always used */}
            {Icon && <Icon size={18} className="flex-shrink-0" />}

            <span
              className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"
                }`}
            >
              {name}
            </span>
          </Link>
        ))}


        {/* 🏢 Businesses Section (UNCHANGED) */}
        {showBusinesses && (
          <div>
            <div
              className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${isBusinessActive()
                  ? "bg-green-50 text-green-600"
                  : "text-gray-700 hover:text-green-600"
                }`}
              onClick={toggleBusiness}
            >
              <div className="flex items-center space-x-3">
                <Building size={18} className="flex-shrink-0" />
                <span
                  className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"
                    }`}
                >
                  Businesses
                </span>
              </div>
              {!isCollapsed && (
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isBusinessOpen ? "rotate-180" : ""
                    }`}
                />
              )}
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isBusinessOpen && !isCollapsed ? "max-h-96" : "max-h-0"
                }`}
            >
              <div className="ml-6 mt-1 space-y-1 text-sm">
                {businessSubItems.map(({ name, path }) => (
                  <Link
                    to={path}
                    key={name}
                    className={`flex items-center py-1 transition-colors duration-200 ${isActive(path)
                        ? "text-green-600 font-medium"
                        : "text-gray-600 hover:text-green-600"
                      }`}
                  >
                    {name}
                  </Link>
                ))}


              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
