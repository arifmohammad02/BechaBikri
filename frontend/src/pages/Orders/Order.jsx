
import InvoicePDF from "../../components/InvoicePDF";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from "../../redux/api/orderApiSlice";
import { FaUser, FaCreditCard, FaTruckFast, FaFileInvoiceDollar } from "react-icons/fa6";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect } from "react";
import { motion } from "framer-motion";

const Order = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    refetch();
  }, [orderId, refetch]);

  // --- 🛠️ ব্যাকএন্ড ডেটা অনুযায়ী ক্যালকুলেশন ---
  // এখানে নিজে থেকে কোনো লজিক যোগ না করে সরাসরি ডাটাবেসের ভ্যালু ব্যবহার করা হয়েছে
  const itemsPrice = order?.itemsPrice || 0;
  const shippingCharge = order?.shippingPrice || 0;
  const totalPrice = order?.totalPrice || 0;

  // প্রোডাক্ট লিস্টে দেখানোর জন্য ডিসকাউন্টেড প্রাইস ক্যালকুলেশন
  const calculateFinalPrice = (item) => {
    const price = Number(item.price);
    const discount = item.discountPercentage > 0 ? (price * item.discountPercentage) / 100 : 0;
    return (price - discount).toFixed(2);
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data.message}</Message>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      <div className="container mx-auto px-4 mt-[100px]">
        
        {/* 🟢 ১. সাকসেস হেডার */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-mono font-black text-gray-900 uppercase tracking-tighter">
            Order <span className="text-blue-600">Confirmed!</span>
          </h1>
          <p className="text-gray-500 font-mono text-sm mt-4 max-w-2xl mx-auto uppercase tracking-wide">
            Thank you for choosing AriX GeaR. Your order has been placed and is being processed.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border border-gray-200 shadow-sm">
            <span className="text-gray-400 font-mono text-xs font-bold uppercase">Order ID:</span>
            <span className="text-blue-600 font-mono font-black">{order.orderId || order?._id}</span>
          </div>
        </motion.div>

        <div className="flex flex-col-reverse lg:flex-row gap-8">
          
          {/* 🟢 ২. বাম পাশ - প্রোডাক্ট লিস্ট */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-xl font-mono font-black uppercase tracking-tighter">Ordered Items</h3>
                <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-mono font-bold">
                  {order.orderItems.length} Products
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 text-left text-[11px] font-mono font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-8 py-4">Product</th>
                      <th className="px-8 py-4 text-center">Qty</th>
                      <th className="px-8 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {order.orderItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-2xl border border-gray-100" />
                            <div>
                              <Link to={`/product/${item.product}`} className="text-sm font-mono font-black text-gray-900 hover:text-blue-600 transition-colors uppercase">
                                {item.name}
                              </Link>
                              <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase">Unit: ৳{item.price}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center font-mono font-bold text-gray-600">{item.qty}</td>
                        <td className="px-8 py-6 text-right font-mono font-black text-gray-900">
                          ৳{(item.qty * Number(calculateFinalPrice(item))).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 🟢 ৩. সামারি সেকশন (সরাসরি ব্যাকএন্ড ভ্যালু) */}
              <div className="p-8 bg-gray-50/50 border-t border-gray-100">
                <div className="space-y-3 max-w-xs ml-auto">
                  <div className="flex justify-between text-sm font-mono text-gray-500 font-bold uppercase">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-black">৳{Number(itemsPrice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-mono text-gray-500 font-bold uppercase">
                    <span>Shipping</span>
                    <span className="text-gray-900 font-black">
                      {Number(shippingCharge) === 0 ? "FREE" : `৳${Number(shippingCharge).toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-lg font-mono font-black text-gray-900 uppercase">Total</span>
                    <span className="text-2xl font-mono font-black text-blue-600">৳{Number(totalPrice).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🟢 ৪. ডান পাশ - কাস্টমার এবং পেমেন্ট ডিটেইলস */}
          <div className="lg:w-1/3 space-y-6">
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  <FaUser size={20} />
                </div>
                <h3 className="text-lg font-mono font-black uppercase tracking-tighter">Customer Info</h3>
              </div>
              <div className="space-y-4 font-mono">
                <div>
                  <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">Name</label>
                  <p className="text-sm font-bold text-gray-800 uppercase">{order?.shippingAddress?.name}</p>
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">Contact</label>
                  <p className="text-sm font-bold text-gray-800">{order?.shippingAddress?.phoneNumber}</p>
                  <p className="text-xs text-gray-500">{order?.user?.email}</p>
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">Delivery Address</label>
                  <p className="text-sm font-bold text-gray-800 uppercase leading-relaxed">
                    {order?.shippingAddress?.address}, {order?.shippingAddress?.city} - {order?.shippingAddress?.postalCode}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  <FaCreditCard size={20} />
                </div>
                <h3 className="text-lg font-mono font-black uppercase tracking-tighter">Status</h3>
              </div>
              <div className="space-y-6 font-mono">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Payment</span>
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Delivery</span>
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase ${order.isDelivered ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {order.isDelivered}
                  </span>
                </div>
              </div>
            </div>

            {userInfo?.isAdmin && (
              <div className="flex flex-col gap-3 pt-4">
                
                
                {!order.isDelivered && (
                   <button 
                    onClick={() => deliverOrder(orderId)}
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-4 rounded-2xl font-mono font-black uppercase tracking-widest text-xs hover:bg-green-600 transition-all">
                     <FaTruckFast /> Mark As Delivered
                   </button>
                )}
              </div>
            )}

            <PDFDownloadLink
                  document={<InvoicePDF order={order} />}
                  fileName={`invoice_${order.orderId}.pdf`}
                  className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 rounded-2xl font-mono font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all"
                >
                  {({ loading }) => loading ? "Generating..." : <><FaFileInvoiceDollar /> Download Invoice</>}
                </PDFDownloadLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;