
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import Sidebar from "../../components/Sidebar";
import { BsEye } from "react-icons/bs";
import { motion } from "framer-motion";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="mt-[100px] bg-[#F8FAFC] min-h-screen">
      {/* 🟢 Breadcrumb */}
      <div className="py-6 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 flex items-center gap-2 text-sm font-mono uppercase tracking-wider">
          <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-blue-600 font-bold">Order History</span>
        </div>
      </div>

      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col lg:flex-row gap-10">
          <Sidebar />

          <div className="flex-1">
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">
                {error?.data?.error || error.error}
              </Message>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Header */}
                <div className="p-8 border-b border-gray-50">
                  <h2 className="text-2xl font-mono font-black text-gray-900 uppercase tracking-tighter">
                    My <span className="text-blue-600">Orders</span>
                  </h2>
                  <p className="text-gray-400 text-xs font-mono mt-1 uppercase">Track and manage your recent purchases</p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 text-[11px] font-mono font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                        <th className="px-6 py-5">Order ID</th>
                        <th className="px-6 py-5">Date</th>
                        <th className="px-6 py-5 text-center">Payment Status</th>
                        <th className="px-6 py-5 text-center">Order Status</th>
                        <th className="px-6 py-5 text-center">Amount</th>
                        <th className="px-6 py-5 text-right">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50/30 transition-colors group">
                          <td className="px-6 py-5">
                            <span className="text-xs font-mono font-bold text-blue-600">#{order.orderId}</span>
                          </td>
                          <td className="px-6 py-5 text-xs font-mono text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          
                          {/* Payment Status from Backend */}
                          <td className="px-6 py-5 text-center">
                            <span className={`text-[10px] font-mono font-black px-3 py-1 rounded-full uppercase 
                              ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {order.paymentStatus}
                            </span>
                          </td>

                          {/* Order Status from Backend */}
                          <td className="px-6 py-5 text-center">
                            <span className={`text-[10px] font-mono font-black px-3 py-1 rounded-full uppercase 
                              ${order.isDelivered === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                              {order.isDelivered}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-center font-mono font-bold text-gray-900">
                            ৳{order.totalPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <Link to={`/order/${order._id}`}>
                              <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest hover:bg-blue-600 transition-all group-hover:scale-105">
                                <BsEye size={14} /> Details
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {orders.length === 0 && (
                  <div className="p-20 text-center">
                    <p className="font-mono text-gray-400 uppercase tracking-widest">No orders found.</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrder;