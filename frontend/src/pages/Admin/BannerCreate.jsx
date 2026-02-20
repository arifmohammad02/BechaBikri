/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AdminMenu from "./AdminMenu";
import { useCreateBannerMutation } from "@redux/api/bannerApiSlice";
import { useFetchCategoriesQuery } from "@redux/api/categoryApiSlice";
import { useGetProductsQuery } from "@redux/api/productApiSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { UPLOAD_URL } from "../../redux/constants";
import {
  FaPlus,
  FaSpinner,
  FaCloudUploadAlt,
  FaTrash,
  FaArrowLeft,
  FaImage,
  FaMobileAlt,
  FaDesktop,
  FaTag,
} from "react-icons/fa";

const BannerCreate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const mobileFileInputRef = useRef(null);

  const [createBanner, { isLoading }] = useCreateBannerMutation();
  const { data: categories } = useFetchCategoriesQuery();
  const { data: products } = useGetProductsQuery({});

  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "hero",
    headline: "",
    subHeadline: "",
    image: "",
    mobileImage: "",
    buttonText: "Shop Now",
    buttonType: "default",
    link: "",
    product: "",
    category: "",
    position: 1,
    backgroundColor: "#ffffff",
    textColor: "#000000",
    buttonColor: "#ff6b6b",
    buttonTextColor: "#ffffff",
    startDate: "",
    endDate: "",
    isActive: true,
    displayPages: ["home"],
    displayOn: {
      desktop: true,
      mobile: true,
      tablet: true,
    },
    popupSettings: {
      delay: 5,
      showAgainAfter: 24,
      couponCode: "",
      discountAmount: 0,
    },
    offerSettings: {
      offerType: "percentage",
      offerValue: 0,
      isLimitedTime: false,
      countdownEndTime: "",
    },
  });

  const buttonTypeOptions = [
    {
      value: "default",
      label: "Default (Shop Now)",
      color: "bg-gray-600",
      icon: "🛒",
    },
    {
      value: "weekend-deal",
      label: "Weekend Deal",
      color: "bg-purple-600",
      icon: "🔥",
    },
    {
      value: "flash-sale",
      label: "Flash Sale",
      color: "bg-yellow-500",
      icon: "⚡",
    },
    { value: "big-sale", label: "Big Sale", color: "bg-red-600", icon: "💥" },
    {
      value: "limited-offer",
      label: "Limited Offer",
      color: "bg-orange-500",
      icon: "⏰",
    },
    {
      value: "special-offer",
      label: "Special Offer",
      color: "bg-pink-500",
      icon: "🎁",
    },
    {
      value: "clearance",
      label: "Clearance",
      color: "bg-green-600",
      icon: "🏷️",
    },
    {
      value: "new-arrival",
      label: "New Arrival",
      color: "bg-blue-500",
      icon: "✨",
    },
    {
      value: "best-seller",
      label: "Best Seller",
      color: "bg-amber-500",
      icon: "⭐",
    },
    {
      value: "trending-now",
      label: "Trending Now",
      color: "bg-indigo-600",
      icon: "📈",
    },
    { value: "hot-deal", label: "Hot Deal", color: "bg-red-700", icon: "🌶️" },
    {
      value: "mega-sale",
      label: "Mega Sale",
      color: "bg-violet-600",
      icon: "🎉",
    },
    {
      value: "seasonal-offer",
      label: "Seasonal Offer",
      color: "bg-emerald-500",
      icon: "🌸",
    },
    {
      value: "exclusive",
      label: "Exclusive",
      color: "bg-slate-700",
      icon: "💎",
    },
    {
      value: "last-chance",
      label: "Last Chance",
      color: "bg-rose-600",
      icon: "⚠️",
    },
    {
      value: "doorbuster",
      label: "Doorbuster",
      color: "bg-cyan-600",
      icon: "🚪",
    },
    {
      value: "early-bird",
      label: "Early Bird",
      color: "bg-sky-500",
      icon: "🐦",
    },
    {
      value: "member-exclusive",
      label: "Member Exclusive",
      color: "bg-teal-600",
      icon: "👤",
    },
    {
      value: "bundle-deal",
      label: "Bundle Deal",
      color: "bg-lime-600",
      icon: "📦",
    },
    {
      value: "buy-one-get-one",
      label: "Buy 1 Get 1",
      color: "bg-fuchsia-600",
      icon: "🎊",
    },
  ];

  const bannerTypes = [
    { value: "hero", label: "Hero Banner", desc: "Main homepage slider" },
    {
      value: "category",
      label: "Category Banner",
      desc: "Category page banner",
    },
    {
      value: "promotional",
      label: "Promotional",
      desc: "Offer & discount banner",
    },
    { value: "sidebar", label: "Sidebar", desc: "Side panel banner" },
    { value: "popup", label: "Popup", desc: "Welcome/offer popup" },
    { value: "footer", label: "Footer", desc: "Bottom section banner" },
    { value: "top-bar", label: "Top Bar", desc: "Announcement bar" },
    { value: "middle", label: "Middle", desc: "Middle section banner" },
  ];

  const offerTypes = [
    { value: "percentage", label: "Percentage Discount" },
    { value: "fixed", label: "Fixed Amount" },
    { value: "bogo", label: "Buy 1 Get 1 Free" },
    { value: "free-shipping", label: "Free Shipping" },
  ];

  const displayPageOptions = [
    { value: "home", label: "Homepage" },
    { value: "category", label: "Category Page" },
    { value: "product", label: "Product Page" },
    { value: "cart", label: "Cart Page" },
    { value: "checkout", label: "Checkout" },
    { value: "all", label: "All Pages" },
  ];

  // ইমেজ আপলোড হ্যান্ডলার
  const handleImageUpload = async (e, isMobile = false) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const { data } = await axios.post(
        `${UPLOAD_URL}/banner`,
        uploadFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setFormData((prev) => ({
        ...prev,
        [isMobile ? "mobileImage" : "image"]: data.image,
      }));

      toast.success(`${isMobile ? "Mobile" : "Desktop"} image uploaded!`);
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ডুয়াল আপলোড (ডেস্কটপ + মোবাইল একসাথে)
  const handleDualUpload = async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    setUploading(true);
    const uploadFormData = new FormData();

    // প্রথম ফাইল ডেস্কটপ, দ্বিতীয় মোবাইল (যদি থাকে)
    uploadFormData.append("desktop", files[0]);
    if (files[1]) {
      uploadFormData.append("mobile", files[1]);
    }

    try {
      const { data } = await axios.post(
        `${UPLOAD_URL}/banner/dual`,
        uploadFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setFormData((prev) => ({
        ...prev,
        image: data.desktop?.url || "",
        mobileImage: data.mobile?.url || "",
      }));

      toast.success("Images uploaded successfully!");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please upload banner image");
      return;
    }

    if (!formData.headline) {
      toast.error("Headline is required");
      return;
    }

    try {
      await createBanner(formData).unwrap();
      toast.success("Banner created successfully!");
      navigate("/admin/bannerlist");
    } catch (error) {
      toast.error(error.data?.error || "Failed to create banner");
    }
  };

  const handleDisplayPageChange = (page) => {
    setFormData((prev) => {
      const current = prev.displayPages;
      if (current.includes(page)) {
        return { ...prev, displayPages: current.filter((p) => p !== page) };
      }
      return { ...prev, displayPages: [...current, page] };
    });
  };

  const getButtonTypeStyle = (type) => {
    return (
      buttonTypeOptions.find((opt) => opt.value === type) ||
      buttonTypeOptions[0]
    );
  };

  return (
    <div className="min-h-screen bg-white font-mono pt-24 lg:pt-32 transition-all duration-500">
      <div className="flex flex-col 2xl:flex-row">
        <AdminMenu />

        <div className="flex-1 px-4 lg:px-12 pb-20">
          <div className="max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="mb-10 border-l-4 border-red-600 pl-6 py-2 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black text-black tracking-tighter uppercase">
                  Create <span className="text-red-600">Banner</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold tracking-[0.4em] uppercase mt-1">
                  Step {step} of 3 | Banner Configuration
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/bannerlist")}
                className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
              >
                <FaArrowLeft /> Back to List
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    s <= step ? "bg-red-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* STEP 1: Images */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white border border-gray-100 shadow-2xl p-8"
                >
                  <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <FaImage /> 1. Upload Images
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Desktop Image */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 block">
                        Desktop Image * (Recommended: 3000x1000px)
                      </label>
                      {formData.image ? (
                        <div className="relative group">
                          <img
                            src={formData.image}
                            alt="Desktop"
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, image: "" }))
                            }
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-600 hover:bg-red-50 transition-all">
                          <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Upload Desktop Image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, false)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Mobile Image */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 block">
                        Mobile Image (Optional, Recommended: 1200x1200px)
                      </label>
                      {formData.mobileImage ? (
                        <div className="relative group">
                          <img
                            src={formData.mobileImage}
                            alt="Mobile"
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                mobileImage: "",
                              }))
                            }
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-600 hover:bg-red-50 transition-all">
                          <FaMobileAlt className="text-4xl text-gray-400 mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Upload Mobile Image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, true)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Quick Upload (Both at once) */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <FaDesktop className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-600">
                        Upload both images at once (select 2 files)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleDualUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {uploading && (
                    <div className="flex items-center gap-2 mt-4 text-red-600">
                      <FaSpinner className="animate-spin" />
                      <span className="text-sm font-bold">Uploading...</span>
                    </div>
                  )}

                  <div className="flex justify-end mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!formData.image}
                      className="px-8 py-3 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      Next Step →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Content */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white border border-gray-100 shadow-2xl p-8"
                >
                  <h2 className="text-xl font-black uppercase tracking-widest mb-6">
                    2. Banner Content
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Type */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Banner Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }))
                        }
                        className="w-full bg-white border-b-2 border-gray-100 py-3 font-bold focus:outline-none focus:border-red-600"
                      >
                        {bannerTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label} - {type.desc}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Banner Name (Admin) *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="E.g., Eid Sale 2025"
                        className="w-full bg-white border-b-2 border-gray-100 py-3 font-bold focus:outline-none focus:border-red-600"
                        required
                      />
                    </div>

                    {/* Headline */}
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Headline *
                      </label>
                      <input
                        type="text"
                        value={formData.headline}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            headline: e.target.value,
                          }))
                        }
                        placeholder="বছরসেরা ঈদ ধামাকা!"
                        className="w-full bg-white border-b-2 border-gray-100 py-3 font-bold focus:outline-none focus:border-red-600"
                        required
                      />
                    </div>

                    {/* Sub Headline */}
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Sub Headline
                      </label>
                      <input
                        type="text"
                        value={formData.subHeadline}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            subHeadline: e.target.value,
                          }))
                        }
                        placeholder="৪০% পর্যন্ত ছাড়"
                        className="w-full bg-white border-b-2 border-gray-100 py-3 font-bold focus:outline-none focus:border-red-600"
                      />
                    </div>
                    {/* ✅ নতুন: Button Type */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                        <FaTag /> Button Type
                      </label>
                      <select
                        value={formData.buttonType}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            buttonType: e.target.value,
                          }))
                        }
                        className="w-full bg-white border-b-2 border-gray-100 py-3 font-bold focus:outline-none focus:border-red-600"
                      >
                        {buttonTypeOptions.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                      {/* Selected preview */}
                      <div className="mt-2">
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-bold text-white ${getButtonTypeStyle(formData.buttonType).color}`}
                        >
                          {getButtonTypeStyle(formData.buttonType).icon}{" "}
                          {getButtonTypeStyle(formData.buttonType).label}
                        </span>
                      </div>
                    </div>

                    {/* Button Text */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={formData.buttonText}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            buttonText: e.target.value,
                          }))
                        }
                        placeholder="Shop Now"
                        className="w-full bg-white border-b-2 border-gray-100 py-3 font-bold focus:outline-none focus:border-red-600"
                      />
                    </div>

                    {/* Link */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Link URL
                      </label>
                      <input
                        type="text"
                        value={formData.link}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            link: e.target.value,
                          }))
                        }
                        placeholder="/shop or https://..."
                        className="w-full bg-white border-b-2 border-gray-100 py-3 font-bold focus:outline-none focus:border-red-600"
                      />
                    </div>

                    {/* Product Link */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Link to Product
                      </label>
                      <select
                        value={formData.product}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            product: e.target.value,
                          }))
                        }
                        className="w-full bg-white border-b-2 border-gray-100 py-3 font-bold focus:outline-none focus:border-red-600"
                      >
                        <option value="">Select Product (Optional)</option>
                        {products?.products?.map((product) => (
                          <option key={product._id} value={product._id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category Link */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Link to Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="w-full bg-white border-b-2 border-gray-100 py-3 font-bold focus:outline-none focus:border-red-600"
                      >
                        <option value="">Select Category (Optional)</option>
                        {categories?.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="mt-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                      Colors
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { key: "backgroundColor", label: "Background" },
                        { key: "textColor", label: "Text" },
                        { key: "buttonColor", label: "Button" },
                        { key: "buttonTextColor", label: "Button Text" },
                      ].map((color) => (
                        <div
                          key={color.key}
                          className="flex items-center gap-3"
                        >
                          <input
                            type="color"
                            value={formData[color.key]}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                [color.key]: e.target.value,
                              }))
                            }
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <span className="text-xs font-bold text-gray-600">
                            {color.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-8 py-3 border-2 border-black text-black font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!formData.name || !formData.headline}
                      className="px-8 py-3 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      Next Step →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Settings */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white border border-gray-100 shadow-2xl p-8"
                >
                  <h2 className="text-xl font-black uppercase tracking-widest mb-6">
                    3. Settings & Schedule
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Position */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Position Order
                      </label>
                      <input
                        type="number"
                        value={formData.position}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            position: parseInt(e.target.value),
                          }))
                        }
                        min={1}
                        className="w-full bg-white border-b-2 border-gray-100 py-3 font-bold focus:outline-none focus:border-red-600"
                      />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-4">
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                        Active
                      </label>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                        className="w-6 h-6 accent-red-600"
                      />
                    </div>

                    {/* Start Date */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Start Date
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        className="w-full bg-white border-b-2 border-gray-100 py-3 font-bold focus:outline-none focus:border-red-600"
                      />
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        End Date
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                        className="w-full bg-white border-b-2 border-gray-100 py-3 font-bold focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  {/* Display Pages */}
                  <div className="mb-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                      Display On Pages
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {displayPageOptions.map((page) => (
                        <label
                          key={page.value}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                            formData.displayPages.includes(page.value)
                              ? "bg-red-600 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.displayPages.includes(page.value)}
                            onChange={() => handleDisplayPageChange(page.value)}
                            className="hidden"
                          />
                          <span className="text-xs font-bold">
                            {page.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Device Settings */}
                  <div className="mb-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                      Display On Devices
                    </h3>
                    <div className="flex gap-6">
                      {[
                        { key: "desktop", label: "Desktop", icon: "💻" },
                        { key: "mobile", label: "Mobile", icon: "📱" },
                        { key: "tablet", label: "Tablet", icon: "📱" },
                      ].map((device) => (
                        <label
                          key={device.key}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={formData.displayOn[device.key]}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                displayOn: {
                                  ...prev.displayOn,
                                  [device.key]: e.target.checked,
                                },
                              }))
                            }
                            className="w-5 h-5 accent-red-600"
                          />
                          <span className="text-sm font-bold text-gray-600">
                            {device.icon} {device.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Popup Settings (only for popup type) */}
                  {formData.type === "popup" && (
                    <div className="mb-8 p-6 bg-purple-50 rounded-xl">
                      <h3 className="text-sm font-black uppercase tracking-widest text-purple-600 mb-4">
                        Popup Settings
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                            Delay (seconds)
                          </label>
                          <input
                            type="number"
                            value={formData.popupSettings.delay}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                popupSettings: {
                                  ...prev.popupSettings,
                                  delay: parseInt(e.target.value),
                                },
                              }))
                            }
                            className="w-full bg-white border border-gray-200 py-2 px-3 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                            Show Again After (hours)
                          </label>
                          <input
                            type="number"
                            value={formData.popupSettings.showAgainAfter}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                popupSettings: {
                                  ...prev.popupSettings,
                                  showAgainAfter: parseInt(e.target.value),
                                },
                              }))
                            }
                            className="w-full bg-white border border-gray-200 py-2 px-3 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                            Coupon Code
                          </label>
                          <input
                            type="text"
                            value={formData.popupSettings.couponCode}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                popupSettings: {
                                  ...prev.popupSettings,
                                  couponCode: e.target.value,
                                },
                              }))
                            }
                            placeholder="WELCOME100"
                            className="w-full bg-white border border-gray-200 py-2 px-3 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                            Discount Amount
                          </label>
                          <input
                            type="number"
                            value={formData.popupSettings.discountAmount}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                popupSettings: {
                                  ...prev.popupSettings,
                                  discountAmount: parseInt(e.target.value),
                                },
                              }))
                            }
                            className="w-full bg-white border border-gray-200 py-2 px-3 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Offer Settings (for promotional type) */}
                  {(formData.type === "promotional" ||
                    formData.type === "middle") && (
                    <div className="mb-8 p-6 bg-orange-50 rounded-xl">
                      <h3 className="text-sm font-black uppercase tracking-widest text-orange-600 mb-4">
                        Offer Settings
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                            Offer Type
                          </label>
                          <select
                            value={formData.offerSettings.offerType}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                offerSettings: {
                                  ...prev.offerSettings,
                                  offerType: e.target.value,
                                },
                              }))
                            }
                            className="w-full bg-white border border-gray-200 py-2 px-3 font-bold"
                          >
                            {offerTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                            Offer Value
                          </label>
                          <input
                            type="number"
                            value={formData.offerSettings.offerValue}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                offerSettings: {
                                  ...prev.offerSettings,
                                  offerValue: parseInt(e.target.value),
                                },
                              }))
                            }
                            className="w-full bg-white border border-gray-200 py-2 px-3 font-bold"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="text-[10px] font-black uppercase text-gray-400">
                            Limited Time
                          </label>
                          <input
                            type="checkbox"
                            checked={formData.offerSettings.isLimitedTime}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                offerSettings: {
                                  ...prev.offerSettings,
                                  isLimitedTime: e.target.checked,
                                },
                              }))
                            }
                            className="w-5 h-5 accent-orange-600"
                          />
                        </div>
                        {formData.offerSettings.isLimitedTime && (
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                              Countdown End Time
                            </label>
                            <input
                              type="datetime-local"
                              value={formData.offerSettings.countdownEndTime}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  offerSettings: {
                                    ...prev.offerSettings,
                                    countdownEndTime: e.target.value,
                                  },
                                }))
                              }
                              className="w-full bg-white border border-gray-200 py-2 px-3 font-bold"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Preview */}
                  <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                      Preview
                    </h3>
                    <div
                      className="p-6 rounded-xl"
                      style={{
                        backgroundColor: formData.backgroundColor,
                        color: formData.textColor,
                      }}
                    >
                      {formData.buttonType !== "default" && (
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-bold text-white mb-3 ${getButtonTypeStyle(formData.buttonType).color}`}
                        >
                          {getButtonTypeStyle(formData.buttonType).icon}{" "}
                          {getButtonTypeStyle(formData.buttonType).label}
                        </span>
                      )}
                      {formData.image && (
                        <img
                          src={formData.image}
                          alt="Banner"
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="text-xl font-black mb-2">
                        {formData.headline}
                      </h3>
                      <p className="text-sm mb-4">{formData.subHeadline}</p>
                      <button
                        style={{
                          backgroundColor: formData.buttonColor,
                          color: formData.buttonTextColor,
                        }}
                        className="px-6 py-2 rounded-lg font-bold"
                      >
                        {formData.buttonText}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-8 py-3 border-2 border-black text-black font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-3 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaPlus />
                      )}
                      {isLoading ? "Creating..." : "Create Banner"}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerCreate;
