/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { SlHome } from "react-icons/sl";
import { MdOutlineDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { LiaClipboardListSolid } from "react-icons/lia";
import { IoIosLogOut } from "react-icons/io";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "@redux/api/usersApiSlice";
import { logout } from "@redux/features/auth/authSlice";
import { CiShop, CiUser } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "../../components/NotificationBell";
import Logo from "../../components/Logo";
import CartIcon from "../../components/CartIcon";
import FavoriteIcon from "../../components/FavoriteIcon";

const Navigation = ({ isMenuOpen, setIsMenuOpen }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [tabOpen, setTabOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleItemClick = () => {
    if (isMobile) setIsMenuOpen(false);
    setTabOpen(false);
  };

  const toggleTab = () => setTabOpen(!tabOpen);

  // --- Mobile Version (Background Restored to #F9F1E7) ---
  const MobileHeader = (
    <div className="font-figtree">
      <nav className="w-full fixed top-0 left-0 z-[110] bg-white/90 border-b backdrop-blur-xl border-gray-100 px-4">
        <div className="flex justify-between items-center h-16 container mx-auto">
          <Link
            to="/"
            onClick={handleItemClick}
            className="scale-90 origin-left"
          >
            <Logo />
          </Link>

          <div className="flex items-center gap-3">
            {userInfo && <NotificationBell />}
            <FavoriteIcon onClick={handleItemClick} />
            <CartIcon cartCount={cartItems?.length} onClick={handleItemClick} />

            <button
              onClick={toggleMenu}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-gray-50 border border-gray-100 transition-all active:scale-90"
            >
              <span
                className={`h-0.5 bg-blue-600 transition-all duration-300 ${isMenuOpen ? "w-6 rotate-45 translate-y-2" : "w-5"}`}
              />
              <span
                className={`h-0.5 bg-[#B88E2F] transition-all duration-300 ${isMenuOpen ? "opacity-0" : "w-3"}`}
              />
              <span
                className={`h-0.5 bg-blue-600 transition-all duration-300 ${isMenuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-5"}`}
              />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-screen w-72 bg-[#F9F1E7] z-[100] p-6 shadow-2xl flex flex-col"
            >
              <div className="mb-10">
                <Logo />
              </div>

              <div className="flex flex-col space-y-2">
                {[
                  {
                    to: "/",
                    icon: <SlHome size={20} />,
                    label: "Home",
                    color: "blue",
                  },
                  {
                    to: "/shop",
                    icon: <CiShop size={24} />,
                    label: "Shop",
                    color: "amber",
                  },
                  {
                    to: "/cart",
                    icon: <CartIcon cartCount={cartItems?.length} />,
                    label: "My Cart",
                    color: "rose",
                  },
                  {
                    to: "/favorite",
                    icon: <FavoriteIcon />,
                    label: "Wishlist",
                    color: "pink",
                  },
                ].map((item, i) => (
                  <Link
                    key={i}
                    to={item.to}
                    onClick={handleItemClick}
                    className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white transition-all border border-transparent hover:border-gray-200"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl group-hover:shadow-sm">
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>

              <div
                className="mt-auto pt-6 border-t border-gray-300"
                ref={dropdownRef}
              >
                {userInfo ? (
                  <div className="space-y-4">
                    <button
                      onClick={toggleTab}
                      className="flex items-center justify-between w-full p-2 rounded-2xl bg-white/50 border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#B88E2F]/10 rounded-full flex items-center justify-center text-[#B88E2F]">
                          <CiUser size={24} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-gray-900 uppercase truncate w-32">
                            {userInfo?.username}
                          </p>
                          <p className="text-[10px] text-[#B88E2F] font-bold tracking-tighter">
                            OPERATOR ONLINE
                          </p>
                        </div>
                      </div>
                      {tabOpen ? (
                        <FaAngleUp size={14} className="text-[#B88E2F]" />
                      ) : (
                        <FaAngleDown size={14} className="text-gray-400" />
                      )}
                    </button>

                    <AnimatePresence>
                      {tabOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-col gap-1 pl-2 overflow-hidden"
                        >
                          {userInfo.isAdmin && (
                            <Link
                              to="/admin/dashboard"
                              onClick={handleItemClick}
                              className="flex items-center gap-3 p-3 text-[10px] font-bold uppercase tracking-widest text-gray-700 hover:text-[#B88E2F]"
                            >
                              <MdOutlineDashboard size={18} /> Dashboard
                            </Link>
                          )}
                          <Link
                            to="/profile"
                            onClick={handleItemClick}
                            className="flex items-center gap-3 p-3 text-[10px] font-bold uppercase tracking-widest text-gray-700 hover:text-[#B88E2F]"
                          >
                            <CgProfile size={18} /> My Profile
                          </Link>
                          <Link
                            to="/user-orders"
                            onClick={handleItemClick}
                            className="flex items-center gap-3 p-3 text-[10px] font-bold uppercase tracking-widest text-gray-700 hover:text-[#B88E2F]"
                          >
                            <LiaClipboardListSolid size={18} /> My Order
                          </Link>
                          <button
                            onClick={logoutHandler}
                            className="flex items-center gap-3 p-3 text-[10px] font-black uppercase tracking-widest text-red-600"
                          >
                            <IoIosLogOut size={18} /> Terminate Session
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      onClick={handleItemClick}
                      className="w-full py-4 text-center bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-700"
                    >
                      Login 
                    </Link>
                    <Link
                      to="/register"
                      onClick={handleItemClick}
                      className="w-full py-4 text-center bg-[#242424] text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  // --- Desktop Version (Restored to White Background) ---
  const DesktopHeader = (
    <div className="w-full fixed top-0 left-0 z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100 font-figtree">
      <div className="flex justify-between items-center py-5 container mx-auto px-6">
        <Link
          to="/"
          className="transition-transform hover:scale-105 duration-300"
        >
          <Logo />
        </Link>

        <div className="flex gap-10">
          {["Home", "Shop", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="text-gray-900 font-bold text-[11px] uppercase tracking-[0.25em] hover:text-[#B88E2F] transition-all relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#B88E2F] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <FavoriteIcon onClick={handleItemClick} />
          <CartIcon cartCount={cartItems?.length} onClick={handleItemClick} />
          {userInfo && <NotificationBell />}

          <div className="relative" ref={dropdownRef}>
            {userInfo ? (
              <button
                onClick={toggleTab}
                className="flex items-center gap-3 p-1 pl-4 pr-1 rounded-full border border-gray-100 bg-gray-50/50 hover:bg-white transition-all shadow-sm group"
              >
                <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
                  {userInfo.username}
                </span>
                <div className="w-9 h-9 bg-[#B88E2F] text-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <CiUser size={22} />
                </div>
              </button>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 bg-[#242424] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-all shadow-lg shadow-black/10"
              >
               Login 
              </Link>
            )}

            <AnimatePresence>
              {tabOpen && userInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 mt-6 w-72 bg-white rounded-2xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden"
                >
                  <div className="p-5 bg-[#F9F1E7]/50 border-b border-gray-100">
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest truncate">
                      {userInfo?.username}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {userInfo?.email}
                    </p>
                  </div>
                  <div className="p-3">
                    {userInfo.isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={handleItemClick}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-amber-50 text-gray-700 transition-all font-bold text-[10px] uppercase tracking-widest"
                      >
                        <MdOutlineDashboard
                          size={18}
                          className="text-[#B88E2F]"
                        />{" "}
                        System Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={handleItemClick}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 text-gray-700 transition-all font-bold text-[10px] uppercase tracking-widest"
                    >
                      <CgProfile size={18} /> Profile Setting
                    </Link>
                    <Link
                      to="/user-orders"
                      onClick={handleItemClick}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 text-gray-700 transition-all font-bold text-[10px] uppercase tracking-widest border-b border-gray-50 mb-2"
                    >
                      <LiaClipboardListSolid size={18} />My Order 
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="w-full flex items-center justify-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-sm"
                    >
                      <IoIosLogOut size={18} /> Terminate Session
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );

  return isMobile ? MobileHeader : DesktopHeader;
};

export default Navigation;
