import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_TAGS, SERVICE_API_URL } from '@constants/index';
import { RootState } from '@redux/index';
import { TTariffItem, TTrainingVariants } from '@app_types/index';

const catalogQueryEndpoints = {
    trainingList: 'training-list',
    tariffsList: 'tariff-list',
};

export const catalogsApi = createApi({
    reducerPath: 'catalogsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVICE_API_URL}/catalogs`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: [API_TAGS.catalogs, API_TAGS.tariffs],
    endpoints: (builder) => ({
        getTrainingsList: builder.query<TTrainingVariants, null>({
            query: () => ({
                url: catalogQueryEndpoints.trainingList,
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ key }) => ({ type: API_TAGS.catalogs, id: key })),
                          { type: API_TAGS.catalogs, id: 'LIST' },
                      ]
                    : [{ type: API_TAGS.catalogs, id: 'LIST' }],
        }),
        getTariffsList: builder.query<TTariffItem[], null>({
            query: () => ({
                url: catalogQueryEndpoints.tariffsList,
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ _id }) => ({ type: API_TAGS.tariffs, id: _id })),
                          { type: API_TAGS.tariffs, id: 'LIST' },
                      ]
                    : [{ type: API_TAGS.tariffs, id: 'LIST' }],
        }),
    }),
});

export const { useLazyGetTrainingsListQuery, useGetTariffsListQuery } = catalogsApi;
