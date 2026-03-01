import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../redux/features/cart/cartSlice";
import { FaMinus, FaPlus, FaBolt } from "react-icons/fa6";

// ✅ হেল্পার: সঠিক ফাইনাল প্রাইস পাওয়া
const getItemFinalPrice = (item) => {
  // ✅ সরাসরি _finalPrice বা _effectivePrice ব্যবহার করুন
  return Number(item._finalPrice) || 
         Number(item._effectivePrice) || 
         Number(item.finalPrice) || 
         Number(item.price) || 0;
};

// ✅ হেল্পার: বেস প্রাইস পাওয়া
const getItemBasePrice = (item) => {
  return Number(item.basePrice) || 
         Number(item.variantInfo?.variantPrice) || 
         Number(item.price) || 0;
};

// ✅ হেল্পার: ফ্লাশ সেল চেক
const isFlashSaleActive = (item) => {
  return item._flashSaleActive || 
         item.flashSaleActive || 
         (item.flashSale?.isActive && 
          new Date() >= new Date(item.flashSale.startTime) && 
          new Date() <= new Date(item.flashSale.endTime));
};

const OrderSummery = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  // ✅ সঠিক প্রাইস ক্যালকুলেশন (ফ্লাশ সেল সহ)
  const calculateItemPrice = (item) => {
    return getItemFinalPrice(item);
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

          // ✅ সঠিক প্রাইস এবং সেভিংস ক্যালকুলেশন
          const unitPrice = calculateItemPrice(item);
          const basePrice = getItemBasePrice(item);
          const hasFlashSale = isFlashSaleActive(item);
          const discountPercent = hasFlashSale 
            ? (item.flashSale?.discountPercentage || 0)
            : (item.discountPercentage || 0);
          const savingsPerUnit = basePrice - unitPrice;
          const totalSavings = savingsPerUnit * item.qty;
          
          const variantText = item.variantInfo?.hasVariants
            ? `${item.variantInfo.colorName} / ${item.variantInfo.sizeName}`
            : "";

          return (
            <div
              key={`${item._id}-${item.variantInfo?.colorIndex}-${item.variantInfo?.sizeIndex}`}
              className={`group relative flex items-center gap-4 p-3 rounded-2xl border bg-gray-50/30 hover:bg-white hover:shadow-xl transition-all duration-300 ${
                hasFlashSale 
                  ? 'border-red-100 hover:border-red-200 hover:shadow-red-50/50' 
                  : 'border-gray-50 hover:border-blue-100 hover:shadow-blue-50/50'
              }`}
            >
              {/* Product Image */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden rounded-xl bg-white border border-gray-100">
                <img
                  src={displayImage}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* ✅ ফ্লাশ সেল ব্যাজ */}
                {hasFlashSale && (
                  <div className="absolute top-0 left-0 bg-red-500 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-br-lg flex items-center gap-0.5">
                    <FaBolt size={6} />
                    FLASH
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item._id}`}
                  className={`text-sm font-mono font-black hover:transition-colors line-clamp-1 uppercase tracking-tighter ${
                    hasFlashSale ? 'text-red-600 hover:text-red-700' : 'text-gray-800 hover:text-blue-600'
                  }`}
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
                
                {/* ✅ ডিসকাউন্ট ব্যাজ */}
                {discountPercent > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                      hasFlashSale 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {hasFlashSale && <FaBolt size={6} className="inline mr-0.5" />}
                      {Math.round(discountPercent)}% OFF
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
                    <p className={`text-sm font-mono font-black ${
                      hasFlashSale ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      ৳{(item.qty * unitPrice).toLocaleString("en-BD")}
                    </p>
                    {/* ✅ সঠিক সেভিংস দেখান */}
                    {savingsPerUnit > 0 && (
                      <p className={`text-[9px] font-mono font-bold uppercase ${
                        hasFlashSale ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {hasFlashSale && <FaBolt size={6} className="inline mr-0.5" />}
                        Saved ৳{Math.round(totalSavings)}
                      </p>
                    )}
                    {/* ✅ স্ট্রাইকথ্রু প্রাইস */}
                    {savingsPerUnit > 0 && (
                      <p className="text-[9px] text-gray-400 line-through">
                        ৳{basePrice.toLocaleString("en-BD")}
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