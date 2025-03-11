import { useEffect, useState, useRef } from "react";
import { AiOutlineShopping, AiOutlineLogin } from "react-icons/ai";
import { GoSignIn } from "react-icons/go";
import { SlHome } from "react-icons/sl";
import { FaCartShopping } from "react-icons/fa6";
import { MdOutlineDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { LiaClipboardListSolid } from "react-icons/lia";
import { IoIosLogOut } from "react-icons/io";
import { FaAngleUp, FaAngleDown, FaTimes } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "@redux/api/usersApiSlice";
import FavoritesCount from "../Products/FavoritesCount";
import { logout } from "@redux/features/auth/authSlice";
import { MdFavoriteBorder } from "react-icons/md";
import { RiShoppingBagLine } from "react-icons/ri";
import { CiHeart, CiLogin, CiShop, CiUser } from "react-icons/ci";
import { HiOutlineBars3CenterLeft } from "react-icons/hi2";

const Navigation = ({ isMenuOpen, setIsMenuOpen }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [tabOpen, setTabOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null); // Ref for dropdown

  // Define toggleMenu function
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setTabOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  // Close menu and dropdown on item click
  const handleItemClick = () => {
    if (isMobile) {
      setIsMenuOpen(false); // Close menu for mobile view
    }
    setTabOpen(false); // Close dropdown
  };

  // Toggle dropdown
  const toggleTab = () => {
    setTabOpen(!tabOpen);
  };

  // Mobile Header
  const MobileHeader = (
    <div>
      {/* Mobile Header */}
      {isMobile && (
        <div className="w-full fixed top-0 left-0 z-50 bg-white border-b mb-1 px-3 sm:px-0">
          <div className="flex justify-between items-center py-6 container mx-auto text-black">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-[#B88E2F] font-serif text-[20px]">
                <span className="text-3xl text-blue-600 font-bold font-mono">
                  E
                </span>
                onlineSolution
              </span>
            </Link>
            {/* User Login / Cart / Favorites */}
            {!userInfo ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/cart"
                  className="flex items-center group hover:text-yellow-500 transition-all duration-300 ease-in-out"
                  onClick={handleItemClick}
                >
                  <div className="relative flex items-center justify-center w-10 h-10 bg-[#FFF1EE] rounded-full -z-10">
                    <RiShoppingBagLine
                      className="flex-none text-[#EA2B0F]"
                      size={20}
                    />
                    <div className="absolute -top-2 left-5">
                      <span className="text-sm font-semibold">
                        {cartItems?.length > 0 && (
                          <span className="absolute top-1 -right-4 px-1 py-0 text-sm text-white bg-[#B88E2F] rounded-full">
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
                    <div className="relative flex items-center justify-center w-10 h-10 bg-[#FFE4F8] rounded-full -z-10">
                      <MdFavoriteBorder
                        className="flex-none text-[#FF57D0]"
                        size={20}
                      />
                      <div className="absolute -top-[38px] left-3">
                        <FavoritesCount />
                      </div>
                    </div>
                  </Link>
                </div>
                <button
                  onClick={toggleMenu}
                  className="p-[5px] rounded-md backdrop-blur-3xl bg-white/20 border border-gray-500/30
             text-[#242424] text-xl transition-all duration-300 shadow-md flex items-center justify-center hover:bg-gray-400/20"
                >
                  <span className="transition-transform duration-300 ease-in-out transform group-hover:rotate-180">
                    {isMenuOpen ? (
                      <HiOutlineBars3CenterLeft size={22} />
                    ) : (
                      <HiOutlineBars3CenterLeft size={22} />
                    )}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link
                  to="/cart"
                  className="flex items-center group hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
                  onClick={handleItemClick}
                >
                  <div className="relative flex items-center justify-center w-10 h-10 bg-[#FFF1EE] rounded-full -z-10">
                    <RiShoppingBagLine
                      className="flex-none text-[#EA2B0F]"
                      size={20}
                    />
                    <div className="absolute -top-0 left-6">
                      <span className="text-sm font-semibold">
                        {cartItems?.length > 0 && (
                          <span className="relative bottom-2 right-1 px-1.5 py-0 inline-flex items-center justify-center mx-auto font-semibold bg-[#B88E2F] text-sm text-white rounded-full">
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
                    <div className="relative flex items-center justify-center w-10 h-10 bg-[#FFE4F8] rounded-full -z-10">
                      <MdFavoriteBorder
                        className="flex-none text-[#FF57D0] hover:text-[#B88E2F]"
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
                  className="p-[5px] rounded-md backdrop-blur-3xl bg-white/20 border border-gray-500/30
             text-[#242424] text-xl transition-all duration-300 shadow-md flex items-center justify-center hover:bg-gray-400/20"
                >
                  <span className="transition-transform duration-300 ease-in-out transform group-hover:rotate-180">
                    {isMenuOpen ? (
                      <HiOutlineBars3CenterLeft size={22} />
                    ) : (
                      <HiOutlineBars3CenterLeft size={22} />
                    )}
                  </span>
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
            onClick={toggleMenu} // Use toggleMenu here
            className="absolute top-4 right-4 text-[#242424] hover:text-[#B88E2F]"
          >
            <FaTimes size={24} />
          </button>
        )}

        {/* Sidebar Items */}
        <div className="flex flex-col space-y-3 mt-8">
          <Link
            to="/"
            className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
            onClick={handleItemClick}
          >
            <SlHome className="flex-none text-[#242424]" size={22} />
            <span className="opacity-100 text-[#242424] transform transition-all duration-300 ease-in-out text-sm font-normal font-poppins">
              Home
            </span>
          </Link>
          <Link
            to="/shop"
            className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
            onClick={handleItemClick}
          >
            <CiShop className="flex-none text-[#242424]" size={22} />
            <span className="opacity-100 transform transition-all duration-300 ease-in-out text-sm font-normal font-poppins text-[#242424]">
              Shop
            </span>
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
            onClick={handleItemClick}
          >
            <div className="relative flex">
              <AiOutlineShopping
                className="flex-none text-[#242424]"
                size={22}
              />
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
              className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
              onClick={handleItemClick}
            >
              <div className="relative flex">
                <MdFavoriteBorder
                  className="flex-none text-[#242424]"
                  size={22}
                />
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
        <div className="relative group" ref={dropdownRef}>
          {userInfo ? (
            <>
              <button
                onClick={toggleTab}
                className="flex items-center gap-2 hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
              >
                <div className="flex items-start cursor-pointer ml-4">
                  <CiUser className="flex-none text-[#242424]" size={26} />
                  <div className="ml-4 text-sm flex flex-col font-normal font-poppins">
                    <p className="text-[18px] font-figtree font-semibold text-[#212b36] capitalize">
                      {userInfo.username}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center mt-1">
                    {tabOpen ? (
                      <FaAngleUp
                        className="text-[#242424] transition-transform duration-200"
                        size={16}
                      />
                    ) : (
                      <FaAngleDown
                        className="text-[#242424] transition-transform duration-200"
                        size={16}
                      />
                    )}
                  </div>
                </div>
              </button>
              {tabOpen && userInfo && (
                <div className="space-y-2 text-white rounded-b-md mt-1 py-2">
                  <button
                    onClick={toggleTab} // Close tab when clicked
                    className="absolute top-2 right-2 text-white"
                  ></button>
                  <div className="flex flex-col gap-2 my-5">
                    <Link
                      to="/"
                      className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
                      onClick={handleItemClick}
                    >
                      <SlHome
                        size={22}
                        className=" text-[#212b36] text-[18px]"
                      />
                      <span className="text-[#212b36] text-[18px] font-figtree font-normal">
                        Home
                      </span>
                    </Link>
                    {userInfo.isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
                        onClick={handleItemClick}
                      >
                        <MdOutlineDashboard
                          size={22}
                          className=" text-[#212b36] text-[18px]"
                        />
                        <span className="text-[#212b36] text-[18px] font-figtree font-normal">
                          Dashboard
                        </span>
                      </Link>
                    )}
                    <Link
                      to="/favorite"
                      className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
                      onClick={handleItemClick}
                    >
                      <CiHeart
                        size={22}
                        className=" text-[#212b36] text-[18px]"
                      />
                      <span className="text-[#212b36] text-[18px] font-figtree font-normal">
                        Wishlist
                      </span>
                    </Link>
                    <Link
                      to="/user-orders"
                      className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
                      onClick={handleItemClick}
                    >
                      <LiaClipboardListSolid
                        size={22}
                        className=" text-[#212b36] text-[18px]"
                      />
                      <span className="text-[#212b36] text-[18px] font-figtree font-normal">
                        Orders
                      </span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
                      onClick={handleItemClick}
                    >
                      <CgProfile
                        size={22}
                        className=" text-[#212b36] text-[18px]"
                      />
                      <span className="text-[#212b36] text-[18px] font-figtree font-normal">
                        Profile
                      </span>
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="flex items-center justify-center gap-4 border border-gray-500/50 rounded-md px-3 py-2 hover:bg-gray-300/50 transition-all duration-300 ease-in-out mx-4"
                    >
                      <IoIosLogOut
                        size={22}
                        className=" text-[#212b36] text-[18px]"
                      />
                      <span className="text-[#212b36] text-[18px] font-figtree font-normal">
                        Logout
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <ul className="flex flex-col space-y-3">
              <li>
                <Link
                  to="/login"
                  className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
                >
                  <CiLogin className=" text-[#212b36] text-[18px]" size={22} />
                  <span className="text-[#212b36] text-[18px] font-figtree font-normal">
                    Login
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
                >
                  <GoSignIn className="text-[#212b36] text-[18px]" size={22} />
                  <span className="text-[#212b36] text-[18px] font-figtree font-normal">
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
      <div className="flex justify-between items-center py-6 container mx-auto">
        {/* Logo */}
        <div>
          <Link to="/" className="flex items-center">
            <span className="font-bold text-[#B88E2F] font-serif text-[24px]">
              <span className="text-4xl text-blue-600 font-bold font-mono">
                E
              </span>
              onlineSolution
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6">
          <Link
            to="/"
            className="text-[#242424] font-serif text-[18px] font-normal hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-[#242424] font-serif text-[18px] font-normal hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="text-[#242424] font-serif text-[18px] font-normal hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-[#242424] font-serif text-[18px] font-normal hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
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
                <div className="flex items-center justify-center w-10 h-10 bg-[#FFE4F8] rounded-full -z-10">
                  <MdFavoriteBorder
                    className="text-[#FF57D0] hover:text-[#B88E2F]"
                    size={24}
                  />
                  <div className="absolute -top-[38px] left-3">
                    <FavoritesCount />
                  </div>
                </div>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center hover:text-[#B88E2F] transition-all duration-300 ease-in-out"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-[#FFF1EE] rounded-full -z-10">
                  <RiShoppingBagLine className="text-[#EA2B0F]" size={24} />
                  {cartItems?.length > 0 && (
                    <span className="absolute -top-[2px] left-5 font-normal font-poppins py-0 px-1.5 text-sm text-white bg-[#B88E2F] rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </div>
              </Link>

              {/* Profile */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleTab}
                  className="flex items-center justify-center w-10 h-10 bg-[#FFE9E1] rounded-full"
                >
                  <CiUser className="text-[#f17e50]" size={24} />
                </button>
                {tabOpen && (
                  <div className="absolute right-0 mt-8 w-72 bg-white/90 backdrop-blur-3xl rounded-xl z-50 border border-gray-500/50 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="border-b border-gray-300 flex flex-col pl-4 py-3 bg-gradient-to-r from-white/20 to-white/5">
                      <p className="text-[18px] font-figtree font-semibold text-[#212b36] capitalize">
                        {userInfo.username}
                      </p>
                      <p className="text-sm text-[#637381] font-normal font-figtree">
                        {userInfo.email}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 my-5">
                      <Link
                        to="/"
                        className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
                        onClick={handleItemClick}
                      >
                        <SlHome
                          size={22}
                          className=" text-[#212b36] text-[18px]"
                        />
                        <span className="text-[#212b36] text-[18px] font-figtree font-normal">
                          Home
                        </span>
                      </Link>
                      {userInfo.isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
                          onClick={handleItemClick}
                        >
                          <MdOutlineDashboard
                            size={22}
                            className=" text-[#212b36] text-[18px]"
                          />
                          <span className="text-[#212b36] text-[18px] font-figtree font-normal">
                            Dashboard
                          </span>
                        </Link>
                      )}
                      <Link
                        to="/favorite"
                        className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
                        onClick={handleItemClick}
                      >
                        <CiHeart
                          size={22}
                          className=" text-[#212b36] text-[18px]"
                        />
                        <span className="text-[#212b36] text-[18px] font-figtree font-normal">
                          Wishlist
                        </span>
                      </Link>
                      <Link
                        to="/user-orders"
                        className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
                        onClick={handleItemClick}
                      >
                        <LiaClipboardListSolid
                          size={22}
                          className=" text-[#212b36] text-[18px]"
                        />
                        <span className="text-[#212b36] text-[18px] font-figtree font-normal">
                          Orders
                        </span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-4 hover:bg-gray-300/50 w-full py-2 transition-all duration-300 ease-in-out pl-4"
                        onClick={handleItemClick}
                      >
                        <CgProfile
                          size={22}
                          className=" text-[#212b36] text-[18px]"
                        />
                        <span className="text-[#212b36] text-[18px] font-figtree font-normal">
                          Profile
                        </span>
                      </Link>
                      <button
                        onClick={logoutHandler}
                        className="flex items-center justify-center gap-4 border border-gray-500/50 rounded-md px-3 py-2 hover:bg-gray-300/50 transition-all duration-300 ease-in-out mx-4"
                      >
                        <IoIosLogOut
                          size={22}
                          className=" text-[#212b36] text-[18px]"
                        />
                        <span className="text-[#212b36] text-[18px] font-figtree font-normal">
                          Logout
                        </span>
                      </button>
                    </div>
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
