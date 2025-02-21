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
import { FaCreditCard } from "react-icons/fa6";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  console.log(order);

  const [deliverOrder] = useDeliverOrderMutation();
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
              {order.orderId}
            </span>
          </h6>
        </div>

        {/* Left Section */}
        <div className="flex flex-col-reverse lg:flex-row gap-5">
          <div className="bg-[#ffffff] border border-black border-opacity-15 rounded-lg lg:w-2/3 h-fit">
            <div className="">
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <div className="overflow-x-auto">
                  <p className="text-[#000000] font-figtree font-semibold text-[22px] my-5 ml-3">
                    {order.orderItems.reduce(
                      (total, item) => total + item.qty,
                      0
                    )}{" "}
                    Items
                  </p>
                  <table className="w-full">
                    <thead className="">
                      <tr className="text-[#242424] bg-[#0174E6] font-normal">
                        <th className="pl-3 py-6 text-left text-white font-serif font-medium text-[14px]">
                          Product
                        </th>
                        <th className=" text-white font-serif font-medium text-[14px] text-center">
                          Quantity
                        </th>
                        <th className="pr-3 text-white font-serif font-medium text-[14px] text-right">
                          Price
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {order.orderItems.map((item, index) => (
                        <tr key={index}>
                          <td className="pl-3 py-6 flex items-center gap-3">
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
                  <table className="w-full">
                    <tbody className="">
                      <tr className="bg-blue-100 border-t-2 border-gray-300">
                        <td className="col-span-4"></td>
                        <td className="font-semibold text-[#242424] font-serif text-[16px] text-right py-5">
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
            <div className="flex flex-col gap-10">
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
                <p className="mb-2 font-medium text-[#FFFFFF] font-figtree text-[14px]">
                  <strong className="font-bold text-[#FFFFFF] font-figtree text-[14px]">
                    Name:
                  </strong>{" "}
                  {order?.shippingAddress?.name}
                </p>
                <p className="mb-2 font-medium text-[#FFFFFF] font-figtree text-[14px]">
                  <strong className="font-bold text-[#FFFFFF] font-figtree text-[14px]">
                    Phone:
                  </strong>{" "}
                  {order?.shippingAddress?.phoneNumber}
                </p>
                <p className="mb-2 font-medium text-[#FFFFFF] font-figtree text-[14px]">
                  <strong className="font-bold text-[#FFFFFF] font-figtree text-[14px]">
                    Email:
                  </strong>{" "}
                  {order?.user?.email}
                </p>
                <p className="mb-2 font-medium text-[#FFFFFF] font-figtree text-[14px]">
                  <strong className="font-bold text-[#FFFFFF] font-figtree text-[14px]">
                    Address:
                  </strong>{" "}
                  {order?.shippingAddress?.address},{" "}
                  {order?.shippingAddress?.city}{" "}
                  {order?.shippingAddress?.postalCode},{" "}
                  {order?.shippingAddress?.country}
                </p>
              </div>

              <div className="bg-[#0171E0] border border-gray-200 p-5 rounded-xl">
                <div className=" flex items-center gap-3 mb-5">
                  <span className="w-16 h-16 bg-blue-100 rounded-full flex justify-center items-center bg-opacity-20">
                    <FaCreditCard className="text-2xl text-[#FFFFFF]" />
                  </span>
                  <h2 className="text-2xl font-semibold font-serif text-[#FFFFFF]">
                    {" "}
                    Pyment Details
                  </h2>
                </div>
                <p className="mb-2 font-medium text-[#FFFFFF] font-figtree text-[14px]">
                  <strong className="font-bold text-[#FFFFFF] font-figtree text-[14px]">
                    Method:
                  </strong>{" "}
                  {order?.paymentMethod}
                </p>

                <p className="mb-2 font-medium text-[#FFFFFF] font-figtree text-[14px]">
                  <strong className="font-bold text-[#FFFFFF] font-figtree text-[14px]">
                    Status:
                  </strong>{" "}
                  {order?.isDelivered}
                </p>

                <p className="mb-2 font-medium text-[#FFFFFF] font-figtree text-[14px]">
                  <strong className="font-bold text-[#FFFFFF] font-figtree text-[14px]">
                    shipping Fee:
                  </strong>
                  {order?.shippingAddress?.shippingCharge}
                </p>

                <div className="bg-transparent font-medium text-[#FFFFFF] font-serif">
                  {order.isPaid ? (
                    <strong className="font-bold text-[#FFFFFF] font-figtree text-[14px] flex items-center gap-2">
                      Order Date:{" "}
                      <p className="font-medium text-[#FFFFFF] font-figtree text-[14px]">
                        {order?.paidAt}
                      </p>
                    </strong>
                  ) : (
                    <Message variant="danger">Not paid</Message>
                  )}
                </div>
              </div>
              {/* {loadingDeliver && } */}
              {userInfo &&
                userInfo?.isAdmin &&
                order?.isPaid &&
                !order?.isDelivered && (
                  <button
                    className="w-full mt-4 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-figtree font-semibold text-[14px] text-center"
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
