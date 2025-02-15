import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { LuUsers } from "react-icons/lu";
import { CiShoppingCart } from "react-icons/ci";
import { AiOutlineProduct } from "react-icons/ai";
import { TbCategory2 } from "react-icons/tb";
import { MdOutlineDashboard } from "react-icons/md";

const AdminMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Disable body scroll when sidebar is open
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1536) {
        // 2xl breakpoint
        setIsSidebarOpen(false); // Close the sidebar on 2xl screens
      }
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Scroll Lock: Locking scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.documentElement.style.overflow = "hidden"; // Lock scroll
    } else {
      document.documentElement.style.overflow = ""; // Unlock scroll
    }

    return () => {
      document.documentElement.style.overflow = ""; // Clean up on unmount
    };
  }, [isSidebarOpen]);
  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-24 left-4 z-50 p-2 bg-white rounded-full shadow-lg 2xl:hidden`}
      >
        {isSidebarOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
      </button>

      {/* Sidebar */}
      <section
        className={`bg-[#F3F6F9] fixed top-0 left-0 h-screen mt-20 border-r-2 border-black border-opacity-20 flex flex-col items-center py-4 min-w-[190px] transition-transform duration-30  z-30 ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full 2xl:translate-x-0"
        }`}
      >
        {/* Navigation Links */}
        <ul className="flex flex-col w-full items-start space-y-6 pl-2 mt-6">
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-3 py-2 px-3 w-full rounded-lg group ${
                  isActive
                    ? "border-2 border-blue-500 text-black bg-white"
                    : "text-black hover:bg-gray-200"
                }`
              }
            >
              <MdOutlineDashboard />
              <span className="text-[16px] font-semibold font-figtree">
                Dashboard
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/categorylist"
              className={({ isActive }) =>
                `flex items-center space-x-3 py-2 px-3 w-full rounded-lg group ${
                  isActive
                    ? "border-2 border-blue-500 text-black bg-white"
                    : "text-black hover:bg-gray-200"
                }`
              }
            >
              <TbCategory2 />
              <span className="text-[16px] font-semibold font-figtree">
                Categories
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/allproductslist"
              className={({ isActive }) =>
                `flex items-center space-x-3 py-2 px-3 w-full rounded-lg group ${
                  isActive
                    ? "border-2 border-blue-500 text-black bg-white"
                    : "text-black hover:bg-gray-200"
                }`
              }
            >
              <AiOutlineProduct />
              <span className="text-[16px] font-semibold font-figtree">
                All Products
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/productlist"
              className={({ isActive }) =>
                `flex items-center space-x-3 py-2 px-3 w-full rounded-lg group ${
                  isActive
                    ? "border-2 border-blue-500 text-black bg-white"
                    : "text-black hover:bg-gray-200"
                }`
              }
            >
              <AiOutlineProduct />
              <span className="text-[16px] font-semibold font-figtree">
                Create Product
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/userlist"
              className={({ isActive }) =>
                `flex items-center space-x-3 py-2 px-3 w-full rounded-lg group ${
                  isActive
                    ? "border-2 border-blue-500 text-black bg-white"
                    : "text-black hover:bg-gray-200"
                }`
              }
            >
              <LuUsers />
              <span className="text-[16px] font-semibold font-figtree">
                Users
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orderlist"
              className={({ isActive }) =>
                `flex items-center space-x-3 py-2 px-3 w-full rounded-lg group ${
                  isActive
                    ? "border-2 border-blue-500 text-black bg-white"
                    : "text-black hover:bg-gray-200"
                }`
              }
            >
              <CiShoppingCart className="text-[20px] text-black font-bold" />
              <span className="text-[16px] font-semibold font-figtree">
                Orders
              </span>
            </NavLink>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AdminMenu;
