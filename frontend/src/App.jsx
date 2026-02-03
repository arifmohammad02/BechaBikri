
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // নিশ্চিত করুন এই CSS ইমপোর্ট আছে
import Navigation from "./pages/Auth/Navigation";
import Loader from "./components/Loader";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import ServiceTag from "./components/ServiceTag";

function App() {
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // ১. Empty Block Statement সমাধান করা হয়েছে (অপ্রয়োজনীয় useEffect সরিয়ে ফেলা হয়েছে)
  // যদি location change এ বিশেষ কিছু করার না থাকে, তবে এই ব্লকটি দরকার নেই।
  
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

  const shouldShowExtras = ![
    "/login",
    "/register",
    "/admin/dashboard",
    "/admin/categorylist",
    "/admin/userlist",
    "/admin/productlist",
    "/admin/allproductslist",
    "/admin/orderlist",
    "/verify-otp", // এটিও লিস্টে যোগ করতে পারেন যদি এখানে ফুটার না চান
  ].includes(location.pathname);

  return (
    <>
      {/* ২. ToastContainer কে Loader এর বাইরে রাখা হয়েছে যাতে এটি সবসময় কাজ করে */}
      {/* zIndex যোগ করা হয়েছে যাতে এটি সবকিছুর উপরে থাকে */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        pauseOnHover
        closeOnClick
        style={{ zIndex: 99999 }} 
      />

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      ) : (
        <div className="relative min-h-screen">
          <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <main>
            <Outlet />
          </main>
          {shouldShowExtras && <ServiceTag />}
          {shouldShowExtras && <Footer />}
        </div>
      )}
    </>
  );
}

export default App;