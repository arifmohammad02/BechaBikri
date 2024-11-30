import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "@redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto py-20">
      <h2 className="text-2xl font-semibold mb-4">My Orders </h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <div className=" overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100 border">
              <tr className="text-left">
                <th className="px-4 py-3 text-gray-700 border">IMAGE</th>
                <th className="px-4 py-3 text-gray-700 border">ID</th>
                <th className="px-4 py-3 text-gray-700 border">DATE</th>
                <th className="px-4 py-3 text-gray-700 border">TOTAL</th>
                <th className="px-4 py-3 text-gray-700 border">PAID</th>
                <th className="px-4 py-3 text-gray-700 border">DELIVERED</th>
                <th className="px-4 py-3 text-gray-700 border">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-l border-r border-gray-200 hover:bg-pink-50 hover:shadow-md transition duration-200"
                >
                  <td className="px-4 py-3">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.user}
                      className="w-16 h-16 rounded-lg border border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{order._id}</td>
                  <td className="px-4 py-3 text-gray-700 text-sm">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-sm">
                    BDT {order.totalPrice}
                  </td>
                  <td className="px-4 py-3">
                    {order.isPaid ? (
                      <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                        Completed
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {order.isDelivered ? (
                      <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                        Completed
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/order/${order._id}`}>
                      <button className="px-4 py-2 text-sm font-medium text-white bg-pink-500 rounded-lg shadow hover:bg-pink-600 transition duration-200">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      )}
    </div>
  );
};

export default UserOrder;