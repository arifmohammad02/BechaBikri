import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./pages/Auth/Navigation";
import Loader from "./components/Loader";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import ServiceTag from "./components/ServiceTag";
import { useNotifications } from "./hooks/useNotifications";


// import PopupBanner from "./components/PopupBanner";
import FooterBanners from "./components/FooterBanners";
// import AdminRoute from "./pages/Admin/AdminRoute";

function App() {
  useNotifications();
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const shouldShowExtras = ![
    "/login",
    "/register",
    "/admin/dashboard",
    "/admin/categorylist",
    "/admin/userlist",
    "/admin/productlist",
    "/admin/allproductslist",
    "/admin/orderlist",
     "/admin/bannerlist",
    "/admin/banner/create",
    "/verify-otp", 
  ].includes(location.pathname);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        pauseOnHover
        closeOnClick
        style={{ zIndex: 99999 }}
      />

         {/* 🆕 Popup Banner - Only on non-admin pages */}
      {/* {!AdminRoute && <PopupBanner />} */}

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      ) : (
        <div className="relative flex flex-col min-h-screen">
          <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <main className="flex-grow">
            <Outlet />
          </main>
          {shouldShowExtras && (
            <>
             <FooterBanners />
              <ServiceTag />
              <Footer />
            </>
          )}
        </div>
      )}
    </>
  );
}
export default App;
