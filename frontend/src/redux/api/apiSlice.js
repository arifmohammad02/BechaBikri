import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants.js";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const userInfo = localStorage.getItem("userInfo");
    let token = null;

    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        token = parsed.token; 
      } catch (e) {
        console.error("Failed to parse userInfo:", e);
      }
    }

    if (!token) {
      token = getState()?.auth?.userInfo?.token;
    }

    console.log("🔑 Token found:", token ? "Yes" : "No");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
      console.log("✅ Authorization header set");
    } else {
      console.log("❌ No token found in userInfo");
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log("🚫 401 Unauthorized - Logging out");
    localStorage.clear();
    window.location.href = "/login";
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
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
