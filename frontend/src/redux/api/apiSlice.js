import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants.js";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // ⭐ Cookies পাঠানোর জন্য
  prepareHeaders: (headers, { getState }) => {
    // ⭐ LocalStorage থেকেও token নিন (backup হিসেবে)
      const token = getState().auth?.token || localStorage.getItem("token");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    // ⭐ CORS এর জন্য headers
    headers.set("Accept", "application/json");

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [
    "Product",
    "Products",
    "Order",
    "User",
    "Category",
    "Notification",
    "NewArrivals",
    "BestSellers",
    "FlashSale",
  ],
  endpoints: () => ({}),
});
