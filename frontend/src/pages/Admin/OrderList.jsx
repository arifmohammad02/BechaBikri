/* eslint-disable react/prop-types */
import { useState } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  usePayOrderMutation,
} from "@redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = ({
  showAdminMenu = true,
  className = "pt-36",
  isDashboard = false,
}) => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [payOrder] = usePayOrderMutation(); // ✅ NEW

  const [orderStatuses, setOrderStatuses] = useState({});

  console.log(orderStatuses, orders);

  // State for search and filter (only if not in dashboard)
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    setOrderStatuses((prev) => ({ ...prev, [orderId]: newStatus })); // Select value update

    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handlePaymentStatusChange = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    try {
      // Send orderId and status to backend
      await payOrder({ orderId, status }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update payment status:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Sort orders by date (most recent first)
  const sortedOrders = orders
    ? [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  // Filter orders based on search criteria (only if not in dashboard)
  const filteredOrders = sortedOrders
    ? sortedOrders.filter((order) => {
        const matchesSearchTerm =
          order.user?.username
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?._id.toLowerCase().includes(searchTerm.toLowerCase());

        const orderDate = new Date(order.createdAt);
        const matchesStartDate = startDate
          ? orderDate >= new Date(startDate)
          : true;
        const matchesEndDate = endDate ? orderDate <= new Date(endDate) : true;

        return matchesSearchTerm && matchesStartDate && matchesEndDate;
      })
    : [];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = isDashboard
    ? sortedOrders?.slice(0, 5)
    : filteredOrders.slice(indexOfFirstItem, indexOfLastItem); // Show only 5 orders in dashboard

  // Total pages (only if not in dashboard)
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Reset filters (only if not in dashboard)
  const resetFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  // Handle items per page change (only if not in dashboard)
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Paginate function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      className={`py-5 px-3 2xl:container 2xl:mx-auto w-full h-full flex justify-center items-start ${className}`}
    >
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="transition-all duration-300 flex-1 w-full">
          {/* Conditionally render the title */}
          {!isDashboard && (
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-figtree text-black mb-4">
              Order List
            </h1>
          )}

          {/* Conditionally render search and filter section */}
          {!isDashboard && (
            <div className="my-4 flex flex-col sm:flex-row gap-4 border p-5">
              <input
                type="text"
                placeholder="Search by User Name, User ID, or Order ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 flex-1 placeholder:text-black placeholder:text-sm sm:placeholder:text-base font-figtree"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border border-gray-300 placeholder:text-black placeholder:text-sm sm:placeholder:text-base font-figtree"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border border-gray-300 placeholder:text-black placeholder:text-sm sm:placeholder:text-base font-figtree"
                />
              </div>
              <button
                onClick={resetFilters}
                className="p-2 bg-gray-500 rounded-sm text-white hover:bg-gray-600 transition-all duration-200 text-sm sm:text-base font-figtree"
              >
                Reset
              </button>
            </div>
          )}

          {/* Conditionally render items per page dropdown */}
          {!isDashboard && (
            <div className="my-4">
              <label
                htmlFor="itemsPerPage"
                className="mr-2 text-sm sm:text-base font-medium font-figtree text-gray-600"
              >
                Items per page:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="p-2 border border-gray-300 rounded-md text-sm sm:text-base font-medium font-figtree text-black"
              >
                <option value={8}>8</option>
                <option value={16}>16</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
              </select>
            </div>
          )}

          {/* Table Section */}
          <div className="relative overflow-x-auto max-w-full">
            {/* Admin Menu */}
            <div>{showAdminMenu && <AdminMenu />}</div>

            {/* Table */}
            <div id="scrollable-table" className="overflow-x-auto">
              <table className="w-full bg-white overflow-hidden">
                {/* Table Header */}
                <thead className="border bg-pink-100 text-black">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg font-figtree font-semibold text-black border-r">
                      ITEMS
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg font-figtree font-semibold text-black border-r">
                      ID
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg font-figtree font-semibold text-black border-r">
                      USER
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg font-figtree font-semibold text-black border-r">
                      DATE
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg font-figtree font-semibold text-black border-r">
                      TOTAL
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg font-figtree font-semibold text-black border-r">
                      PAID
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg font-figtree font-semibold text-black border-r">
                      PAID STATUS
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg font-figtree font-semibold text-black border-r">
                      DELIVERED
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg font-figtree font-semibold text-black border uppercase">
                      STATUS
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg font-figtree font-semibold text-black border uppercase">
                      Action
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="text-gray-800">
                  {currentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-100 transition-all duration-200 border-l border-r border-b border-gray-300"
                    >
                      {/* Item Image */}
                      <td className="px-4 py-3">
                        <img
                          src={order.orderItems[0].image}
                          alt={order._id}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                        />
                      </td>

                      {/* Order ID */}
                      <td className="px-4 py-3 text-xs sm:text-sm md:text-base font-figtree font-normal text-black">
                        {order.orderId}
                      </td>

                      {/* User */}
                      <td className="px-4 py-3 text-xs sm:text-sm md:text-base font-figtree font-normal text-black">
                        {order.user ? order.user.username : "N/A"}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-xs sm:text-sm md:text-base font-figtree font-normal text-black">
                        {order.createdAt
                          ? order.createdAt.substring(0, 10)
                          : "N/A"}
                      </td>

                      {/* Total Price */}
                      <td className="px-4 py-3 text-indigo-600 text-xs sm:text-sm md:text-base font-figtree font-normal">
                        ₹{order.totalPrice}
                      </td>

                      {/* ========================= */}
                      {/* ✅ PAID / DUE (UPDATED) */}
                      {/* ========================= */}
                      <td className="px-4 py-3">
                        <select 
                          value={
                            order.paymentStatus ||
                            (order.isPaid ? "paid" : "due")
                          }
                          onChange={(e) =>
                            handlePaymentStatusChange(order._id, e.target.value)
                          }
                          disabled={updatingOrderId === order._id}
                          className="border p-1 rounded bg-white"
                        >
                          <option value="paid">Paid</option>
                          <option value="due">Due</option>
                          <option value="pending">Pending</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                      {/*paid status */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                            order.paymentStatus === "paid" || order.isPaid
                              ? "bg-green-100 text-green-800"
                              : order.paymentStatus === "due"
                                ? "bg-red-100 text-red-800"
                                : order.paymentStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.paymentStatus
                            ? order.paymentStatus.toUpperCase()
                            : order.isPaid
                              ? "PAID"
                              : "DUE"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{order.isDelivered}</td>
                      <td className="px-4 py-3">
                        <select
                          value={orderStatuses[order._id] || order.status} // Updated status use
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          disabled={updatingOrderId === order._id}
                          className="p-1 border rounded bg-white"
                        >
                          {updatingOrderId === order._id ? (
                            <option>Updating...</option>
                          ) : (
                            <>
                              <option value="Order Placed">Order Placed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">
                                Out for Delivery
                              </option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </>
                          )}
                        </select>
                      </td>

                      {/* More Button */}
                      <td className="px-4 py-3">
                        <Link to={`/order/${order._id}`}>
                          <button className="px-3 py-2 sm:px-4 sm:py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 text-xs sm:text-sm md:text-base font-figtree font-normal">
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

          {/* Conditionally render pagination controls */}
          {!isDashboard && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed font-figtree font-normal text-sm sm:text-base"
              >
                Previous
              </button>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 uppercase font-figtree">
                  Showing {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, filteredOrders.length)} of{" "}
                  {filteredOrders.length} items
                </span>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`px-3 py-1 ${
                          currentPage === page
                            ? "bg-indigo-500 text-white"
                            : "bg-gray-200 text-black"
                        } rounded-md hover:bg-indigo-600 hover:text-white transition-all duration-200 text-sm sm:text-base`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base font-figtree font-normal"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderList;
