import React from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../redux/features/cart/cartSlice";

const OrderSummery = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const calculateDiscountedPrice = (product) => {
    if (product.discountPercentage > 0) {
      return (
        product.price -
        (product.price * product.discountPercentage) / 100
      ).toFixed(2);
    }
    return product.price.toFixed(2);
  };

  return (
    <div className="container mx-auto mt-8">
      <div className=" ">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="border-b border-gray-300 flex flex-col items-center md:flex-row"
          >
            {/* Product Info */}
            <div className="py-4 px-6 flex flex-col md:flex-row items-center border-b-[1px] md:border-b-0 w-full md:w-auto">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg border border-gray-200 mb-2 md:mb-0 md:mr-4"
              />
              <Link
                to={`/product/${item._id}`}
                className="text-[#000000] text-center text-[14px] md:text-[16px] font-mono font-medium flex items-center"
              >
                {item.name}<span className="flex items-center"><IoMdClose className="text-[10px]"/>{item.qty}</span>
              </Link>
            </div>

            {/* Price */}
            <div className="py-4 px-6 text-[#000000] text-[14px] md:text-[16px] font-mono font-bold text-center border-b-[1px] md:border-b-0 w-full md:w-auto">
              ₹{" "}
              {item.discountPercentage > 0
                ? calculateDiscountedPrice(item)
                : item.price.toFixed(2)}
            </div>

            {/* Quantity */}
            <div className="py-4 px-6 text-center border-b-[1px] md:border-b-0 w-full md:w-auto">
              <div className="flex items-center justify-center space-x-2">
                {/* Decrease Quantity Button */}
                <button
                  className={`w-8 h-8 font-bold border rounded-full text-[#000000] text-[14px] md:text-[16px] font-mono ${
                    item.qty > 1
                      ? "text-black border-gray-400"
                      : "text-gray-400 border-gray-300 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    item.qty > 1 && addToCartHandler(item, item.qty - 1)
                  }
                  disabled={item.qty === 1}
                >
                  -
                </button>

                {/* Quantity Display */}
                <span className="w-10 h-10 inline-flex items-center justify-center border rounded-full bg-gray-100 text-[#000000] text-[14px] md:text-[16px] font-mono font-bold">
                  {item.qty}
                </span>

                {/* Increase Quantity Button */}
                <button
                  className="w-8 h-8 font-bold border border-gray-400 rounded-full text-[#000000] text-[14px] md:text-[16px] font-mono hover:bg-gray-100"
                  onClick={() => addToCartHandler(item, item.qty + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="py-4 px-6 text-[#000000] text-[14px] md:text-[16px] font-mono font-bold text-center">
              ₹{" "}
              {(
                item.qty *
                (item.discountPercentage > 0
                  ? calculateDiscountedPrice(item)
                  : item.price)
              ).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSummery;
