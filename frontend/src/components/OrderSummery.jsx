import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../redux/features/cart/cartSlice";
import { FaMinus, FaPlus } from "react-icons/fa6";

const OrderSummery = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const calculateDiscountedPrice = (item) => {
    const price = item.variantInfo?.variantPrice || item.price || 0;
    return item.discountPercentage > 0
      ? price - (price * item.discountPercentage) / 100
      : price;
  };

  return (
    <div className="w-full bg-white rounded-[2rem] p-2 transition-all duration-500">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-xl font-mono font-black text-gray-900 uppercase tracking-tighter">
          Items <span className="text-blue-600 ml-1">({cartItems.length})</span>
        </h3>
        <Link 
          to="/cart" 
          className="text-[11px] font-mono font-black text-blue-600 hover:text-black uppercase tracking-widest border-b-2 border-blue-100 hover:border-black transition-all"
        >
          Edit Cart
        </Link>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {cartItems.map((item) => {
          const displayImage = Array.isArray(item?.images) && item.images.length > 0 
            ? item.images[0] 
            : item?.image || "/placeholder.jpg";

          const unitPrice = calculateDiscountedPrice(item);
          const variantText = item.variantInfo?.hasVariants
            ? `${item.variantInfo.colorName} / ${item.variantInfo.sizeName}`
            : "";

          return (
            <div
              key={`${item._id}-${item.variantInfo?.colorIndex}-${item.variantInfo?.sizeIndex}`}
              className="group relative flex items-center gap-4 p-3 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden rounded-xl bg-white border border-gray-100">
                <img
                  src={displayImage}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Info Section */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item._id}`}
                  className="text-sm font-mono font-black text-gray-800 hover:text-blue-600 transition-colors line-clamp-1 uppercase tracking-tighter"
                >
                  {item.name}
                </Link>
                
                {/* Variant Info */}
                {item.variantInfo?.hasVariants && (
                  <div className="flex items-center gap-1 mt-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.variantInfo.colorHex }}
                    />
                    <span className="text-[10px] text-gray-500 font-mono">
                      {variantText}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-2">
                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-white border border-gray-100 p-1 rounded-lg shadow-sm">
                    <button
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all disabled:opacity-20"
                      onClick={() => item.qty > 1 && addToCartHandler(item, item.qty - 1)}
                      disabled={item.qty === 1}
                    >
                      <FaMinus size={8} />
                    </button>
                    <span className="px-3 text-xs font-mono font-black text-gray-800">
                      {item.qty}
                    </span>
                    <button
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all"
                      onClick={() => addToCartHandler(item, item.qty + 1)}
                    >
                      <FaPlus size={8} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-sm font-mono font-black text-gray-900">
                      ৳{(item.qty * unitPrice).toLocaleString("en-BD")}
                    </p>
                    {item.discountPercentage > 0 && (
                      <p className="text-[9px] font-mono font-bold text-green-500 uppercase">
                        Saved ৳{Math.round(((item.variantInfo?.variantPrice || item.price) - unitPrice) * item.qty)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {cartItems.length === 0 && (
        <div className="py-10 text-center">
          <p className="font-mono text-gray-400 text-sm uppercase tracking-widest">Cart is empty</p>
          <Link 
            to="/shop" 
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white text-xs font-mono font-black rounded-xl hover:bg-black transition-all"
          >
            Go To Shop
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderSummery;