import { PAYMENT_URL } from "../constant";
import { apiSlice } from "./apiSlice";

const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCoursePurchase: builder.mutation({
      query: (data) => ({
        url: `${PAYMENT_URL}/create-order`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const { useCreateCoursePurchaseMutation } = paymentApi;
