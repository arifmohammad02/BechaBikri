/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/cart";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: "Cash on Delivery",
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

      console.log(
        "Adding item:",
        item._id,
        "Qty:",
        item.qty,
        "Variant:",
        item.variantInfo,
      );

      // Find existing item with same ID and variant
      const existItemIndex = state.cartItems.findIndex((x) =>
        isSameItem(x, item),
      );

      if (existItemIndex !== -1) {
        // Update existing item quantity
        state.cartItems[existItemIndex].qty = item.qty;
      } else {
        // Add new item
        state.cartItems.push(item);
      }

      return updateCart(state, state.shippingAddress);
    },

    removeFromCart: (state, action) => {
      const { _id, variantInfo } = action.payload;

      if (!_id) {
        console.error("Invalid item ID provided for removal", action.payload);
        return state;
      }

      console.log("Removing item:", _id, "Variant:", variantInfo); // Debug log

      // Remove item considering variant info
      state.cartItems = state.cartItems.filter((item) => {
        // If _id doesn't match, keep the item
        if (item._id !== _id) return true;

        // If variant info provided in payload, check for match
        if (variantInfo?.hasVariants) {
          const itemHasVariants = item.variantInfo?.hasVariants;

          // If item doesn't have variants but payload does, keep it (different items)
          if (!itemHasVariants) return true;

          // Check if variant indices match
          const colorMatch =
            item.variantInfo?.colorIndex === variantInfo.colorIndex;
          const sizeMatch =
            item.variantInfo?.sizeIndex === variantInfo.sizeIndex;

          // Remove only if both indices match
          return !(colorMatch && sizeMatch);
        }

        // No variant info in payload - remove all instances (backward compatibility)
        return false;
      });

      console.log("Cart after removal:", state.cartItems); // Debug log

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
