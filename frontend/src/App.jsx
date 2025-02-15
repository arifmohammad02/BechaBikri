import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./pages/Auth/Navigation";
import Loader from "./components/Loader";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import ServiceTag from "./components/ServiceTag";

function App() {
  const [loading, setLoading] = useState(true);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") {
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <Loader />
      </div>
    );
  }

  const shouldShowExtras = ![
    "/login",
    "/register",
    "/admin/dashboard",
    "/admin/categorylist",
    "/admin/userlist",
    "/admin/productlist",
    "/admin/allproductslist",
    "/admin/orderlist",
    "/product/update/:_id",
  ].includes(location.pathname);

  return (
    <div>
      <ToastContainer />
      <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <Outlet />
      {shouldShowExtras && <ServiceTag />}
      {shouldShowExtras && <Footer />}
    </div>
  );
}

export default App;
