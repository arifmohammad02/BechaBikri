/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { FaLongArrowAltRight } from "react-icons/fa";
import { motion } from "framer-motion";

const AddToCartButton = ({
  product,
  qty = 1,
  buttonText = "Add to Cart",
  addedText = "Added to Cart",
  customStyles = "",
  isOrderNow = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


const cartItems = useSelector((state) => state.cart.cartItems);

  // ✅ FIXED: Early return if no product
  if (!product) {
    return (
      <button disabled className="opacity-50 cursor-not-allowed px-4 py-2 rounded-xl bg-gray-200 text-gray-400">
        Loading...
      </button>
    );
  }



  const isAdded = cartItems.some((item) => {
    const sameProduct = item._id === product._id;
    if (!sameProduct) return false;
    
    if (product?.variantInfo?.hasVariants) {
      return (
        item.variantInfo?.colorIndex === product.variantInfo.colorIndex &&
        item.variantInfo?.sizeIndex === product.variantInfo.sizeIndex
      );
    }
    
    return true;
  });

  const mainImage =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images[0]
      : product?.image || "/placeholder.jpg";

  // ✅ FIXED: Complete cart item with all required fields
  const createCartItem = () => ({
    _id: product._id,
    name: product.name,
    price: product.price || product.basePrice,
    finalPrice: product.finalPrice || product._effectivePrice || product.price,
    basePrice: product.basePrice,
    _flashSaleActive: product._flashSaleActive,
    _effectivePrice: product._effectivePrice,
    effectivePrice: product.effectivePrice || product._effectivePrice,
    flashSale: product.flashSale, // ✅ REQUIRED for cartSlice
    discountPercentage: product.discountPercentage, // ✅ REQUIRED for cartSlice
    qty,
    image: mainImage,
    variantInfo: product.variantInfo || {
      hasVariants: false,
      colorIndex: null,
      colorName: "",
      colorHex: "",
      sizeIndex: null,
      sizeName: "",
      variantPrice: null,
      sku: "",
      countInStock: 0,
    },
    shippingDetails: product.shippingDetails, // ✅ REQUIRED for shipping calc
    weight: product.weight || 0.5, // ✅ REQUIRED for shipping calc
  });

  const handleAddToCart = () => {
    // ✅ FIXED: Stock check using variantInfo.countInStock
    if (product.variantInfo?.hasVariants) {
      const stock = product.variantInfo.countInStock;
      if (stock !== undefined && stock < qty) {
        toast.error(`Only ${stock} units available for this variant!`);
        return;
      }
    } else if (product.countInStock < qty) {
      toast.error(`Only ${product.countInStock} units available!`);
      return;
    }

    if (!isAdded) {
      const cartItem = createCartItem();
      dispatch(addToCart(cartItem));
      
      const variantText = product.variantInfo?.hasVariants
        ? ` (${product.variantInfo.colorName} / ${product.variantInfo.sizeName})`
        : "";
      
      toast.success(`${product.name}${variantText} added to cart!`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const handleOrderNow = () => {
    if (product.variantInfo?.hasVariants) {
      const stock = product.variantInfo.countInStock;
      if (stock !== undefined && stock < qty) {
        toast.error(`Only ${stock} units available for this variant!`);
        return;
      }
    } else if (product.countInStock < qty) {
      toast.error(`Only ${product.countInStock} units available!`);
      return;
    }

    const cartItem = createCartItem();
    dispatch(addToCart(cartItem));
    navigate("/shipping");
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-stretch gap-3">
      <div className="flex">
        <motion.button
          whileTap={!isAdded && product.countInStock !== 0 ? { scale: 0.97 } : {}}
          transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.6 }}
          onClick={handleAddToCart}
          disabled={isAdded || product.countInStock === 0}
          className={`group relative flex items-center justify-center gap-3 px-2 py-2 font-bold text-[14px] uppercase font-trebuchet rounded-xl border overflow-hidden transition-all duration-500
            ${isAdded
              ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
              : "border-[#2C3A96] text-[#2C3A96] bg-white hover:bg-[#2C3A96]"
            } ${customStyles}`}
        >
          {!isAdded && (
            <span className="absolute inset-0 bg-[#2C3A96] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}
          <CiShoppingCart className={`relative z-10 text-[18px] transition-all duration-500
            ${!isAdded ? "group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:text-white" : ""}`}
          />
          <span className={`relative z-10 transition-all duration-500
            ${!isAdded ? "group-hover:text-white" : ""}`}>
            {isAdded ? addedText : buttonText}
          </span>
        </motion.button>
      </div>

      {isOrderNow && (
        <div className="flex-[1.5] flex flex-col">
          <motion.button
            whileHover={product.countInStock !== 0 ? {
              scale: 1.01,
              backgroundColor: "#1e286e",
              boxShadow: "0 10px 20px -10px rgba(44, 58, 150, 0.5)",
            } : {}}
            whileTap={product.countInStock !== 0 ? { scale: 0.98 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={handleOrderNow}
            disabled={product.countInStock === 0}
            className="group relative flex items-center justify-center px-3 py-2 bg-[#2C3A96] text-white rounded-md font-bold font-trebuchet text-[14px] uppercase transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed overflow-hidden"
          >
            <motion.span
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/15 to-white/0 pointer-events-none"
            />
            <span className="relative flex items-center gap-2">
              Order Now
              <FaLongArrowAltRight className="text-xl group-hover:translate-x-1.5 transition-transform duration-300" />
            </span>
          </motion.button>

          {product.countInStock <= 5 && product.countInStock > 0 && (
            <p className="text-center text-[11px] font-bold text-orange-500 mt-2 tracking-wide">
              Only {product.countInStock} units left!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;