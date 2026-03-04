/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/cart";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: "Cash on Delivery",
      itemsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0,
      totalSavings: 0,
    };

// Helper to check if two items are the same (including variants)
const isSameItem = (item1, item2) => {
  if (item1._id !== item2._id) return false;

  // If both have variants, check variant indices
  if (item1.variantInfo?.hasVariants && item2.variantInfo?.hasVariants) {
    return (
      item1.variantInfo.colorIndex === item2.variantInfo.colorIndex &&
      item1.variantInfo.sizeIndex === item2.variantInfo.sizeIndex
    );
  }

  // If neither has variants, they're the same
  if (!item1.variantInfo?.hasVariants && !item2.variantInfo?.hasVariants) {
    return true;
  }

  // One has variant, other doesn't - different items
  return false;
};

// Flash Sale check helper
const isFlashSaleActive = (flashSale) => {
  if (!flashSale || !flashSale.isActive) return false;
  const now = new Date();
  const startTime = new Date(flashSale.startTime);
  const endTime = new Date(flashSale.endTime);
  return now >= startTime && now <= endTime;
};

// ✅ FIXED: Remove calculatedCharges from shipping details
const normalizeItemPrices = (item) => {
  if (!item) return null;

  const price = Number(item.price) || 0;
  const basePrice = Number(item.basePrice) || price || 0;

  const flashSaleIsActive =
    isFlashSaleActive(item.flashSale) ||
    item._flashSaleActive ||
    item.flashSaleActive ||
    false;

  let finalPrice = basePrice;
  let appliedDiscountPercent = 0;
  let savings = 0;

  if (flashSaleIsActive && item.flashSale?.discountPercentage) {
    // ✅ Flash Sale থাকলে শুধু Flash Sale apply হবে, regular discount না
    appliedDiscountPercent = Number(item.flashSale.discountPercentage) || 0;
    finalPrice = basePrice - (basePrice * appliedDiscountPercent) / 100;
    savings = (basePrice * appliedDiscountPercent) / 100;
  } else if (item.discountPercentage) {
    // ✅ Flash Sale না থাকলে regular discount
    appliedDiscountPercent = Number(item.discountPercentage) || 0;
    finalPrice = basePrice - (basePrice * appliedDiscountPercent) / 100;
    savings = (basePrice * appliedDiscountPercent) / 100;
  } else {
    finalPrice = price || basePrice;
  }

  // ✅ FIXED: Remove calculatedCharges from shippingDetails
  const { calculatedCharges, ...restShippingDetails } =
    item.shippingDetails || {};

  const shippingDetails = {
    shippingType: restShippingDetails.shippingType || "weight-based",
    insideDhakaCharge: Number(restShippingDetails.insideDhakaCharge) || 80,
    outsideDhakaCharge: Number(restShippingDetails.outsideDhakaCharge) || 150,
    fixedShippingCharge: Number(restShippingDetails.fixedShippingCharge) || 0,
    isFreeShippingActive: restShippingDetails.isFreeShippingActive || false,
    freeShippingThreshold:
      Number(restShippingDetails.freeShippingThreshold) || 0,
    // ❌ NO calculatedCharges here - calculated dynamically in components
  };

  const weight = Number(item.weight) || 0.5;

  return {
    ...item,
    price: price,
    basePrice: basePrice,
    _finalPrice: finalPrice,
    finalPrice: finalPrice,
    _effectivePrice: finalPrice,
    effectivePrice: finalPrice,
    _flashSaleActive: flashSaleIsActive,
    flashSaleActive: flashSaleIsActive,
    _savings: savings,
    savings: savings,
    // ✅ Only one discount percentage should be active
    discountPercentage: flashSaleIsActive ? 0 : appliedDiscountPercent,
    appliedDiscountPercent: appliedDiscountPercent,
    shippingDetails: shippingDetails, // ✅ Clean shipping details
    weight: weight,
  };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      if (!item || !item._id) {
        console.error("Invalid item:", item);
        return state;
      }

      // Normalize item prices and shipping details (removes calculatedCharges)
      const normalizedItem = normalizeItemPrices(item);

      // Find existing item with same ID and variant
      const existItemIndex = state.cartItems.findIndex((x) =>
        isSameItem(x, normalizedItem),
      );

      if (existItemIndex !== -1) {
        // Update existing item quantity
        state.cartItems[existItemIndex].qty = normalizedItem.qty;
        // Update all normalized fields
        state.cartItems[existItemIndex] = {
          ...state.cartItems[existItemIndex],
          _finalPrice: normalizedItem._finalPrice,
          finalPrice: normalizedItem.finalPrice,
          _effectivePrice: normalizedItem._effectivePrice,
          effectivePrice: normalizedItem.effectivePrice,
          _flashSaleActive: normalizedItem._flashSaleActive,
          flashSaleActive: normalizedItem.flashSaleActive,
          basePrice: normalizedItem.basePrice,
          _savings: normalizedItem._savings,
          savings: normalizedItem.savings,
          flashSale: normalizedItem.flashSale,
          discountPercentage: normalizedItem.discountPercentage,
          // ✅ Update clean shipping details
          shippingDetails: normalizedItem.shippingDetails,
          weight: normalizedItem.weight,
        };
      } else {
        // Add new item with all normalized data
        state.cartItems.push(normalizedItem);
      }

      return updateCart(state, state.shippingAddress);
    },

    removeFromCart: (state, action) => {
      const { _id, variantInfo } = action.payload;

      if (!_id) {
        console.error("Invalid item ID provided for removal", action.payload);
        return state;
      }

      console.log("Removing item:", _id, "Variant:", variantInfo);

      state.cartItems = state.cartItems.filter((item) => {
        if (item._id !== _id) return true;

        if (variantInfo?.hasVariants) {
          const itemHasVariants = item.variantInfo?.hasVariants;
          if (!itemHasVariants) return true;

          const colorMatch =
            item.variantInfo?.colorIndex === variantInfo.colorIndex;
          const sizeMatch =
            item.variantInfo?.sizeIndex === variantInfo.sizeIndex;

          return !(colorMatch && sizeMatch);
        }

        return false;
      });

      console.log("Cart after removal:", state.cartItems);

      return updateCart(state, state.shippingAddress);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state, action.payload);
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      state.totalSavings = 0;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    resetCart: (state) => {
      localStorage.removeItem("cart");
      return {
        cartItems: [],
        shippingAddress: {},
        paymentMethod: "Cash on Delivery",
      };
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
