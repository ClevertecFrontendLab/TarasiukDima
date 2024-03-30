import { API_TAGS, SERVICE_API_URL } from '@constants/index';
import { RootState } from '@redux/index';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TTariffBuyBody } from 'src/app-types/index';

const tariffsQueryEndpoints = {
    buy: '',
    checkout: '/checkout',
};

export const tariffsApi = createApi({
    reducerPath: 'tariffsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVICE_API_URL}/tariff`,
        prepareHeaders: (headers, { getState }) => {
            const { token } = (getState() as RootState).auth;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: [API_TAGS.userTariff],

    endpoints: (builder) => ({
        buyTariff: builder.mutation<object, TTariffBuyBody>({
            query: (body) => ({
                url: tariffsQueryEndpoints.buy,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: API_TAGS.userTariff, id: 'LIST' }],
        }),
    }),
});

export const { useBuyTariffMutation } = tariffsApi;
