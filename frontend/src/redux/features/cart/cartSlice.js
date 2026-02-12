/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/cart";

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
          const { user, rating, numReviews, reviews, ...item } = action.payload;

          if (!item || Object.keys(item).length === 0 || !item._id) {
            console.error(
              "Item is undefined or invalid in payload",
              action.payload,
            );
            return state; // Prevent the crash by returning the existing state
          }

          const existItem = state.cartItems.find((x) => x._id === item._id);

          if (existItem) {
            state.cartItems = state.cartItems.map((x) =>
              x._id === existItem._id ? item : x,
            );
          } else {
            state.cartItems = [...state.cartItems, item];
          }

          return updateCart(state, state.shippingAddress);
        },

        removeFromCart: (state, action) => {
          if (!action.payload) {
            console.error(
              "Invalid item ID provided for removal",
              action.payload,
            );
            return state;
          }

          state.cartItems = state.cartItems.filter(
            (x) => x._id !== action.payload,
          );

          // আইটেম রিমুভ করার পর নতুন করে শিপিং চার্জ হিসেব হবে
          return updateCart(state, state.shippingAddress);
        },

        saveShippingAddress: (state, action) => {
          state.shippingAddress = action.payload;
          // localStorage.setItem("cart", JSON.stringify(state));
          return updateCart(state, action.payload);
        },

        savePaymentMethod: (state, action) => {
          state.paymentMethod = action.payload;
          localStorage.setItem("cart", JSON.stringify(state));
        },

        clearCartItems: (state, action) => {
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
            paymentMethod: "PayPal",
          };
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
