import { apiSlice } from "./apiSlice";
import { PAYMENTS_URL } from "../constants";

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query({
      query: () => `${PAYMENTS_URL}/methods`,
      keepUnusedDataFor: 5,
    }),

    getPaymentStats: builder.query({
      query: () => `${PAYMENTS_URL}/stats`,
      keepUnusedDataFor: 5,
    }),

    checkTransactionId: builder.query({
      query: (transactionId) =>
        `${PAYMENTS_URL}/check-transaction/${transactionId}`,
      skip: (transactionId) => !transactionId || transactionId.length < 8,
 
      keepUnusedDataFor: 1,
    }),

    updatePaymentMethod: builder.mutation({
      query: (data) => ({
        url: `${PAYMENTS_URL}/methods`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PaymentMethods"],
    }),

    deletePaymentMethod: builder.mutation({
      query: (type) => ({
        url: `${PAYMENTS_URL}/methods/${type}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentMethods"],
    }),

    submitManualPayment: builder.mutation({
      query: ({ orderId, data }) => ({
        url: `${PAYMENTS_URL}/submit/${orderId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
      ],
    }),

    verifyManualPayment: builder.mutation({
      query: ({ orderId, status, notes }) => ({
        url: `${PAYMENTS_URL}/verify/${orderId}`,
        method: "PUT",
        body: { status, notes },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        "Order",
      ],
    }),
  }),
});

export const {
  useGetPaymentMethodsQuery,
  useGetPaymentStatsQuery,
  useCheckTransactionIdQuery,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSubmitManualPaymentMutation,
  useVerifyManualPaymentMutation,
} = paymentApiSlice;
