import { API_TAGS, SERVICE_API_URL } from '@constants/index';
import { RootState } from '@redux/index';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TFeedback, TFeedbackCreateBody } from 'src/app-types/index';

export const feedbackApi = createApi({
    reducerPath: 'feedbackApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVICE_API_URL}/feedback`,
        prepareHeaders: (headers, { getState }) => {
            const { token } = (getState() as RootState).auth;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: [API_TAGS.feedbacks],
    endpoints: (builder) => ({
        getFeedback: builder.query<TFeedback[], null>({
            query: () => ({
                url: '',
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: API_TAGS.feedbacks, id })),
                          { type: API_TAGS.feedbacks, id: 'LIST' },
                      ]
                    : [{ type: API_TAGS.feedbacks, id: 'LIST' }],
        }),
        addFeedback: builder.mutation<TFeedback[], TFeedbackCreateBody>({
            query: (body) => ({
                url: '',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: API_TAGS.feedbacks, id: 'LIST' }],
        }),
    }),
});

export const { useGetFeedbackQuery, useAddFeedbackMutation } = feedbackApi;
