/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "@redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import OrderSummery from "../../components/OrderSummery";
import { motion } from "framer-motion";
import { HiOutlineShoppingBag } from "react-icons/hi";

const getItemFinalPrice = (item) => {
  return (
    Number(item._finalPrice) ||
    Number(item._effectivePrice) ||
    Number(item.finalPrice) ||
    Number(item.price) ||
    0
  );
};

const PlaceOrder = ({ 
  orderSummary, // ⭐ props থেকে নিন
  onPlaceOrder, 
  validateFields 
}) => {
  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();

  // ✅ props থেকে সরাসরি নিন
  const { subtotal, shippingCharge, totalPrice, totalSavings } = orderSummary;

  const effectivePaymentMethod =
    paymentMethod ||
    shippingAddress?.paymentMethod ||
    "Cash on Delivery";

  const isManualPayment = ["bKash", "Nagad", "Rocket", "Bank"].includes(
    effectivePaymentMethod,
  );

  const placeOrderHandler = async () => {
    if (!validateFields()) return;

    onPlaceOrder();

    try {
      setIsLoading(true);

      const orderItemsWithVariants = cartItems.map((item) => {
        const finalPrice = getItemFinalPrice(item);

        return {
          name: item.name,
          qty: Number(item.qty),
          image: item.image || (item.images && item.images[0]),
          price: finalPrice,
          product: item._id || item.product,
          discountPercentage: Number(item.discountPercentage || 0),
          flashSale: item.flashSale || null,
          _flashSaleActive:
            item._flashSaleActive || item.flashSaleActive || false,
          weight: Number(item.weight || 0.5),
          shippingDetails: {
            shippingType: item.shippingDetails?.shippingType || "weight-based",
            insideDhakaCharge: item.shippingDetails?.insideDhakaCharge || 80,
            outsideDhakaCharge: item.shippingDetails?.outsideDhakaCharge || 150,
            fixedShippingCharge: item.shippingDetails?.fixedShippingCharge || 0,
            isFreeShippingActive: item.shippingDetails?.isFreeShippingActive || false,
            freeShippingThreshold: item.shippingDetails?.freeShippingThreshold || 0,
          },
          variantInfo: item.variantInfo || {
            hasVariants: false,
            colorIndex: null,
            colorName: "",
            colorHex: "",
            sizeIndex: null,
            sizeName: "",
            variantPrice: null,
            sku: "",
          },
        };
      });

      const safeShippingAddress = {
        name: shippingAddress?.name || "",
        address: shippingAddress?.address || "",
        city: shippingAddress?.city || "",
        postalCode: shippingAddress?.postalCode || "0000",
        country: shippingAddress?.country || "Bangladesh",
        phoneNumber: shippingAddress?.phoneNumber || "",
      };

      if (
        !safeShippingAddress.postalCode ||
        safeShippingAddress.postalCode === "0000"
      ) {
        toast.error("Please enter a valid postal code!");
        setIsLoading(false);
        return;
      }

      if (!safeShippingAddress.country) {
        toast.error("Please enter your country!");
        setIsLoading(false);
        return;
      }

      if (isManualPayment) {
        const pendingOrderData = {
          orderItems: orderItemsWithVariants,
          shippingAddress: safeShippingAddress,
          paymentMethod: effectivePaymentMethod,
          itemsPrice: subtotal.toFixed(2),
          shippingPrice: shippingCharge.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
          totalSavings: totalSavings.toFixed(2),
        };

        localStorage.setItem(
          "pendingOrderData",
          JSON.stringify(pendingOrderData),
        );

        navigate(`/payment/checkout`);
      } else {
        const orderData = {
          orderItems: orderItemsWithVariants,
          shippingAddress: safeShippingAddress,
          paymentMethod: effectivePaymentMethod,
          itemsPrice: subtotal.toFixed(2),
          shippingPrice: shippingCharge.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
          totalSavings: totalSavings.toFixed(2),
        };

        const res = await createOrder(orderData).unwrap();

        toast.success("Order placed successfully! 📦");
        dispatch(clearCartItems());
        localStorage.removeItem("shippingAddress");
        localStorage.removeItem("pendingOrderData");
        navigate(`/order/${res._id}`);
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Something went wrong while placing order.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-xl text-white">
          <HiOutlineShoppingBag size={24} />
        </div>
        <h1 className="text-xl font-mono font-black uppercase text-gray-900 tracking-tighter">
          Order <span className="text-blue-600">Summary</span>
        </h1>
      </div>

      <div className="mb-8 max-h-[300px] overflow-y-auto custom-scrollbar">
        <OrderSummery />
      </div>

      <div className="space-y-4 border-t border-b border-gray-50 py-6 mb-6">
        <div className="flex justify-between items-center text-sm font-mono text-gray-500 font-bold uppercase">
          <span>Items Subtotal</span>
          <span className="text-gray-900 font-black">
            ৳{subtotal.toFixed(2)}
          </span>
        </div>

        {totalSavings > 0 && (
          <div className="flex justify-between items-center text-sm font-mono text-green-600 font-bold uppercase bg-green-50 p-2 rounded-lg">
            <span className="flex items-center gap-2">💰 You Saved</span>
            <span className="font-black">- ৳{totalSavings.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-sm font-mono text-gray-500 font-bold uppercase">
          <span>Shipping Fee</span>
          <span
            className={`${shippingCharge === 0 ? "text-green-600" : "text-blue-600"} font-black`}
          >
            {shippingCharge === 0 ? "FREE" : `৳${shippingCharge.toFixed(2)}`}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-mono font-black text-gray-900 uppercase tracking-tighter">
          Total Payable
        </span>
        <span className="text-2xl font-mono font-black text-blue-600">
          ৳{totalPrice.toFixed(2)}
        </span>
      </div>

      <motion.button
        whileHover={{ scale: !isLoading ? 1.02 : 1 }}
        whileTap={{ scale: !isLoading ? 0.98 : 1 }}
        onClick={placeOrderHandler}
        disabled={isLoading || cartItems.length === 0}
        className={`w-full py-5 rounded-2xl font-mono font-black text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
          isLoading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-black shadow-lg shadow-blue-100"
        }`}
      >
        {isLoading
          ? "Processing..."
          : isManualPayment
            ? "Proceed to Payment"
            : "Confirm My Order"}
      </motion.button>

      <p className="text-center text-[9px] text-gray-400 mt-4 font-mono uppercase tracking-widest">
        {isManualPayment
          ? "You will pay first, then order will be created"
          : "By clicking, you agree to our terms and conditions"}
      </p>
    </div>
  );
};

export default PlaceOrder;