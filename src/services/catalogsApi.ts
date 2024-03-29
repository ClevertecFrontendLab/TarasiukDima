import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_TAGS, SERVICE_API_URL } from '@constants/index';
import { RootState } from '@redux/index';
import { TTrainingVariants } from '@app_types/index';

const queryEndpoints = {
    trainingList: 'training-list',
};

export const catalogsApi = createApi({
    reducerPath: 'catalogsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVICE_API_URL}/catalogs`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).user.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: [API_TAGS.catalogs],
    endpoints: (builder) => ({
        getTrainingsList: builder.query<TTrainingVariants, null>({
            query: () => ({
                url: queryEndpoints.trainingList,
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ key }) => ({ type: API_TAGS.catalogs, id: key })),
                          { type: API_TAGS.catalogs, id: 'LIST' },
                      ]
                    : [{ type: API_TAGS.catalogs, id: 'LIST' }],
        }),
    }),
});

export const { useLazyGetTrainingsListQuery } = catalogsApi;
