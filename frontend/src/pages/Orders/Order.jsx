import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import Message from "../../components/Message";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  // eslint-disable-next-line no-unused-vars
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const handleCODPayment = async () => {
    try {
      await payOrder({
        orderId,
        details: { paymentMethod: "Cash On Delivery" },
      });
      refetch();
      toast.success("Order marked as paid (Cash on Delivery)");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="container mx-auto flex flex-col lg:flex-row gap-6 px-4 mt-8 py-16">
      {/* Left Section */}
      <div className="w-full ">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-5">
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-gray-600">
                    <th className="p-3">Image</th>
                    <th className="p-3">Product</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="p-3 text-center">Unit Price</th>
                    <th className="p-3 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100">
                      <td className="p-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md border border-gray-300"
                        />
                      </td>
                      <td className="p-3">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-pink-500 hover:underline"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-3 text-center">{item.qty}</td>
                      <td className="p-3 text-center">BDT-{item.price}</td>
                      <td className="p-3 text-center">
                        BDT-{(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-5">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Shipping</h2>
          <p className="mb-2">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>
          <p className="mb-2">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order.user.username}
          </p>
          <p className="mb-2">
            <strong className="text-pink-500">Email:</strong> {order.user.email}
          </p>
          <p className="mb-2">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          <p className="mb-2">
            <strong className="text-pink-500">Phone:</strong>{" "}
            {order.shippingAddress.phoneNumber}
          </p>
          <p className="mb-2">
            <strong className="text-pink-500">Emergency Contact:</strong>{" "}
            {order.shippingAddress.alternatePhoneNumber}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Method:</strong>{" "}
            {order.paymentMethod}
          </p>

          {order.isPaid ? (
            <Message variant="success">Paid on {order.paidAt}</Message>
          ) : (
            <Message variant="danger">Not paid</Message>
          )}
        </div>

        {/* Order Summary */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-lg p-5">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Order Summary
          </h2>
          <div className="flex justify-between mb-2 text-gray-600">
            <span>Items</span>
            <span>BDT-{order.itemsPrice}</span>
          </div>
          <div className="flex justify-between mb-2 text-gray-600">
            <span>Shipping</span>
            <span>BDT-{order.shippingPrice}</span>
          </div>
          <div className="flex justify-between mb-4 text-gray-600 font-semibold">
            <span>Total</span>
            <span>BDT-{order.totalPrice}</span>
          </div>

          {!order.isPaid && (
            <button
              className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              onClick={handleCODPayment}
            >
              Pay with Cash on Delivery
            </button>
          )}

          {loadingDeliver && <Loader />}
          {userInfo &&
            userInfo.isAdmin &&
            order.isPaid &&
            !order.isDelivered && (
              <button
                className="w-full mt-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Order;
