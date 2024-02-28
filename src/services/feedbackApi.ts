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
    tagTypes: ['Feedback'],
    endpoints: (builder) => ({
        getFeedback: builder.query<{ accessToken: string }, null>({
            query: () => ({
                url: '',
            }),
        }),
        addFeedback: builder.mutation<Array<IFeedback>, IFeedbackCreateBody>({
            query: (body) => ({
                url: '',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useGetFeedbackQuery, useAddFeedbackMutation } = feedbackApi;
