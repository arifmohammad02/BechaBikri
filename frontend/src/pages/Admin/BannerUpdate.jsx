/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import AdminMenu from "./AdminMenu";
import {
  useGetBannerByIdQuery,
  useUpdateBannerMutation,
} from "@redux/api/bannerApiSlice";
import { useFetchCategoriesQuery } from "@redux/api/categoryApiSlice";
import { useGetProductsQuery } from "@redux/api/productApiSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { UPLOAD_URL } from "../../redux/constants";
import {
  FaSave,
  FaSpinner,
  FaCloudUploadAlt,
  FaTrash,
  FaArrowLeft,
  FaImage,
  FaMobileAlt,
  FaTag,
} from "react-icons/fa";

const BannerUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: banner, isLoading: isFetching } = useGetBannerByIdQuery(id);
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const { data: categories } = useFetchCategoriesQuery();
  const { data: products } = useGetProductsQuery({});

  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(null);

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

  useEffect(() => {
    if (banner) {
      setFormData({
        name: banner.name || "",
        type: banner.type || "hero",
        headline: banner.headline || "",
        subHeadline: banner.subHeadline || "",
        image: banner.image || "",
        mobileImage: banner.mobileImage || "",
        buttonText: banner.buttonText || "Shop Now",
        buttonType: banner.buttonType || "default",
        link: banner.link || "",
        product: banner.product?._id || "",
        category: banner.category?._id || "",
        position: banner.position || 1,
        backgroundColor: banner.backgroundColor || "#ffffff",
        textColor: banner.textColor || "#000000",
        buttonColor: banner.buttonColor || "#ff6b6b",
        buttonTextColor: banner.buttonTextColor || "#ffffff",
        startDate: banner.startDate
          ? new Date(banner.startDate).toISOString().slice(0, 16)
          : "",
        endDate: banner.endDate
          ? new Date(banner.endDate).toISOString().slice(0, 16)
          : "",
        isActive: banner.isActive ?? true,
        displayPages: banner.displayPages || ["home"],
        displayOn: banner.displayOn || {
          desktop: true,
          mobile: true,
          tablet: true,
        },
        popupSettings: banner.popupSettings || {
          delay: 5,
          showAgainAfter: 24,
          couponCode: "",
          discountAmount: 0,
        },
        offerSettings: banner.offerSettings || {
          offerType: "percentage",
          offerValue: 0,
          isLimitedTime: false,
          countdownEndTime: "",
        },
      });
    }
  }, [banner]);

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

  const getButtonTypeStyle = (type) => {
    return (
      buttonTypeOptions.find((opt) => opt.value === type) ||
      buttonTypeOptions[0]
    );
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateBanner({ bannerId: id, bannerData: formData }).unwrap();
      toast.success("Banner updated successfully!");
      navigate("/admin/bannerlist");
    } catch (error) {
      toast.error(error.data?.error || "Failed to update banner");
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

  if (isFetching || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-red-600" />
      </div>
    );
  }

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
                  Update <span className="text-red-600">Banner</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold tracking-[0.4em] uppercase mt-1">
                  ID: {id}
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/bannerlist")}
                className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
              >
                <FaArrowLeft /> Back to List
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Images & Basic Info */}
                <div className="space-y-8">
                  {/* Images */}
                  <div className="bg-white border border-gray-100 shadow-lg p-6">
                    <h2 className="text-lg font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                      <FaImage /> Images
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Desktop */}
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                          Desktop
                        </label>
                        {formData.image ? (
                          <div className="relative group">
                            <img
                              src={formData.image}
                              alt="Desktop"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, image: "" }))
                              }
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-600">
                            <FaCloudUploadAlt className="text-2xl text-gray-400" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, false)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Mobile */}
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                          Mobile
                        </label>
                        {formData.mobileImage ? (
                          <div className="relative group">
                            <img
                              src={formData.mobileImage}
                              alt="Mobile"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  mobileImage: "",
                                }))
                              }
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-600">
                            <FaMobileAlt className="text-2xl text-gray-400" />
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
                  </div>

                  {/* Basic Info */}
                  <div className="bg-white border border-gray-100 shadow-lg p-6">
                    <h2 className="text-lg font-black uppercase tracking-widest mb-4">
                      Basic Info
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                          Type
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                          className="w-full border-b-2 border-gray-100 py-2 font-bold focus:border-red-600 outline-none"
                        >
                          {bannerTypes.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                          Name
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
                          className="w-full border-b-2 border-gray-100 py-2 font-bold focus:border-red-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                          Headline
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
                          className="w-full border-b-2 border-gray-100 py-2 font-bold focus:border-red-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
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
                          className="w-full border-b-2 border-gray-100 py-2 font-bold focus:border-red-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1  flex items-center gap-2">
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
                          className="w-full border-b-2 border-gray-100 py-2 font-bold focus:border-red-600 outline-none"
                        >
                          {buttonTypeOptions.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </option>
                          ))}
                        </select>
                        <div className="mt-2">
                          <span
                            className={`inline-block px-3 py-1 rounded text-xs font-bold text-white ${getButtonTypeStyle(formData.buttonType).color}`}
                          >
                            {getButtonTypeStyle(formData.buttonType).icon}{" "}
                            {getButtonTypeStyle(formData.buttonType).label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="bg-white border border-gray-100 shadow-lg p-6">
                    <h2 className="text-lg font-black uppercase tracking-widest mb-4">
                      Colors
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: "backgroundColor", label: "Background" },
                        { key: "textColor", label: "Text" },
                        { key: "buttonColor", label: "Button" },
                        { key: "buttonTextColor", label: "Btn Text" },
                      ].map((c) => (
                        <div key={c.key} className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData[c.key]}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                [c.key]: e.target.value,
                              }))
                            }
                            className="w-8 h-8 rounded cursor-pointer"
                          />
                          <span className="text-xs font-bold">{c.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Settings */}
                <div className="space-y-8">
                  {/* Links */}
                  <div className="bg-white border border-gray-100 shadow-lg p-6">
                    <h2 className="text-lg font-black uppercase tracking-widest mb-4">
                      Links
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
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
                          className="w-full border-b-2 border-gray-100 py-2 font-bold focus:border-red-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                          URL
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
                          className="w-full border-b-2 border-gray-100 py-2 font-bold focus:border-red-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                          Product
                        </label>
                        <select
                          value={formData.product}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              product: e.target.value,
                            }))
                          }
                          className="w-full border-b-2 border-gray-100 py-2 font-bold focus:border-red-600 outline-none"
                        >
                          <option value="">None</option>
                          {products?.products?.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          className="w-full border-b-2 border-gray-100 py-2 font-bold focus:border-red-600 outline-none"
                        >
                          <option value="">None</option>
                          {categories?.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="bg-white border border-gray-100 shadow-lg p-6">
                    <h2 className="text-lg font-black uppercase tracking-widest mb-4">
                      Schedule
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
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
                          className="w-full border-b-2 border-gray-100 py-2 font-bold focus:border-red-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
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
                          className="w-full border-b-2 border-gray-100 py-2 font-bold focus:border-red-600 outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="text-[10px] font-black uppercase text-gray-400">
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
                          className="w-5 h-5 accent-red-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Display Settings */}
                  <div className="bg-white border border-gray-100 shadow-lg p-6">
                    <h2 className="text-lg font-black uppercase tracking-widest mb-4">
                      Display
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                          Position
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
                          className="w-full border-b-2 border-gray-100 py-2 font-bold focus:border-red-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                          Pages
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {displayPageOptions.map((page) => (
                            <label
                              key={page.value}
                              className={`px-3 py-1 rounded text-xs font-bold cursor-pointer ${
                                formData.displayPages.includes(page.value)
                                  ? "bg-red-600 text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.displayPages.includes(
                                  page.value,
                                )}
                                onChange={() =>
                                  handleDisplayPageChange(page.value)
                                }
                                className="hidden"
                              />
                              {page.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Popup Settings */}
                  {formData.type === "popup" && (
                    <div className="bg-purple-50 border border-purple-100 p-6 rounded-xl">
                      <h2 className="text-lg font-black uppercase tracking-widest mb-4 text-purple-600">
                        Popup Settings
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 mb-1 block">
                            Delay (sec)
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
                            className="w-full border border-gray-200 py-2 px-3 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 mb-1 block">
                            Show Again (hrs)
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
                            className="w-full border border-gray-200 py-2 px-3 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview & Submit */}
              <div className="mt-8">
                <div
                  className="p-6 rounded-xl mb-6"
                  style={{
                    backgroundColor: formData.backgroundColor,
                    color: formData.textColor,
                  }}
                >
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4 opacity-50">
                    Preview
                  </h3>
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
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h4 className="text-xl font-black">{formData.headline}</h4>
                  <p className="text-sm">{formData.subHeadline}</p>
                  <button
                    style={{
                      backgroundColor: formData.buttonColor,
                      color: formData.buttonTextColor,
                    }}
                    className="mt-4 px-6 py-2 rounded-lg font-bold"
                  >
                    {formData.buttonText}
                  </button>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/bannerlist")}
                    className="px-8 py-3 border-2 border-black text-black font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-8 py-3 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaSave />
                    )}
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerUpdate;
