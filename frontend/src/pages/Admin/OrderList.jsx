/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import AdminMenu from "./AdminMenu";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  usePayOrderMutation,
} from "@redux/api/orderApiSlice";

const OrderList = ({ showAdminMenu = true, className = "pt-36", isDashboard = false }) => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [payOrder] = usePayOrderMutation();

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // ✅ Now used below

  // --- Handlers ---
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      refetch();
    } catch (err) {
      console.error("Status Update Error:", err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handlePaymentStatusChange = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    try {
      await payOrder({ orderId, status }).unwrap();
      refetch();
    } catch (err) {
      console.error("Payment Update Error:", err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // --- Filtering & Logic ---
  const sortedOrders = orders ? [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
  
  const filteredOrders = sortedOrders.filter((order) => {
    const matchesSearchTerm =
      (order.user?.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (order.orderId || "").toLowerCase().includes(searchTerm.toLowerCase());

    const orderDate = new Date(order.createdAt);
    const matchesStartDate = startDate ? orderDate >= new Date(startDate) : true;
    const matchesEndDate = endDate ? orderDate <= new Date(endDate) : true;

    return matchesSearchTerm && matchesStartDate && matchesEndDate;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = isDashboard ? sortedOrders.slice(0, 5) : filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className={`w-full min-h-screen bg-[#FDFDFD] font-mono ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            
            {/* 1. Header Section */}
            {!isDashboard && (
              <div className="mb-8">
                <h1 className="text-3xl font-black tracking-tighter border-l-4 border-red-600 pl-4 uppercase text-black">
                  Terminal <span className="text-red-600">Order Logs</span>
                </h1>
              </div>
            )}

            {/* 2. Filter Terminal */}
            {!isDashboard && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white p-5 border border-gray-100 shadow-sm">
                <input
                  type="text"
                  placeholder="SEARCH ORDER ID / USER..."
                  className="p-3 bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-red-600 transition-all uppercase font-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <input type="date" className="p-3 bg-gray-50 border border-gray-200 text-xs font-bold" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="date" className="p-3 bg-gray-50 border border-gray-200 text-xs font-bold" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <button 
                  onClick={() => { setSearchTerm(""); setStartDate(""); setEndDate(""); }} 
                  className="bg-black text-white text-[10px] font-bold tracking-widest hover:bg-red-600 transition-all uppercase py-3"
                >
                  Reset Terminal
                </button>
              </div>
            )}

            {/* 3. Items Per Page (Error Fix) */}
            {!isDashboard && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rows per page:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-white border border-gray-200 text-[10px] font-bold p-1 outline-none"
                >
                  {[8, 16, 24, 36].map(val => <option key={val} value={val}>{val} ROWS</option>)}
                </select>
              </div>
            )}

            {/* 4. Main Table Section */}
            <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
              {showAdminMenu && <div className="p-3 bg-gray-50 border-b border-gray-200"><AdminMenu /></div>}
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black text-gray-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-4 py-4 font-medium border-r border-gray-800">Items</th>
                      <th className="px-4 py-4 font-medium border-r border-gray-800">ID</th>
                      <th className="px-4 py-4 font-medium border-r border-gray-800">User</th>
                      <th className="px-4 py-4 font-medium border-r border-gray-800">Date</th>
                      <th className="px-4 py-4 font-medium border-r border-gray-800">Total</th>
                      <th className="px-4 py-4 font-medium border-r border-gray-800">Paid</th>
                      <th className="px-4 py-4 font-medium border-r border-gray-800">Paid Status</th>
                      <th className="px-4 py-4 font-medium border-r border-gray-800">Delivered</th>
                      <th className="px-4 py-4 font-medium border-r border-gray-800">Status</th>
                      <th className="px-4 py-4 font-medium text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50/80 transition-all group">
                        <td className="px-4 py-4">
                          <img src={order.orderItems[0].image} className="w-12 h-12 object-cover grayscale group-hover:grayscale-0 transition-all border border-gray-200 rounded" />
                        </td>
                        <td className="px-4 py-4 font-bold text-gray-900">{order.orderId}</td>
                        <td className="px-4 py-4 uppercase text-gray-600">{order.user?.username || "N/A"}</td>
                        <td className="px-4 py-4 text-gray-500">{order.createdAt?.substring(0, 10)}</td>
                        <td className="px-4 py-4 font-black text-red-600">৳{order.totalPrice}</td>
                        
                        {/* Paid Selection */}
                        <td className="px-4 py-4">
                          <select 
                            value={order.paymentStatus || (order.isPaid ? "paid" : "due")}
                            onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                            disabled={updatingOrderId === order._id}
                            className="bg-gray-100 border-none text-[10px] font-bold p-1.5 rounded cursor-pointer outline-none focus:ring-1 focus:ring-black"
                          >
                            <option value="paid">PAID</option>
                            <option value="due">DUE</option>
                            <option value="pending">PENDING</option>
                            <option value="failed">FAILED</option>
                          </select>
                        </td>

                        {/* Paid Status Label */}
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-[4px] text-[9px] font-black uppercase ${
                            (order.paymentStatus === "paid" || order.isPaid) ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          }`}>
                            {order.paymentStatus?.toUpperCase() || (order.isPaid ? "PAID" : "DUE")}
                          </span>
                        </td>

                        {/* Delivered Date */}
                        <td className="px-4 py-4 text-[10px] text-gray-400 font-bold uppercase">
                          {order.isDelivered === "Delivered" ? order.deliveredAt?.substring(0, 10) : "PENDING"}
                        </td>

                        {/* Main Status Dropdown (Fixed Value) */}
                        <td className="px-4 py-4">
                          <select
                            value={order.isDelivered || "Order Placed"} 
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            disabled={updatingOrderId === order._id}
                            className={`p-2 text-[10px] font-black rounded border-none uppercase outline-none cursor-pointer transition-colors ${
                              order.isDelivered === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-4 text-center">
                          <Link to={`/order/${order._id}`}>
                            <button className="bg-black text-white px-4 py-2 text-[10px] tracking-widest hover:bg-red-600 transition-all uppercase font-bold rounded">
                              More
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Pagination Terminal */}
            {!isDashboard && (
              <div className="mt-8 flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-gray-400">
                <span>Displaying {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} Logs</span>
                <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(p => p - 1)} 
                    className="px-5 py-2 border border-gray-200 bg-white text-black hover:bg-black hover:text-white transition-all disabled:opacity-20 uppercase"
                  >
                    Prev
                  </button>
                  <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(p => p + 1)} 
                    className="px-5 py-2 border border-gray-200 bg-white text-black hover:bg-black hover:text-white transition-all disabled:opacity-20 uppercase"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderList;