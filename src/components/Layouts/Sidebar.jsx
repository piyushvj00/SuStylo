import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  UserCog,
  Settings,
  Store,
  LogOut,
  ChevronDown,
  Phone,
  FileText,
  Building,
  Star,
  Award,
} from "lucide-react";

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const [isItemsOpen, setItemsOpen] = useState(false);

  const toggleItems = () => {
    setItemsOpen(!isItemsOpen);
  };

  // Check if current path matches or starts with the given path
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Check if any items subitem is active
  const isItemsActive = () => {
    return itemsSubItems.some(item => isActive(item.path));
  };

  const menuItems = [
    { name: "Dashboard", Icon: Home, path: "/dashboard" }, 
    { name: "Customer", Icon: Users, path: "/users" },
    { name: "Coupons", Icon: ShoppingCart, path: "/coupons" },
    { name: "Referral", Icon: Award, path: "/referral" },
    { name: "Contact", Icon: Phone, path: "/contact" },
    { name: "Blog", Icon: FileText, path: "/blog" },
    // { name: "Businesses", Icon: Building, path: "/businesses" },
    { name: "Reviews", Icon: Star, path: "/reviews" },
    { name: "Settings", Icon: Settings, path: "/setting" },
    // { name: "Coupons", Icon: Settings, path: "/coupons" },
    { name: "Attendence", Icon: Settings, path: "/attendence" },
    { name: "Appointments", Icon: Settings, path: "/appointments" },
    { name: "Leads", Icon: Settings, path: "/leads" },
    { name: "Salons", Icon: Settings, path: "/salons" },
  ];

  const itemsSubItems = [
    { name: "Categories", path: "/items/categories" },
    { name: "Menu Items", path: "/items/menu-items" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 text-green-600 text-2xl font-bold whitespace-nowrap overflow-hidden transition-all duration-300">
        {isCollapsed ? 'A' : 'Admin'}
      </div>


      <nav className="flex-1 space-y-2 px-4 overflow-y-auto overflow-x-hidden">
        {menuItems.map(({ name, Icon, path }) => (
          <div key={name}>
            {name === "Items" ? (
              <>
                <div
                  className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${isItemsActive()
                      ? 'bg-green-50 text-green-600'
                      : 'text-gray-700 hover:text-green-600'
                    }`}
                  onClick={toggleItems}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={18} className="flex-shrink-0" />
                    <span className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                      }`}>
                      {name}
                    </span>
                  </div>
                  {!isCollapsed && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isItemsOpen ? "rotate-180" : ""
                        }`}
                    />
                  )}
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isItemsOpen && !isCollapsed ? 'max-h-96' : 'max-h-0'
                  }`}>
                  <div className="ml-6 mt-1 space-y-1 text-sm">
                    {itemsSubItems.map(({ name, path }) => (
                      <Link
                        to={path}
                        key={name}
                        className={`block py-1 transition-colors duration-200 ${isActive(path)
                            ? 'text-green-600 font-medium'
                            : 'text-gray-600 hover:text-green-600'
                          }`}
                      >
                        – {name}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : path ? (
              <Link
                to={path}
                className={`flex items-center p-2 rounded-md transition-colors duration-200 ${isActive(path)
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
                  }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                  }`}>
                  {name}
                </span>
              </Link>

            ) : (
              <div className="flex items-center p-2 rounded-md hover:bg-gray-100 
                text-gray-700 hover:text-green-600 cursor-pointer transition-colors duration-200">
                <Icon size={18} className="flex-shrink-0" />
                <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                  }`}>
                  {name}
                </span>
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;