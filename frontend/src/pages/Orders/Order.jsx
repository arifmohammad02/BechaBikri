import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from "../../redux/api/orderApiSlice";
import Message from "../../components/Message";
import { FaUser } from "react-icons/fa";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  // console.log(order);

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  // Calculate Discount and Final Total
  const itemsPrice = order?.orderItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  const discount = order?.orderItems.reduce(
    (acc, item) =>
      acc + (item.discountPercentage / 100) * item.qty * item.price,
    0
  );

  const shippingCharge = order?.shippingAddress?.shippingCharge || 0;

  const totalPrice = itemsPrice - discount + shippingCharge;
  const subTotal = itemsPrice - discount;

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="bg-[#F3F6F9]">
      <div className="container mx-auto flex flex-col gap-6 mt-8 py-16">
        <div className="text-center my-[52px]">
          <h3 className="md:text-[36px] text-[24px] font-bold font-mono text-[##212B36] mb-3">
            Thank you for your purchase!
          </h3>
          <h6 className="text-[16px] font-semibold font-mono max-w-[700px] mx-auto text-[#637381]">
            Thank you for choosing us! Your purchase is appreciated. We're
            committed to providing top-notch products and service. Stay tuned
            for updates on your order.
          </h6>
          <h6 className="text-[20px] font-semibold font-sans text-[#212B36] flex flex-col md:flex-row items-center justify-center gap-1 mt-2">
            Order Number:
            <span className="font-semibold text-[20px ] font-sans  text-[#ED6536] ">
              {order._id}
            </span>
          </h6>
        </div>

        {/* Left Section */}
        <div className="flex flex-col-reverse lg:flex-row gap-5">
          <div className="bg-[#FFFFFF] border-[2px] rounded-lg lg:w-2/3 shadow-md">
            <div className="">
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <div className="overflow-x-auto mt-5">
                  <span className="text-[#000000] font-serif font-semibold text-[22px] ml-3">
                    {order.orderItems.reduce(
                      (total, item) => total + item.qty,
                      0
                    )}{" "}
                    Items
                  </span>
                  <table className="w-full mt-5">
                    <thead className="">
                      <tr className="text-[#242424] bg-[#0174E6] font-normal">
                        <th className="p-3 text-left text-white font-serif font-medium text-[14px]">
                          Product
                        </th>
                        <th className="p-3 text-white font-serif font-medium text-[14px] text-center">
                          Quantity
                        </th>
                        <th className="p-3 text-white font-serif font-medium text-[14px] text-right">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item, index) => (
                        <tr key={index}>
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md border border-gray-300"
                            />
                            <Link
                              to={`/product/${item.product}`}
                              className="text-[#000000] font-serif text-[15px] font-medium"
                            >
                              {item.name}
                            </Link>
                          </td>
                          <td className="p-3 text-center text-[#000000] text-[14px] font-serif font-medium">
                            {item.qty}
                          </td>
                          <td className="p-3 text-right text-[#242424] font-sens text-[15px] font-medium">
                            ₹
                            {(
                              item.qty *
                              (item.price -
                                (item.discountPercentage / 100) * item.price)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <table className="w-full border-t">
                    <tbody className="">
                      <tr className="bg-blue-100 ">
                        <td className="col-span-4"></td>
                        <td className="font-semibold text-[#242424] font-serif text-[16px] text-right p-3">
                          Subtotal
                        </td>
                        <td className="text-right p-3 font-semibold text-[#242424] font-sans text-[16px]">
                          ₹{subTotal.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="border-b border-opacity-65">
                        <td className="col-span-4"></td>
                        <td className="font-semibold text-[#242424] font-serif text-[16px] text-right p-3">
                          Shipping Fee
                        </td>
                        <td className="text-right font-semibold text-[#242424] font-sans text-[16px] p-3">
                          ₹{shippingCharge.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="col-span-4"></td>
                        <td className="font-semibold text-[#242424] font-serif text-[16px] text-right p-3">
                          Discount
                        </td>
                        <td className="text-right font-semibold text-[#242424] font-sans text-[16px] p-3">
                          -₹ 0.00
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="col-span-4"></td>
                        <td className="font-bold text-[#242424] font-serif text-[16px] text-right p-3">
                          Total
                        </td>
                        <td className="text-right font-bold text-[#242424] font-sans text-[16px] p-3">
                          ₹{totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          <div className="w-full lg:w-1/3 rounded-xl overflow-hidden">
            <div className="bg-[#0171E0] border border-gray-200 p-5 rounded-xl">
              <div className=" flex items-center gap-3 mb-5">
                <span className="w-16 h-16 bg-blue-100 rounded-full flex justify-center items-center bg-opacity-20">
                  <FaUser className="text-2xl text-[#FFFFFF]" />
                </span>
                <h2 className="text-2xl font-semibold font-serif text-[#FFFFFF]">
                  {" "}
                  Customer Details
                </h2>
              </div>
              <p className="mb-2 font-medium text-[#FFFFFF] font-serif">
                <strong className="font-semibold text-[#FFFFFF] font-serif ">
                  Name:
                </strong>{" "}
                {order.shippingAddress.name}
              </p>
              <p className="mb-2 font-medium text-[#FFFFFF] font-serif">
                <strong className="font-semibold text-[#FFFFFF] font-serif">
                  Email:
                </strong>{" "}
                {order.user.email}
              </p>
              <p className="mb-2 font-medium text-[#FFFFFF] font-serif">
                <strong className="font-semibold text-[#FFFFFF] font-serif">
                  Address:
                </strong>{" "}
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              <p className="mb-2 font-medium text-[#FFFFFF] font-serif">
                <strong className="font-semibold text-[#FFFFFF] font-serif">
                  Phone:
                </strong>{" "}
                {order.shippingAddress.phoneNumber}
              </p>
              <p className="mb-4 font-medium text-[#FFFFFF] font-serif">
                <strong className="font-semibold text-[#FFFFFF] font-serif">
                  Method:
                </strong>{" "}
                {order.paymentMethod}
              </p>

              <div className="bg-transparent font-medium text-[#FFFFFF] font-serif">
                {order.isPaid ? (
                  <p>Order Date: {order.paidAt}</p>
                ) : (
                  <Message variant="danger">Not paid</Message>
                )}
              </div>
              {/* {loadingDeliver && } */}
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
      </div>
    </div>
  );
};

export default Order;
