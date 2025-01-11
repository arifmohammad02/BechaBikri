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
            <thead className="bg-[#F9F1E7] text-base font-poppins font-normal border">
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
                  className="border-b border-l border-r border-gray-200 hover:bg-[#F9F1E7] hover:shadow-md transition duration-200"
                >
                  <td className="px-4 py-3">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.user}
                      className="w-16 h-16 rounded-lg border border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 text-[#9F9F9F] font-poppins font-normal text-sm">
                    {order._id}
                  </td>
                  <td className="px-4 py-3 text-[#9F9F9F] font-poppins font-normal text-sm">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="px-4 py-3 text-[#9F9F9F] font-poppins font-normal text-sm">
                    ₹{order.totalPrice}
                  </td>
                  <td className="px-4 py-3">
                    {order.isPaid ? (
                      <span className="px-3 py-1 text-xs text-center font-medium  font-sans text-white bg-[#B88E2F] rounded-full">
                        Completed
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-medium font-poppins text-white bg-[#242424] rounded-full">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {order.isDelivered ? (
                      <span className="px-3 py-1 text-xs text-center font-medium  font-sans text-white bg-[#B88E2F] rounded-full">
                        Completed
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs  font-medium font-poppins text-white bg-[#242424]   rounded-full">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/order/${order._id}`}>
                      <button className="px-4 py-2 text-sm font-medium font-sans text-white bg-[#B88E2F] rounded-md  transition duration-200">
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
