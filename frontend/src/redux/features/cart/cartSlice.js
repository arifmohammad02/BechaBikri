// import { createSlice } from "@reduxjs/toolkit";
// import { updateCart } from "../../../Utils/cart";

// const initialState = localStorage.getItem("cart")
//   ? JSON.parse(localStorage.getItem("cart"))
//   : {
//       cartItems: [],
//       shippingAddress: {},
//       paymentMethod:
//         localStorage.getItem("defaultPaymentMethod") === "COD"
//           ? "Cash on Delivery"
//           : "PayPal",
//     };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const { user, rating, numReviews, reviews, ...item} = action.payload;
//       const existItem = state.cartItems.find((x) => x._id === item._id);

//       if (existItem) {
//         state.cartItems = state.cartItems.map((x) =>
//           x._id === existItem._id ? item : x
//         );
//       } else {
//         state.cartItems = [...state.cartItems, item];
//       }
//       return updateCart(state, item);
//     },

//     removeFromCart: (state, action) => {
//       state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
//       return updateCart(state);
//     },

//     saveShippingAddress: (state, action) => {
//       state.shippingAddress = action.payload;
//       localStorage.setItem("cart", JSON.stringify(state));
//     },

//     savePaymentMethod: (state, action) => {
//       state.paymentMethod = action.payload;
//       localStorage.setItem("cart", JSON.stringify(state));
//     },

//     clearCartItems: (state, action) => {
//       state.cartItems = [];
//       localStorage.setItem("cart", JSON.stringify(state));
//     },

//     resetCart: (state) => (state = initialState),
//   },
// });

// export const {
//   addToCart,
//   removeFromCart,
//   savePaymentMethod,
//   saveShippingAddress,
//   clearCartItems,
//   resetCart,
// } = cartSlice.actions;

// export default cartSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/cart";

// Load initial state from localStorage or fallback to default values
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : {
      cartItems: [],
      shippingAddress: {},
      paymentMethod:
        localStorage.getItem("defaultPaymentMethod") === "COD"
          ? "Cash on Delivery"
          : "PayPal",
    };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload; // Extract extra properties
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // If item exists, update its quantity or other properties
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? { ...existItem, qty: existItem.qty + item.qty } : x
        );
      } else {
        // Otherwise, add the item to the cart
        state.cartItems.push(item);
      }

      // Update the cart in localStorage and return updated state
      return updateCart(state, item);
    },

    removeFromCart: (state, action) => {
      // Remove the item from the cart
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

      // Update the cart in localStorage
      return updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;

      // Persist the updated shipping address
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;

      // Persist the updated payment method
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state) => {
      state.cartItems = [];

      // Clear cart in localStorage
      localStorage.setItem("cart", JSON.stringify(state));
    },

    resetCart: () => {
      // Reset cart to initial state
      return initialState;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
