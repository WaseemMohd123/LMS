import { CHAT_URL } from "../constant";
import { apiSlice } from "./apiSlice";

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    chatBotChat: builder.mutation({
      query: (data) => ({
        url: `${CHAT_URL}/chat`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const { useChatBotChatMutation } = paymentApi;
