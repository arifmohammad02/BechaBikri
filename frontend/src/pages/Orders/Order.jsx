import InvoicePDF from "../../components/InvoicePDF";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from "../../redux/api/orderApiSlice";
import { FaUser, FaCreditCard } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect } from "react";

const Order = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  // eslint-disable-next-line no-unused-vars
  const [deliverOrder] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  console.log(userInfo);
  

  useEffect(() => {
    refetch();
  }, [orderId, refetch]);

  // Calculate prices
  const itemsPrice = order?.orderItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0,
  );
  const discount = order?.orderItems.reduce(
    (acc, item) =>
      acc + (item.discountPercentage / 100) * item.qty * item.price,
    0,
  );
  const shippingCharge = order?.shippingAddress?.shippingCharge || 0;
  const totalPrice = itemsPrice - discount + shippingCharge;
  const subTotal = itemsPrice - discount;

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data.message}</Message>;

  return (
    <div className="bg-[#F3F6F9] px-3">
      <div className="container mx-auto flex flex-col gap-6 mt-8 py-16">
        {/* Order Summary Section */}
        <div className="text-center my-[52px]">
          <h3 className="md:text-[36px] text-[24px] font-bold font-mono text-[#212B36] mb-3">
            Thank you for your purchase!
          </h3>
          <h6 className="text-[16px] font-semibold font-mono max-w-[700px] mx-auto text-[#637381]">
            Thank you for choosing us! Your purchase is appreciated. We&apos;re
            committed to providing top-notch products and service. Stay tuned
            for updates on your order.
          </h6>
          <h6 className="text-[20px] font-semibold font-sans text-[#212B36] flex flex-col md:flex-row items-center justify-center gap-1 mt-2">
            Order Number:
            <span className="font-semibold text-[20px] font-sans text-[#ED6536]">
              {order.orderId}
            </span>
          </h6>
        </div>

        {/* Order Details Section */}
        <div className="flex flex-col-reverse lg:flex-row gap-5">
          {/* Left Section - Order Items */}
          <div className="bg-[#ffffff] border border-black border-opacity-15 rounded-lg lg:w-2/3 h-fit">
            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <div className="overflow-x-auto">
                <p className="text-[#000000] font-figtree font-semibold text-[22px] my-5 ml-3">
                  {order.orderItems.reduce(
                    (total, item) => total + item.qty,
                    0,
                  )}{" "}
                  Items
                </p>
                <table className="w-full">
                  <thead>
                    <tr className="text-[#242424] bg-[#0174E6] font-normal">
                      <th className="pl-3 py-6 text-left text-white font-serif font-medium text-[14px]">
                        Product
                      </th>
                      <th className="text-white font-serif font-medium text-[14px] text-center">
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
                        <td className="p-3 text-right text-[#242424] font-sans text-[15px] font-medium">
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
                  <tbody>
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
                        -₹ 00.00
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

          {/* Right Section - Customer and Payment Details */}
          <div className="w-full lg:w-1/3 rounded-xl overflow-hidden">
            <div className="flex flex-col gap-10">
              {/* Customer Details */}
              <div className="bg-[#0171E0] border border-gray-200 p-5 rounded-xl">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-16 h-16 bg-blue-100 rounded-full flex justify-center items-center bg-opacity-20">
                    <FaUser className="text-2xl text-[#FFFFFF]" />
                  </span>
                  <h2 className="text-2xl font-semibold font-serif text-[#FFFFFF]">
                    Customer Details
                  </h2>
                </div>
                <p className="mb-2 font-medium text-[#FFFFFF] font-figtree text-[14px]">
                  <strong>Name:</strong> {order?.shippingAddress?.name}
                </p>
                <p className="mb-2 font-medium text-[#FFFFFF] font-figtree text-[14px]">
                  <strong>Phone:</strong> {order?.shippingAddress?.phoneNumber}
                </p>
                <p className="mb-2 font-medium text-[#FFFFFF] font-figtree text-[14px]">
                  <strong>Email:</strong> {order?.user?.email}
                </p>
                <p className="mb-2 font-medium text-[#FFFFFF] font-figtree text-[14px]">
                  <strong>Address:</strong> {order?.shippingAddress?.address},{" "}
                  {order?.shippingAddress?.city}{" "}
                  {order?.shippingAddress?.postalCode},{" "}
                  {order?.shippingAddress?.country}
                </p>
              </div>

              {/* Payment Details */}
              <div className="bg-[#0171E0] border border-gray-200 p-5 rounded-xl">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-16 h-16 bg-blue-100 rounded-full flex justify-center items-center bg-opacity-20">
                    <FaCreditCard className="text-2xl text-[#FFFFFF]" />
                  </span>
                  <h2 className="text-2xl font-semibold font-serif text-[#FFFFFF]">
                    Payment Details
                  </h2>
                </div>
                <p className="mb-2 font-medium text-[#FFFFFF] font-figtree text-[14px]">
                  <strong>Payment Method:</strong> {order?.paymentMethod}
                </p>
                <p className="mb-2 font-medium text-[#FFFFFF] font-figtree text-[14px]">
                  <strong className=" capitalize">Payment Status:</strong> {order.paymentStatus}
                </p>
                <p className="mb-2 font-medium text-[#FFFFFF] font-figtree text-[14px]">
                  <strong>Delivery Status:</strong> {order.isDelivered}
                </p>
                <p className="mb-2 font-medium text-[#FFFFFF] font-figtree text-[14px]">
                  <strong>Shipping Fee:</strong> {order?.shippingAddress?.shippingCharge}
                </p>
                <div className="bg-transparent font-medium text-[#FFFFFF] font-serif">
                 <p className="font-medium text-[#FFFFFF] font-figtree text-[14px]">
                     <strong>Order Date:</strong> {order?.paidAt}
                      </p>
                </div>
              </div>

              {/* Mark as Delivered Button (Admin Only) */}
            </div>
          </div>
        </div>

        {/* Invoice Download Button (Admin Only) */}
        {userInfo?.isAdmin && (
          <div className="flex justify-end gap-4 mt-4">
            <PDFDownloadLink
              document={<InvoicePDF order={order} />}
              fileName={`invoice_${order.orderId}.pdf`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {({ loading }) =>
                loading ? "Loading document..." : "Download Invoice"
              }
            </PDFDownloadLink>
          </div>
        )}

        {/* Hidden iframe for Printing */}
        {/* <iframe
          ref={iframeRef}
          title="Invoice PDF"
          style={{ display: "none" }}
        /> */}
      </div>
    </div>
  );
};

export default Order;
