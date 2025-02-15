import { useState } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "@redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = ({
  showAdminMenu = true,
  className = "pt-36",
  isDashboard = false,
}) => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  // State for search and filter (only if not in dashboard)
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

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
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      className={`py-5 lg:px-5 2xl:container 2xl:mx-auto w-full h-full flex justify-center items-start 2xl:pl-5 ${className}`}
    >
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="transition-all duration-300 flex-1">
          {/* Conditionally render the title */}
          {!isDashboard && (
            <h1 className="text-[22px] font-bold font-figtree text-black">
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
                className="p-2 border border-gray-300 flex-1 placeholder:text-black placeholder:text-[16px] placeholder:font-figtree"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border border-gray-300 placeholder:text-black placeholder:text-[16px] placeholder:font-figtree"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border border-gray-300 placeholder:text-black placeholder:text-[16px] placeholder:font-figtree"
                />
              </div>
              <button
                onClick={resetFilters}
                className="p-2 bg-gray-500 rounded-sm text-white hover:bg-gray-600 transition-all duration-200 placeholder:text-black placeholder:text-[16px] placeholder:font-figtree"
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
                className="mr-2 text-[16px] font-medium font-figtree text-gray-600"
              >
                Items per page:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="p-2 border border-gray-300 rounded-md text-[15px] font-medium font-figtree text-black"
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
                      DELIVERED
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
                        {order._id}
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

                      {/* Paid Status */}
                      <td className="px-4 py-3">
                        {order.isPaid ? (
                          <p className="p-2 text-center bg-green-100 text-green-600 w-[4rem] sm:w-[6rem] rounded-md text-xs sm:text-sm md:text-base font-figtree font-normal">
                            Completed
                          </p>
                        ) : (
                          <p className="p-2 text-center bg-red-100 text-red-600 w-[4rem] sm:w-[6rem] rounded-md text-xs sm:text-sm md:text-base font-figtree font-normal">
                            Pending
                          </p>
                        )}
                      </td>

                      {/* Delivered Status */}
                      <td className="px-4 py-3">
                        {order.isDelivered ? (
                          <p className="p-2 text-center bg-green-100 text-green-600 w-[4rem] sm:w-[6rem] rounded-md text-xs sm:text-sm md:text-base font-figtree font-normal ">
                            Delivered
                          </p>
                        ) : (
                          <p className="p-2 text-center bg-red-100 text-red-600 w-[4rem] sm:w-[6rem] rounded-md text-xs sm:text-sm md:text-base font-figtree font-normal">
                            Pending
                          </p>
                        )}
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

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed font-figtree font-normal text-base"
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
                      } rounded-md hover:bg-indigo-600 hover:text-white transition-all duration-200`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-base font-figtree font-normal"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
