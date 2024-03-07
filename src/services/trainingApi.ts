import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_TAGS, SERVICE_API_URL } from '@constants/index';
import { RootState } from '@redux/index';
import { TTraining, TTrainingCreateBody } from '@app_types/index';

export const trainingApi = createApi({
    reducerPath: 'trainingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVICE_API_URL}/training`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).user.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: [API_TAGS.training],
    endpoints: (builder) => ({
        getTraining: builder.query<TTraining[], null>({
            query: () => ({
                url: '',
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: API_TAGS.training, id })),
                          { type: API_TAGS.training, id: 'LIST' },
                      ]
                    : [{ type: API_TAGS.training, id: 'LIST' }],
        }),
        addTraining: builder.mutation<TTraining[], TTrainingCreateBody>({
            query: (body) => ({
                url: '',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: API_TAGS.training, id: 'LIST' }],
        }),
        updateTraining: builder.mutation<TTraining[], TTrainingCreateBody>({
            query: (body) => ({
                url: '',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: API_TAGS.training, id: 'LIST' }],
        }),
        deleteTraining: builder.mutation<TTraining[], TTrainingCreateBody>({
            query: (body) => ({
                url: '',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: API_TAGS.training, id: 'LIST' }],
        }),
    }),
});

export const {
    useAddTrainingMutation,
    useDeleteTrainingMutation,
    useGetTrainingQuery,
    useUpdateTrainingMutation,
} = trainingApi;
