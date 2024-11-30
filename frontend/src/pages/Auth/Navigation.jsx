import { useEffect, useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import {
  FaTachometerAlt,
  FaBox,
  FaListAlt,
  FaClipboardList,
  FaUsers,
  FaUser,
  FaUserCircle,
  FaSignOutAlt,
  FaAngleUp,
  FaAngleDown,
  FaTimes,
} from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "@redux/api/usersApiSlice";
import FavoritesCount from "../Products/FavoritesCount";
import { logout } from "@redux/features/auth/authSlice";

const Navigation = ({ isMenuOpen, setIsMenuOpen }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [tabOpen, setTabOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Menu toggle function
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Tab toggle function
  const toggleTab = () => {
    setTabOpen(!tabOpen);
  };

  // Handle screen resize and set isMobile state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  // Close menu on item click for mobile view
  const handleItemClick = () => {
    if (isMobile) {
      setIsMenuOpen(false); // Close menu for mobile view
    }
  };

  const MobileHeader = (
    <div>
      {/* Mobile Header */}
      {isMobile && (
        <div className="w-full fixed top-0 left-0 z-50 bg-black px-3 sm:px-0">
          <div className="flex justify-between items-center py-4 container mx-auto text-white">
            <Link to="/">
              <span className="font-semibold">MySite</span>
            </Link>
            {/* User Login / Cart / Favorites */}
            {!userInfo ? (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="text-white hover:text-blue-500 transition-all duration-300 ease-in-out"
                >
                  Login
                </Link>
                <Link
                  to="/"
                  className="flex items-center group hover:text-blue-500 transition-all duration-300 ease-in-out"
                  onClick={handleItemClick}
                >
                  <AiOutlineHome className="flex-none text-white" size={26} />
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center group hover:text-yellow-500 transition-all duration-300 ease-in-out"
                  onClick={handleItemClick}
                >
                  <div className="relative flex">
                    <AiOutlineShoppingCart
                      className="flex-none text-white"
                      size={26}
                    />
                    <div className="absolute -top-2 left-5">
                      <span className="text-sm font-semibold">
                        {cartItems?.length > 0 && (
                          <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                            {cartItems.reduce((acc,) => acc + item.qty, 0)}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
                <div>
                  <Link
                    to="/favorite"
                    className="flex items-center group hover:text-red-500 transition-all duration-300 ease-in-out"
                    onClick={handleItemClick}
                  >
                    <div className="relative flex">
                      <FaHeart className="flex-none text-white" size={26} />
                      <div className="absolute -top-[42px] left-2">
                        <FavoritesCount />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link
                  to="/cart"
                  className="flex items-center group hover:text-yellow-500 transition-all duration-300 ease-in-out"
                  onClick={handleItemClick}
                >
                  <div className="relative flex">
                    <AiOutlineShoppingCart
                      className="flex-none text-white"
                      size={26}
                    />
                    <div className="absolute -top-2 left-5">
                      <span className="text-sm font-semibold">
                        {cartItems?.length > 0 && (
                          <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                            {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
                <div>
                  <Link
                    to="/favorite"
                    className="flex items-center group hover:text-red-500 transition-all duration-300 ease-in-out"
                    onClick={handleItemClick}
                  >
                    <div className="relative flex">
                      <FaHeart className="flex-none text-white" size={26} />
                      <div className="absolute -top-[42px] left-2">
                        <FavoritesCount />
                      </div>
                    </div>
                  </Link>
                </div>
                <button onClick={toggleMenu} className="text-white">
                  {isMenuOpen ? <FaBarsStaggered /> : <FaBarsStaggered />}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Sidebar/Menu */}
      <div
        className={`${isMobile
          ? isMenuOpen
            ? "fixed top-0 left-0 bottom-0 w-64 bg-black z-50 p-4 h-full flex flex-col justify-between"
            : "hidden"
          : "lg:hidden fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out bg-black text-white p-4 w-16 lg:w-20 xl:w-24 flex flex-col justify-between z-50"
          }`}
      >
        {/* Close Button */}
        {isMenuOpen && (
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-white"
          >
            <FaTimes size={24} />
          </button>
        )}

        {/* Sidebar Items */}
        <div className="flex flex-col space-y-6 mt-8">
          <Link
            to="/"
            className="flex items-center group hover:text-blue-500 transition-all duration-300 ease-in-out"
            onClick={handleItemClick}
          >
            <AiOutlineHome className="flex-none text-white" size={26} />
            <span className="ml-4 opacity-100 transform transition-all duration-300 ease-in-out text-sm font-semibold text-white">
              Home
            </span>
          </Link>
          <Link
            to="/shop"
            className="flex items-center group hover:text-green-500 transition-all duration-300 ease-in-out"
            onClick={handleItemClick}
          >
            <AiOutlineShopping className="flex-none text-white" size={26} />
            <span className="ml-4 opacity-100 transform transition-all duration-300 ease-in-out text-sm font-semibold text-white">
              Shop
            </span>
          </Link>
          <Link
            to="/cart"
            className="flex items-center group hover:text-yellow-500 transition-all duration-300 ease-in-out"
            onClick={handleItemClick}
          >
            <div className="relative flex">
              <AiOutlineShoppingCart
                className="flex-none text-white"
                size={26}
              />
              <span className="ml-4 opacity-100 transform transition-all duration-300 ease-in-out text-sm font-semibold text-white">
                Cart
              </span>
              <div className="absolute -top-2 left-5">
                <span className="text-sm font-semibold">
                  {cartItems?.length > 0 && (
                    <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </Link>
          <div>
            <Link
              to="/favorite"
              className="flex items-center group hover:text-red-500 transition-all duration-300 ease-in-out"
              onClick={handleItemClick}
            >
              <div className="relative flex">
                <FaHeart className="flex-none text-white" size={26} />
                <span className="ml-4 opacity-100 transform transition-all duration-300 ease-in-out text-sm font-semibold text-white">
                  Favorites
                </span>
                <div className="absolute -top-[42px] left-2">
                  <FavoritesCount />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* User Info (Profile, Logout) */}
        <div className="relative group">
          {userInfo ? (
            <>
              <button
                onClick={toggleTab}
                className="flex items-center gap-2 hover:text-purple-500 transition-all duration-300 ease-in-out"
              >
                <div className="flex items-center">
                  <FaUser className="flex-none text-white" size={26} />
                  <span className="ml-4 text-sm font-semibold flex text-white">
                    {userInfo?.username}
                    <div className="ml-1 flex items-center">
                      {tabOpen ? (
                        <FaAngleUp className="text-white" size={16} />
                      ) : (
                        <FaAngleDown className="text-white" size={16} />
                      )}
                    </div>
                  </span>
                </div>
              </button>
              {tabOpen && userInfo && (
                <div className="space-y-2 text-white rounded-b-md shadow-lg mt-1 py-2">
                  <button
                    onClick={toggleTab} // Close tab when clicked
                    className="absolute top-2 right-2 text-white"
                  ></button>
                  {userInfo.isAdmin && (
                    <div className="flex flex-col space-y-6 mb-8">
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center hover:text-lime-300 transition-all duration-300 ease-in-out"
                        onClick={handleItemClick}
                      >
                        <FaTachometerAlt className="flex-none" size={26} />
                        <span className="ml-4 text-sm font-semibold">
                          Dashboard
                        </span>
                      </Link>
                      <Link
                        to="/admin/productlist"
                        className="flex items-center hover:text-orange-500 transition-all duration-300 ease-in-out"
                        onClick={handleItemClick}
                      >
                        <FaBox className="flex-none" size={26} />
                        <span className="ml-4 text-sm font-semibold">
                          Products
                        </span>
                      </Link>
                      <Link
                        to="/admin/categorylist"
                        className="flex items-center hover:text-orange-500 transition-all duration-300 ease-in-out"
                        onClick={handleItemClick}
                      >
                        <FaListAlt className="flex-none" size={26} />
                        <span className="ml-4 text-sm font-semibold">
                          Category
                        </span>
                      </Link>
                      <Link
                        to="/admin/orderlist"
                        className="flex items-center hover:text-orange-500 transition-all duration-300 ease-in-out"
                        onClick={handleItemClick}
                      >
                        <FaClipboardList className="flex-none" size={26} />
                        <span className="ml-4 text-sm font-semibold">
                          Orders
                        </span>
                      </Link>
                      <Link
                        to="/admin/userlist"
                        className="flex items-center hover:text-orange-500 transition-all duration-300 ease-in-out"
                        onClick={handleItemClick}
                      >
                        <FaUsers className="flex-none" size={26} />
                        <span className="ml-4 text-sm font-semibold">
                          Users
                        </span>
                      </Link>
                    </div>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center hover:text-emerald-500 transition-all duration-300 ease-in-out"
                    onClick={handleItemClick}
                  >
                    <FaUserCircle className="flex-none " size={26} />
                    <span className="ml-4 text-sm font-semibold">Profile</span>
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="flex items-center hover:text-fuchsia-400 transition-all duration-300 ease-in-out"
                  >
                    <FaSignOutAlt className="flex-none" size={26} />
                    <span className="ml-4 text-sm font-semibold">Logout</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <ul className="flex flex-col space-y-6 mb-8">
              <li>
                <Link
                  to="/login"
                  className="flex items-center hover:text-purple-500 transition-all duration-300 ease-in-out"
                >
                  <AiOutlineLogin className="flex-none text-white" size={26} />
                  <span className="ml-4 text-sm font-semibold text-white">
                    Login
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center hover:text-pink-500 transition-all duration-300 ease-in-out"
                >
                  <AiOutlineUserAdd
                    className="flex-none text-white "
                    size={26}
                  />
                  <span className="ml-4 text-sm font-semibold text-white">
                    Register
                  </span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );

  const DesktopHeader = (
    <div className="w-full fixed top-0 left-0 z-50 bg-white text-black shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4">
        {/* Logo */}
        <div>
          <Link to="/" className="font-bold text-lg text-black">
            MySite
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6">
          <Link
            to="/"
            className="hover:text-blue-500 transition-all duration-300 ease-in-out"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="hover:text-green-500 transition-all duration-300 ease-in-out"
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="hover:text-purple-500 transition-all duration-300 ease-in-out"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="hover:text-yellow-500 transition-all duration-300 ease-in-out"
          >
            Contact Us
          </Link>
        </div>

        {/* Icons Section */}
        <div className="flex items-center gap-6">
          {!userInfo ? (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="hover:text-blue-500 transition-all duration-300 ease-in-out"
              >
                <AiOutlineLogin size={24} />
              </Link>

              {/* Favorites */}
              <Link
                to="/favorite"
                className="relative flex items-center hover:text-red-500 transition-all duration-300 ease-in-out"
              >
                <FaHeart size={24} />
                <div className="absolute -top-[42px] left-2">
                  <FavoritesCount />
                </div>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center hover:text-yellow-500 transition-all duration-300 ease-in-out"
              >
                <AiOutlineShoppingCart size={24} />
                {cartItems?.length > 0 && (
                  <span className="absolute -top-2 left-5 px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                    {cartItems && cartItems.length > 0
                      ? cartItems.reduce((acc, item) => acc + item.qty, 0)
                      : 0}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              {/* Favorites */}
              <Link
                to="/favorite"
                className="relative flex items-center hover:text-red-500 transition-all duration-300 ease-in-out"
              >
                <FaHeart size={24} />
                <div className="absolute -top-[42px] left-2">
                  <FavoritesCount />
                </div>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center hover:text-yellow-500 transition-all duration-300 ease-in-out"
              >
                <AiOutlineShoppingCart size={24} />
                {cartItems?.length > 0 && (
                  <span className="absolute -top-2 left-5 px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={toggleTab}
                  className="hover:text-purple-500 transition-all duration-300 ease-in-out"
                >
                  <FaUserCircle size={24} />
                </button>
                {tabOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center hover:text-emerald-500 transition-all duration-300 ease-in-out pb-3"
                      onClick={handleItemClick}
                    >
                      <FaUserCircle className="flex-none " size={26} />
                      <span className="ml-4 text-sm font-semibold">
                        Profile
                      </span>
                    </Link>
                    {userInfo.isAdmin && (
                      <div className="flex flex-col space-y-6 mb-8">
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center hover:text-lime-300 transition-all duration-300 ease-in-out"
                          onClick={handleItemClick}
                        >
                          <FaTachometerAlt className="flex-none" size={26} />
                          <span className="ml-4 text-sm font-semibold">
                            Dashboard
                          </span>
                        </Link>
                        <Link
                          to="/admin/productlist"
                          className="flex items-center hover:text-orange-500 transition-all duration-300 ease-in-out"
                          onClick={handleItemClick}
                        >
                          <FaBox className="flex-none" size={26} />
                          <span className="ml-4 text-sm font-semibold">
                            Products
                          </span>
                        </Link>
                        <Link
                          to="/admin/categorylist"
                          className="flex items-center hover:text-orange-500 transition-all duration-300 ease-in-out"
                          onClick={handleItemClick}
                        >
                          <FaListAlt className="flex-none" size={26} />
                          <span className="ml-4 text-sm font-semibold">
                            Category
                          </span>
                        </Link>
                        <Link
                          to="/admin/orderlist"
                          className="flex items-center hover:text-orange-500 transition-all duration-300 ease-in-out"
                          onClick={handleItemClick}
                        >
                          <FaClipboardList className="flex-none" size={26} />
                          <span className="ml-4 text-sm font-semibold">
                            Orders
                          </span>
                        </Link>
                        <Link
                          to="/admin/userlist"
                          className="flex items-center hover:text-orange-500 transition-all duration-300 ease-in-out"
                          onClick={handleItemClick}
                        >
                          <FaUsers className="flex-none" size={26} />
                          <span className="ml-4 text-sm font-semibold">
                            Users
                          </span>
                        </Link>
                      </div>
                    )}
                    <button
                      onClick={logoutHandler}
                      className="flex items-center hover:text-fuchsia-400 transition-all duration-300 ease-in-out"
                    >
                      <FaSignOutAlt className="flex-none" size={26} />
                      <span className="ml-4 text-sm font-semibold">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return isMobile ? MobileHeader : DesktopHeader;
};

export default Navigation;
