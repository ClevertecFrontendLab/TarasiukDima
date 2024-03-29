import { API_TAGS, SERVICE_API_URL } from '@constants/index';
import { RootState } from '@redux/index';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TUserInfo, TUserInfoUpdateBody } from 'src/app-types/index';

const userQueryEndpoints = {
    selfInfo: '/me',
    update: '',
};

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVICE_API_URL}/user`,
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            const { token } = (getState() as RootState).auth;

            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: [API_TAGS.user],
    endpoints: (builder) => ({
        getUserInfo: builder.query<TUserInfo, null>({
            query: () => ({
                url: userQueryEndpoints.selfInfo,
            }),
            providesTags: [API_TAGS.user],
        }),

        updateUserInfo: builder.mutation<TUserInfo, TUserInfoUpdateBody>({
            query: (body) => ({
                url: userQueryEndpoints.update,
                method: 'PUT',
                body,
            }),
            invalidatesTags: [API_TAGS.user],
        }),
    }),
});

export const { useGetUserInfoQuery, useLazyGetUserInfoQuery, useUpdateUserInfoMutation } = userApi;
