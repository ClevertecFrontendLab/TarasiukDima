import { TTariffItem, TTrainingInviteStatus, TTrainingPalItem, TTrainingUserItem, TTrainingVariants } from '@app-types/index';
import { API_TAGS, SERVICE_API_URL } from '@constants/index';
import { RootState } from '@redux/index';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const catalogQueryEndpoints = {
    trainingList: 'training-list',
    tariffsList: 'tariff-list',
    trainingPals: 'training-pals',
    joinUserList: 'user-joint-training-list',
    userList: 'user-list',
};

export const catalogsApi = createApi({
    reducerPath: 'catalogsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVICE_API_URL}/catalogs`,
        prepareHeaders: (headers, { getState }) => {
            const { token } = (getState() as RootState).auth;

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
                          { type: API_TAGS.training, id: 'LIST' },
                      ]
                    : [{ type: API_TAGS.training, id: 'LIST' }],
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
        getTrainingPals: builder.query<TTrainingPalItem[], null>({
            query: () => ({
                url: catalogQueryEndpoints.trainingPals,
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: API_TAGS.pals, id })),
                          { type: API_TAGS.pals, id: 'LIST' },
                      ]
                    : [{ type: API_TAGS.pals, id: 'LIST' }],
        }),
        getJoinUserList: builder.query<TTrainingPalItem[], {trainingType?: TTrainingVariants, trainingStatus: TTrainingInviteStatus}>({
            query: ({trainingType, trainingStatus}) => {
                let queryString = '';

                if (trainingType) {
                    queryString = `?trainingType=${trainingType}`;
                }

                if (trainingStatus) {
                    queryString += queryString.length ? '&' : '?';
                    queryString += `status=${trainingStatus}`;
                }

                return ({
                    url:catalogQueryEndpoints.joinUserList + queryString,
                })
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: API_TAGS.userTraining, id })),
                          { type: API_TAGS.userTraining, id: 'LIST' },
                      ]
                    : [{ type: API_TAGS.userTraining, id: 'LIST' }],
        }),
        getUserList: builder.query< TTrainingUserItem[], null>({
            query: () => ({
                url: catalogQueryEndpoints.userList,
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: API_TAGS.userTrainingList, id })),
                          { type: API_TAGS.userTrainingList, id: 'LIST' },
                      ]
                    : [{ type: API_TAGS.userTrainingList, id: 'LIST' }],
        }),
    }),
});

export const { useLazyGetTrainingsListQuery, useGetTariffsListQuery, useGetTrainingPalsQuery } =
    catalogsApi;
