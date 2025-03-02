import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "@redux/api/orderApiSlice";
import Sidebar from "../../components/Sidebar";
import { BsThreeDots } from "react-icons/bs";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="mt-[100px]">
      <div className="py-4 bg-[#E8E8E8]">
        <div className="container mx-auto flex items-center gap-2 px-3 sm:px-0">
          <Link
            to="/"
            className="text-[#000000] font-normal font-poppins text-[15px]"
          >
            Home
          </Link>
          <span className="text-[#000000] font-normal font-poppins text-[15px] ">
            /
          </span>
          <span className="text-[#9B9BB4] font-normal font-poppins text-[15px]">
            Order List
          </span>
        </div>
      </div>
      <div className="flex container mx-auto flex-col lg:flex-row lg:items-start py-10 gap-10 px-3 xs:px-0">
        <Sidebar />

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.error || error.error}
          </Message>
        ) : (
          <div className=" overflow-x-auto w-full border p-5 rounded-md">
            <h2 className="text-[23px] font-semibold text-[#3C3836] font-dosis mb-4">
              Order List
            </h2>
            <table className="w-full bg-white border">
              <thead className="bg-[#F9F1E7] text-base font-poppins font-normal border">
                <tr className="text-left">
                  <th className="text-center px-4 py-3 text-sm sm:text-base font-figtree font-bold text-[#3C3836] border uppercase">
                    ORDER ID
                  </th>
                  <th className="text-center px-4 py-3 text-sm sm:text-base font-figtree font-bold text-[#3C3836] border uppercase">
                    DATE
                  </th>
                  <th className="text-center px-4 py-3 text-sm sm:text-base font-figtree font-bold text-[#3C3836] border uppercase">
                    TOTAL
                  </th>
                  <th className="text-center px-4 py-3 text-sm sm:text-base font-figtree font-bold text-[#3C3836] border uppercase">
                    Payment Status
                  </th>
                  <th className="text-center px-4 py-3 text-sm sm:text-base font-figtree font-bold text-[#3C3836] border uppercase">
                    Order Status
                  </th>
                  <th className="text-center px-4 py-3 text-sm sm:text-base font-figtree font-bold text-[#3C3836] border uppercase">
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-l border-r border-gray-200"
                  >
                    <td className="text-center text-[#3C3836] text-[15px] font-poppins font-normal">
                      {order.orderId}
                    </td>
                    <td className="text-center text-[#3C3836] text-[15px] font-poppins font-normal">
                      {order.createdAt.substring(0, 10)}
                    </td>
                    <td className="text-center text-[#3C3836] text-[15px] font-poppins font-normal">
                      ₹{order.totalPrice}
                    </td>
                    <td className="text-center">
                      {order.isPaid ? (
                        <span className="text-center text-[#3C3836] text-[15px] font-poppins font-normal">
                          Completed
                        </span>
                      ) : (
                        <span className="text-center text-[#3C3836] text-[15px] font-poppins font-normal">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="text-center text-[#3C3836] text-[15px] font-poppins font-normal">
                      {order.isDelivered}
                    </td>
                    <td className="text-center py-5">
                      <Link to={`/order/${order._id}`}>
                        <button className="text-center text-[#3C3836] text-[15px] font-poppins font-normal">
                          <BsThreeDots />
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
    </div>
  );
};

export default UserOrder;
