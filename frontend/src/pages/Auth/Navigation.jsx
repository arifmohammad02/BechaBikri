import { useEffect, useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaCartShopping } from "react-icons/fa6";
import { MdHome } from "react-icons/md";
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

  // console.log(cartItems);

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
        <div className="w-full fixed top-0 left-0 z-50 bg-white border-b mb-1 px-3 sm:px-0">
          <div className="flex justify-between items-center py-4 container mx-auto text-black">
            <Link to="/">
              <span className="font-normal text-[#B88E2F] font-poppins text-base">
                EonlineSolution
              </span>
            </Link>
            {/* User Login / Cart / Favorites */}
            {!userInfo ? (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="text-[#242424] hover:text-[#B88E2F] font-poppins font-normal transition-all duration-300 ease-in-out"
                >
                  Login
                </Link>
                <Link
                  to="/"
                  className="flex items-center font-poppins font-normal text-[#242424] group hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
                  onClick={handleItemClick}
                >
                  Home
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center group hover:text-yellow-500 transition-all duration-300 ease-in-out"
                  onClick={handleItemClick}
                >
                  <div className="relative flex">
                    <FaCartShopping
                      className="flex-none text-black"
                      size={20}
                    />
                    <div className="absolute -top-2 left-5">
                      <span className="text-sm font-semibold">
                        {cartItems?.length > 0 && (
                          <span className="absolute -top-2 left-5 px-1 py-0 text-sm text-white bg-[#B88E2F] rounded-full">
                            {cartItems.length}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
                <div>
                  <Link
                    to="/favorite"
                    className="flex items-center group hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
                    onClick={handleItemClick}
                  >
                    <div className="relative flex">
                      <FaHeart className="flex-none text-[#242424]" size={20} />
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
                  className="flex items-center group hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
                  onClick={handleItemClick}
                >
                  <div className="relative flex">
                    <FaCartShopping
                      className="flex-none text-[#242424] hover:text-[#B88E2F]"
                      size={20}
                    />
                    <div className="absolute -top-2 left-5">
                      <span className="text-sm font-semibold">
                        {cartItems?.length > 0 && (
                          <span className="relative bottom-2  right-1 px-1.5 py-0    inline-flex items-center justify-center mx-auto font-semibold bg-[#B88E2F] text-sm text-white rounded-full">
                            {cartItems.length}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
                <div>
                  <Link
                    to="/favorite"
                    className="flex items-center group hover:text-[#B88E2F]transition-all duration-300 ease-in-out"
                    onClick={handleItemClick}
                  >
                    <div className="relative flex">
                      <FaHeart
                        className="flex-none text-[#242424] hover:text-[#B88E2F] "
                        size={20}
                      />
                      <div className="absolute -top-[42px] left-2">
                        <FavoritesCount />
                      </div>
                    </div>
                  </Link>
                </div>
                <button
                  onClick={toggleMenu}
                  className="text-[#242424] hover:text-[#B88E2F] "
                >
                  {isMenuOpen ? <FaBarsStaggered /> : <FaBarsStaggered />}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Sidebar/Menu */}
      <div
        className={`${
          isMobile
            ? isMenuOpen
              ? "fixed top-0 left-0 bottom-0 w-64 bg-[#F9F1E7] z-50 p-4 h-full flex flex-col justify-between"
              : "hidden"
            : "lg:hidden fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out bg-black text-white p-4 w-16 lg:w-20 xl:w-24 flex flex-col justify-between z-50"
        }`}
      >
        {/* Close Button */}
        {isMenuOpen && (
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-[#242424] hover:text-[#B88E2F]"
          >
            <FaTimes size={24} />
          </button>
        )}

        {/* Sidebar Items */}
        <div className="flex flex-col bg space-y-6 mt-8">
          <Link
            to="/"
            className="flex items-center group hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
            onClick={handleItemClick}
          >
            <MdHome className="flex-none text-[#242424]" size={26} />
            <span className="ml-4 opacity-100 text-[#242424] transform transition-all duration-300 ease-in-out text-sm font-normal font-poppins ">
              Home
            </span>
          </Link>
          <Link
            to="/shop"
            className="flex items-center group hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
            onClick={handleItemClick}
          >
            <AiOutlineShopping className="flex-none text-[#242424]" size={26} />
            <span className="ml-4 opacity-100 transform transition-all duration-300 ease-in-out text-sm font-normal font-poppins text-[#242424]">
              Shop
            </span>
          </Link>
          <Link
            to="/cart"
            className="flex items-center group hover:text-yellow-500 transition-all duration-300 ease-in-out"
            onClick={handleItemClick}
          >
            <div className="relative flex">
              <FaCartShopping className="flex-none text-[#242424]" size={26} />
              <span className="ml-4 opacity-100 transform transition-all duration-300 ease-in-out text-sm font-normal font-poppins text-[#242424]">
                Cart
              </span>
              <div className="absolute -top-2 left-5">
                <span className="text-sm font-semibold">
                  {cartItems?.length > 0 && (
                    <span className="relative py-0 px-1.5 text-sm text-white bg-[#B88E2F] rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </Link>
          <div>
            <Link
              to="/favorite"
              className="flex items-center group hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
              onClick={handleItemClick}
            >
              <div className="relative flex">
                <FaHeart className="flex-none text-[#242424]" size={26} />
                <span className="ml-4 opacity-100 transform transition-all duration-300 ease-in-out text-sm font-normal font-poppins text-[#242424]">
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
                className="flex items-center gap-2 hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
              >
                <div className="flex items-center">
                  <FaUser className="flex-none text-[#242424]" size={26} />
                  <span className="ml-4 text-sm  flex  font-normal font-poppins ">
                    {userInfo?.username}
                    <div className="ml-1 flex items-center">
                      {tabOpen ? (
                        <FaAngleUp className="text-[#242424]" size={16} />
                      ) : (
                        <FaAngleDown className="text-[#242424]" size={16} />
                      )}
                    </div>
                  </span>
                </div>
              </button>
              {tabOpen && userInfo && (
                <div className="space-y-2 text-white rounded-b-md  mt-1 py-2">
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
                        <FaUsers
                          className="flex-none text-[#242424]"
                          size={26}
                        />
                        <span className="ml-4 text-sm text-[#242424]">
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
                    <FaUserCircle
                      className="flex-none text-[#242424]"
                      size={26}
                    />
                    <span className="ml-4 text-sm font-normal text-[#242424] font-poppins">
                      Profile
                    </span>
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="flex items-center hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
                  >
                    <FaSignOutAlt
                      className="flex-none text-[#242424]"
                      size={26}
                    />
                    <span className="ml-4 text-[#242424] text-sm font-normal font-poppins">
                      Logout
                    </span>
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
    <div className="w-full fixed top-0 left-0 z-50 bg-white text-black border-b">
      <div className="container mx-auto flex justify-between items-center py-4">
        {/* Logo */}
        <div>
          <Link
            to="/"
            className="font-normal text-[#B88E2F] font-poppins text-lg"
          >
            EonlineSolution
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6">
          <Link
            to="/"
            className="hover:text-[#B88E2F] text-[#242424] text-base font-poppins font-normal transition-all duration-300 ease-in-out"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="hover:text-[#B88E2F] text-[#242424] text-base font-poppins font-normal transition-all duration-300 ease-in-out"
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="hover:text-[#B88E2F] text-[#242424] text-base font-poppins font-normal transition-all duration-300 ease-in-out"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="hover:text-[#B88E2F] text-[#242424] text-base font-poppins font-normal transition-all duration-300 ease-in-out"
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
                className="hover:text-[#B88E2F] text-[#242424] text-base font-poppins font-normal transition-all duration-300 ease-in-out"
              >
                <AiOutlineLogin size={24} />
              </Link>

              {/* Favorites */}
              <Link
                to="/favorite"
                className="relative flex items-center hover:text-[#B88E2F] text-[#242424] text-base font-poppins font-normal transition-all duration-300 ease-in-out"
              >
                <FaHeart size={24} />
                <div className="absolute -top-[42px] left-2">
                  <FavoritesCount />
                </div>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center hover:text-[#B88E2F] text-[#242424] text-base font-poppins font-normal transition-all duration-300 ease-in-out"
              >
                <FaCartShopping size={24} />
                {cartItems?.length > 0 && (
                  <span className="absolute -top-2 left-5 px-1 py-0 text-sm text-white bg-purple-500 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              {/* Favorites */}
              <Link
                to="/favorite"
                className="relative flex items-center hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
              >
                <FaHeart size={24} />
                <div className="absolute -top-[42px] left-2">
                  <FavoritesCount />
                </div>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
              >
                <FaCartShopping size={24} />
                {cartItems?.length > 0 && (
                  <span
                    className="absolute -top-2 left-5  font-normal font-poppins py-0 px-1.5  text-sm text-white bg-[#B88E2F]
                  rounded-full"
                  >
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={toggleTab}
                  className="hover:text-[#B88E2F] text-[#242424] transition-all duration-300 ease-in-out"
                >
                  <FaUserCircle size={24} />
                </button>
                {tabOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md p-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center hover:text-[#B88E2F] text-[#242424] transition-all duration-300 ease-in-out pb-3"
                      onClick={handleItemClick}
                    >
                      <FaUserCircle className="flex-none " size={26} />
                      <span className="ml-4 text-sm font-poppins font-normal">
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
                      className="flex items-center hover:text-[#B88E2F] text-[#242424] transition-all duration-300 ease-in-out"
                    >
                      <FaSignOutAlt className="flex-none" size={26} />
                      <span className="ml-4  text-sm font-poppins font-normal">
                        Logout
                      </span>
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
