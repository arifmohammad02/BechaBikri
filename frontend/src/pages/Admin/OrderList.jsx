import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "@redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  console.log(orders);

  return (
    <div className="container mx-auto py-12">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="container mx-auto px-3 md:px-0 ">
          {/* Horizontal Scroll Container with Arrows */}
          <div className="relative overflow-x-auto max-w-full">
            {/* Left Arrow */}
            <button
              className=""
              onClick={() =>
                (document.getElementById("scrollable-table").scrollLeft -= 200)
              }
            ></button>

            {/* Table */}
            <div id="scrollable-table" className="overflow-x-auto">
              <table className="w-full bg-white overflow-hidden">
                <AdminMenu />

                {/* Table Header */}
                <thead className="border bg-pink-100 text-black">
                  <tr >
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg border-r">
                      ITEMS
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg border-r">
                      ID
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg border-r">
                      USER
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg border-r">
                      DATE
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg border-r">
                      TOTAL
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg border-r">
                      PAID
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg border-r">
                      DELIVERED
                    </th>
                    <th className="text-left px-4 py-3 text-sm sm:text-base md:text-lg border">
                      Action
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="text-gray-800">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-100 transition-all duration-200 border-l border-r  border-b border-gray-300"
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
                      <td className="px-4 py-3 font-medium text-gray-600 text-xs sm:text-sm md:text-base">
                        {order._id}
                      </td>

                      {/* User */}
                      <td className="px-4 py-3 text-xs sm:text-sm md:text-base">
                        {order.user ? order.user.username : "N/A"}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-xs sm:text-sm md:text-base">
                        {order.createdAt
                          ? order.createdAt.substring(0, 10)
                          : "N/A"}
                      </td>

                      {/* Total Price */}
                      <td className="px-4 py-3 font-semibold text-indigo-600 text-xs sm:text-sm md:text-base">
                        BDT {order.totalPrice}
                      </td>

                      {/* Paid Status */}
                      <td className="px-4 py-3">
                        {order.isPaid ? (
                          <p className="p-2 text-center bg-green-100 text-green-600 w-[4rem] sm:w-[6rem] rounded-full shadow text-xs sm:text-sm">
                            Completed
                          </p>
                        ) : (
                          <p className="p-2 text-center bg-red-100 text-red-600 w-[4rem] sm:w-[6rem] rounded-full shadow text-xs sm:text-sm">
                            Pending
                          </p>
                        )}
                      </td>

                      {/* Delivered Status */}
                      <td className="px-4 py-3">
                        {order.isDelivered ? (
                          <p className="p-2 text-center bg-green-100 text-green-600 w-[4rem] sm:w-[6rem] rounded-full shadow text-xs sm:text-sm">
                            Delivered
                          </p>
                        ) : (
                          <p className="p-2 text-center bg-red-100 text-red-600 w-[4rem] sm:w-[6rem] rounded-full shadow text-xs sm:text-sm">
                            Pending
                          </p>
                        )}
                      </td>

                      {/* More Button */}
                      <td className="px-4 py-3">
                        <Link to={`/order/${order._id}`}>
                          <button className="px-3 py-2 sm:px-4 sm:py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition-all duration-200 text-xs sm:text-sm md:text-base">
                            More
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right Arrow */}
            <button
              className=""
              onClick={() =>
                (document.getElementById("scrollable-table").scrollLeft += 200)
              }
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
