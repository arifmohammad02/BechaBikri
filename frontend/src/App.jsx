import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./pages/Auth/Navigation";
import Loader from "./components/Loader";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import { useNotifications } from "./hooks/useNotifications";
import FooterBanners from "./components/FooterBanners";

// 🆕 NEW: SEO Helmet for dynamic meta tags
import { Helmet } from "react-helmet-async";

function App() {
  useNotifications();
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // 🆕 NEW: SEO - Dynamic page titles and meta descriptions
  useEffect(() => {
    const routeMeta = {
      "/": {
        title:
          "AriX GeaR - Premium Online Shopping | Best Deals & Fast Delivery",
        description:
          "Shop premium quality products at AriX GeaR. Best deals, fast delivery, secure payment. Your trusted online shopping destination in Bangladesh.",
      },
      "/shop": {
        title: "Shop All Products - AriX GeaR E-commerce Store",
        description:
          "Browse our wide collection of premium products. Best prices guaranteed with fast delivery across Bangladesh.",
      },
      "/cart": {
        title: "Shopping Cart - AriX GeaR",
        description:
          "Review your selected items and proceed to checkout. Secure payment and fast delivery available.",
      },
      "/favorite": {
        title: "My Wishlist - AriX GeaR",
        description:
          "Your saved favorite products. Add to cart anytime and enjoy fast delivery.",
      },
      "/login": {
        title: "Login - AriX GeaR",
        description:
          "Sign in to your AriX GeaR account. Access your orders, wishlist, and exclusive deals.",
      },
      "/register": {
        title: "Create Account - AriX GeaR",
        description:
          "Join AriX GeaR today. Create your account and start shopping with best deals and fast delivery.",
      },
      "/about": {
        title: "About Us - AriX GeaR | Your Trusted Online Store",
        description:
          "Learn about AriX GeaR - your trusted e-commerce partner. Quality products, excellent service, customer satisfaction guaranteed.",
      },
      "/contact": {
        title: "Contact Us - AriX GeaR Customer Support",
        description:
          "Get in touch with AriX GeaR support team. We're here to help with your shopping needs and inquiries.",
      },
      "/profile": {
        title: "My Account - AriX GeaR",
        description:
          "Manage your AriX GeaR account. View orders, update profile, and manage addresses.",
      },
      "/shipping": {
        title: "Shipping Information - AriX GeaR",
        description:
          "Enter your shipping details for fast and secure delivery. Free shipping available on selected items.",
      },
      "/placeorder": {
        title: "Checkout - Complete Your Order | AriX GeaR",
        description:
          "Review your order and complete payment. Secure checkout with multiple payment options.",
      },
      "/user-orders": {
        title: "My Orders - Order History | AriX GeaR",
        description:
          "Track your orders and view order history. Fast delivery updates and order management.",
      },
      "/forgot-password": {
        title: "Reset Password - AriX GeaR",
        description:
          "Reset your AriX GeaR account password. Secure and easy password recovery.",
      },
      "/verify-otp": {
        title: "Verify Account - AriX GeaR",
        description:
          "Verify your AriX GeaR account with OTP. Secure authentication for your safety.",
      },
      "/all-notifications": {
        title: "Notifications - AriX GeaR",
        description:
          "View all your notifications. Stay updated with your orders, offers, and account activity.",
      },
      "/product": {
        title: "Product Details - AriX GeaR",
        description:
          "View product details, specifications, and reviews. Best price guaranteed with fast delivery.",
      },
    };

    const adminMeta = {
      "/admin/dashboard": {
        title: "Admin Dashboard - AriX GeaR",
        description:
          "Manage your e-commerce store. View sales, orders, and analytics.",
      },
      "/admin/userlist": {
        title: "Manage Users - Admin | AriX GeaR",
        description: "View and manage registered users. Admin control panel.",
      },
      "/admin/categorylist": {
        title: "Manage Categories - Admin | AriX GeaR",
        description:
          "Organize products by categories. Easy category management.",
      },
      "/admin/productlist": {
        title: "Manage Products - Admin | AriX GeaR",
        description:
          "Add, edit, and manage your store products. Inventory control.",
      },
      "/admin/allproductslist": {
        title: "All Products - Admin | AriX GeaR",
        description: "Complete product listing and inventory management.",
      },
      "/admin/orderlist": {
        title: "Manage Orders - Admin | AriX GeaR",
        description:
          "Process and manage customer orders. Order fulfillment center.",
      },
      "/admin/bannerlist": {
        title: "Manage Banners - Admin | AriX GeaR",
        description: "Create and manage promotional banners. Marketing tools.",
      },
      "/admin/banner/create": {
        title: "Create Banner - Admin | AriX GeaR",
        description: "Design new promotional banners for your store.",
      },
    };

    // 🆕 NEW: Check if current path matches product details
    const isProductPage = location.pathname.startsWith("/product/");

    // 🆕 NEW: Check if current path matches admin routes
    const isAdminPage = location.pathname.startsWith("/admin/");

    // 🆕 NEW: Check if current path matches banner update
    const isBannerUpdate = location.pathname.startsWith("/admin/banner/update");

    let currentMeta;

    if (isProductPage) {
      currentMeta = routeMeta["/product"];
    } else if (isAdminPage && !isBannerUpdate) {
      currentMeta = adminMeta[location.pathname] || {
        title: "Admin Panel - AriX GeaR",
        description:
          "Administrative control panel for AriX GeaR e-commerce store.",
      };
    } else {
      currentMeta = routeMeta[location.pathname] || {
        title: "AriX GeaR - Premium E-commerce Store",
        description:
          "AriX GeaR - Premium online shopping with best deals, fast delivery, and secure payment options.",
      };
    }

    // 🆕 NEW: Update document title
    document.title = currentMeta.title;

    // 🆕 NEW: Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = currentMeta.description;

    // 🆕 NEW: Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content =
      "online shopping, e-commerce, best deals, fast delivery, Bangladesh, AriX GeaR, premium products";

    // 🆕 NEW: Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `https://arixgear.com${location.pathname}`;

    // 🆕 NEW: Update Open Graph meta tags
    updateMetaTag("property", "og:title", currentMeta.title);
    updateMetaTag("property", "og:description", currentMeta.description);
    updateMetaTag(
      "property",
      "og:url",
      `https://arixgear.com${location.pathname}`,
    );
    updateMetaTag("property", "og:type", isProductPage ? "product" : "website");

    // 🆕 NEW: Update Twitter Card meta tags
    updateMetaTag("name", "twitter:title", currentMeta.title);
    updateMetaTag("name", "twitter:description", currentMeta.description);
  }, [location.pathname]);

  // 🆕 NEW: Helper function to update/create meta tags
  const updateMetaTag = (attr, key, value) => {
    let tag = document.querySelector(`meta[${attr}="${key}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(attr, key);
      document.head.appendChild(tag);
    }
    tag.content = value;
  };

  // 🆕 NEW: SEO - Structured Data for Organization
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AriX GeaR",
    url: "https://arixgear.com",
    logo: "https://arixgear.com/logo.png",
    sameAs: ["https://facebook.com/arixgear", "https://instagram.com/arixgear"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English", "Bengali"],
    },
  };

  // 🆕 NEW: SEO - WebSite structured data with search
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AriX GeaR",
    url: "https://arixgear.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://arixgear.com/shop/{search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Initial loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // 🆕 NEW: Extended routes where footer should be hidden
  const shouldShowExtras =
    ![
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
      "/forgot-password",
      "/verify-reset-otp",
      "/reset-password",
    ].includes(location.pathname) &&
    !location.pathname.startsWith("/admin/banner/update");

  // 🆕 NEW: Check if current page is noindex
  const isNoIndex =
    [
      "/login",
      "/register",
      "/verify-otp",
      "/forgot-password",
      "/verify-reset-otp",
      "/reset-password",
      "/admin/dashboard",
      "/admin/userlist",
      "/admin/categorylist",
      "/admin/productlist",
      "/admin/allproductslist",
      "/admin/orderlist",
      "/admin/bannerlist",
      "/admin/banner/create",
    ].includes(location.pathname) ||
    location.pathname.startsWith("/admin/banner/update") ||
    location.pathname.startsWith("/admin/product/update");

  return (
    <>
      <Helmet>
        {/* 🆕 NEW: Default meta tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* 🆕 NEW: Robots meta - noindex for auth/admin pages */}
        {isNoIndex && <meta name="robots" content="noindex, nofollow" />}
        {!isNoIndex && <meta name="robots" content="index, follow" />}

        {/* 🆕 NEW: Author and generator */}
        <meta name="author" content="AriX GeaR" />
        <meta name="generator" content="React" />

        {/* 🆕 NEW: Theme color for mobile browsers */}
        <meta name="theme-color" content="#2563eb" />

        {/* ✅ FIXED: Mobile web app capable - cross-platform standard */}
        <meta name="mobile-web-app-capable" content="yes" />

        {/* 🆕 NEW: Apple status bar style (still valid) */}
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* 🆕 NEW: Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-config" content="browserconfig.xml" />

        {/* 🆕 NEW: Structured Data JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteStructuredData)}
        </script>
      </Helmet>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        pauseOnHover
        closeOnClick
        style={{ zIndex: 99999 }}
      />

      <ScrollRestoration />

      {loading ? (
        // 🆕 NEW: SEO - Added aria-label for accessibility
        <div
          className="flex items-center justify-center h-screen"
          role="status"
          aria-label="Loading AriX GeaR website"
        >
          <Loader />
        </div>
      ) : (
        <div className="relative flex flex-col min-h-screen">
          {/* 🆕 NEW: SEO - Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50 transition-all duration-200"
          >
            Skip to main content
          </a>

          <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

          {/* 🆕 NEW: SEO - Main content with id and role */}
          <main
            id="main-content"
            className="flex-grow"
            role="main"
            aria-label="Main content"
          >
            <Outlet />
          </main>

          {shouldShowExtras && (
            <>
              <FooterBanners />
              <Footer />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default App;
