import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./pages/Auth/Navigation";
import Loader from "./components/Loader";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import ServiceTag from "./components/ServiceTag";
import { useNotifications } from "./hooks/useNotifications";

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
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const noExtrasPaths = ["/login", "/register", "/verify-otp", "/forgot-password", "/verify-reset-otp", "/reset-password"];
  const isAdminPath = location.pathname.startsWith("/admin");
  const shouldShowExtras = !noExtrasPaths.includes(location.pathname) && !isAdminPath;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f0f0f]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" style={{ zIndex: 99999 }} />
      
      <div className="relative flex flex-col min-h-screen">
        <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <main className="flex-grow">
          <Outlet />
        </main>
        {shouldShowExtras && (
          <>
            <ServiceTag />
            <Footer />
          </>
        )}
      </div>
    </>
  );
}

export default App;