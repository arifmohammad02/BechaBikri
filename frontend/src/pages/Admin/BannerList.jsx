/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AdminMenu from "./AdminMenu";
import {
  useGetAllBannersQuery,
  useToggleBannerStatusMutation,
  useDeleteBannerMutation,
  useGetBannerStatsQuery,
} from "@redux/api/bannerApiSlice";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaImage,
  FaChartBar,
} from "react-icons/fa";

const BannerList = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: banners, isLoading, refetch } = useGetAllBannersQuery();
  const { data: stats } = useGetBannerStatsQuery();
  const [toggleStatus] = useToggleBannerStatusMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  console.log(banners);
  

  // ফিল্টার লজিক
  const filteredBanners = banners?.filter((banner) => {
    const typeMatch = filterType === "all" || banner.type === filterType;
    const statusMatch =
      filterStatus === "all" ||
      (filterStatus === "active" && banner.isActive) ||
      (filterStatus === "inactive" && !banner.isActive);
    return typeMatch && statusMatch;
  });

  const handleToggleStatus = async (id) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success("Status updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete banner "${name}"?`)) return;
    try {
      await deleteBanner(id).unwrap();
      toast.success("Banner deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  const bannerTypes = [
    { value: "hero", label: "Hero", color: "bg-purple-500" },
    { value: "category", label: "Category", color: "bg-blue-500" },
    { value: "promotional", label: "Promotional", color: "bg-orange-500" },
    { value: "sidebar", label: "Sidebar", color: "bg-pink-500" },
    { value: "popup", label: "Popup", color: "bg-green-500" },
    { value: "footer", label: "Footer", color: "bg-gray-500" },
    { value: "top-bar", label: "Top Bar", color: "bg-cyan-500" },
    { value: "middle", label: "Middle", color: "bg-yellow-500" },
  ];

  const getTypeColor = (type) => {
    return bannerTypes.find((t) => t.value === type)?.color || "bg-gray-400";
  };

  const getTypeLabel = (type) => {
    return bannerTypes.find((t) => t.value === type)?.label || type;
  };

  if (isLoading) {
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
          <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="mb-10 border-l-4 border-red-600 pl-6 py-2 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black text-black tracking-tighter uppercase">
                  Banner <span className="text-red-600">Management</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold tracking-[0.4em] uppercase mt-1">
                  Manage All Banners | Hero | Category | Promotional
                </p>
              </div>
              <Link to="/admin/banner/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-black text-white px-6 py-3 font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-colors"
                >
                  <FaPlus /> Create Banner
                </motion.button>
              </Link>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaImage className="text-2xl opacity-70" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-70">Total Banners</p>
                      <p className="text-2xl font-black">{stats.totalBanners}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaEye className="text-2xl opacity-70" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-70">Active</p>
                      <p className="text-2xl font-black">{stats.activeBanners}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaChartBar className="text-2xl opacity-70" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-70">Total Clicks</p>
                      <p className="text-2xl font-black">
                        {stats.byType?.reduce((acc, t) => acc + t.totalClicks, 0) || 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaEye className="text-2xl opacity-70" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-70">Impressions</p>
                      <p className="text-2xl font-black">
                        {stats.byType?.reduce((acc, t) => acc + t.totalImpressions, 0) || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-xl">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                  Filter by Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-white border border-gray-200 px-4 py-2 text-sm font-bold focus:outline-none focus:border-red-600"
                >
                  <option value="all">All Types</option>
                  {bannerTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white border border-gray-200 px-4 py-2 text-sm font-bold focus:outline-none focus:border-red-600"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Banner Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBanners?.map((banner, index) => (
                <motion.div
                  key={banner._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={banner.image}
                      alt={banner.headline}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span
                        className={`${getTypeColor(
                          banner.type
                        )} text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded`}
                      >
                        {getTypeLabel(banner.type)}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span
                        className={`${
                          banner.isActive
                            ? "bg-green-500"
                            : "bg-gray-400"
                        } text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded`}
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-black text-sm text-gray-800 mb-1 truncate">
                      {banner.headline}
                    </h3>
                    <p className="text-[10px] text-gray-400 mb-3 truncate">
                      {banner.name}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-4 mb-4 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaEye size={10} /> {banner.clicks || 0} clicks
                      </span>
                      <span className="flex items-center gap-1">
                        <FaChartBar size={10} /> {banner.impressions || 0} views
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleStatus(banner._id)}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                          banner.isActive
                            ? "bg-green-50 text-green-600 hover:bg-green-100"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {banner.isActive ? <FaEye className="inline mr-1" /> : <FaEyeSlash className="inline mr-1" />}
                        {banner.isActive ? "Active" : "Inactive"}
                      </button>
                      <button
                        onClick={() => navigate(`/admin/banner/update/${banner._id}`)}
                        className="flex-1 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-black uppercase tracking-widest transition-colors"
                      >
                        <FaEdit className="inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id, banner.name)}
                        className="flex-1 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-black uppercase tracking-widest transition-colors"
                      >
                        <FaTrash className="inline mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredBanners?.length === 0 && (
              <div className="text-center py-20">
                <FaImage className="text-6xl text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest">
                  No banners found
                </p>
                <Link
                  to="/admin/banner/create"
                  className="inline-block mt-4 text-red-600 font-black uppercase tracking-widest text-sm hover:underline"
                >
                  Create your first banner
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerList;