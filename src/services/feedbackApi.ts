import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVICE_API_URL } from '@constants/index';
import { RootState } from '@redux/configure-store';
import { IFeedback, IFeedbackCreateBody } from './types';

export const feedbackApi = createApi({
    reducerPath: 'feedbackApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVICE_API_URL}/feedback/`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).user.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ['Feedbacks'],
    endpoints: (builder) => ({
        getFeedback: builder.query<Array<IFeedback>, null>({
            query: () => ({
                url: '',
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: 'Feedbacks' as const, id })),
                          { type: 'Feedbacks', id: 'LIST' },
                      ]
                    : [{ type: 'Feedbacks', id: 'LIST' }],
        }),
        addFeedback: builder.mutation<Array<IFeedback>, IFeedbackCreateBody>({
            query: (body) => ({
                url: '',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Feedbacks', id: 'LIST' }],
        }),
    }),
});

export const { useGetFeedbackQuery, useAddFeedbackMutation } = feedbackApi;
