/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { FaLongArrowAltRight } from "react-icons/fa";
// UPDATE START
import { motion } from "framer-motion";
// UPDATE END

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

 const isAdded = cartItems.some((item) => {
    const sameProduct = item._id === product?._id;
    if (!sameProduct) return false;
    
    // If product has variants, check variant match
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

  const handleAddToCart = () => {
    if (!product) {
      toast.error("Product information is missing!");
      return;
    }

    // Check stock for variants
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
      const cartItem = {
        ...product,
        qty,
        image: mainImage,
        // Ensure variant info is included
        variantInfo: product.variantInfo || {
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
      
      dispatch(addToCart(cartItem));
      
      // Show variant info in toast if applicable
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
    if (!product) {
      toast.error("Product information is missing!");
      return;
    }

    // Check stock for variants
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

    const cartItem = {
      ...product,
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
      },
    };
    
    dispatch(addToCart(cartItem));
    navigate("/shipping");
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-stretch gap-3">
      {/* UPDATE START */}
      <div className="flex">
        <motion.button
          whileTap={
            !isAdded && product.countInStock !== 0 ? { scale: 0.97 } : {}
          }
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 22,
            mass: 0.6,
          }}
          onClick={handleAddToCart}
          disabled={isAdded || product.countInStock === 0}
          className={`group relative flex items-center justify-center gap-3 px-2 py-2 font-bold text-[14px] uppercase font-trebuchet rounded-xl border overflow-hidden transition-all duration-500
    ${
      isAdded
        ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
        : "border-[#2C3A96] text-[#2C3A96] bg-white hover:bg-[#2C3A96]"
    } ${customStyles}`}
        >
          {/* subtle background sweep */}
          {!isAdded && (
            <span className="absolute inset-0 bg-[#2C3A96] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}

          <CiShoppingCart
            className={`relative z-10 text-[18px] transition-all duration-500
      ${
        !isAdded
          ? "group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:text-white"
          : ""
      }`}
          />

          <span
            className={`relative z-10 transition-all duration-500
      ${!isAdded ? "group-hover:text-white" : ""}`}
          >
            {isAdded ? addedText : buttonText}
          </span>
        </motion.button>
        {/* UPDATE END */}
      </div>

      {/* Modern Order Now Button with Smooth Motion */}
      {isOrderNow && (
        <div className="flex-[1.5] flex flex-col">
          <motion.button
            whileHover={
              product.countInStock !== 0
                ? {
                    scale: 1.01,
                    backgroundColor: "#1e286e",
                    boxShadow: "0 10px 20px -10px rgba(44, 58, 150, 0.5)",
                  }
                : {}
            }
            whileTap={product.countInStock !== 0 ? { scale: 0.98 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={handleOrderNow}
            disabled={product.countInStock === 0}
            className="group relative flex items-center justify-center px-3 py-2 bg-[#2C3A96] text-white rounded-md font-bold font-trebuchet text-[14px] uppercase transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed overflow-hidden"
          >
            {/* Glossy Overlay effect */}
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

          {/* Stock Indicator */}
          {product.countInStock <= 5 && product.countInStock > 0 && (
            <p className="text-center text-[11px] font-bold text-orange-500 mt-2 tracking-wide">
              Only {product.countInStock} units left!
            </p>
          )}
        </div>
      )}
      {/* UPDATE END */}
    </div>
  );
};

export default AddToCartButton;
