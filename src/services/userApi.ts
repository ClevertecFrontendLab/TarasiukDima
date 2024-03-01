import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVICE_API_URL } from '@constants/index';
import { RootState } from '@redux/configure-store';
import { TRequestAnswer, TUserRegistration } from './types';
import { getCookie } from '@utils/index';

const queryEndpoints = {
    google: 'google',
    login: 'login',
    registration: 'registration',
    checkEmail: 'check-email',
    confirmEmail: 'confirm-email',
    changePassword: 'change-password',
};

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVICE_API_URL}/auth/`,
        credentials: 'include',
        prepareHeaders: (headers, { getState, endpoint }) => {
            const token = (getState() as RootState).user.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            if (endpoint === 'changePassword') {
                const cookie = getCookie('email_token');
                headers.set('set-cookie', cookie);
            }

            return headers;
        },
    }),
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        login: builder.mutation<{ accessToken: string }, TUserRegistration>({
            query: (body: TUserRegistration) => ({
                url: queryEndpoints.login,
                method: 'POST',
                body,
            }),
        }),
        loginGoogle: builder.query<{ accessToken: string }, null>({
            query: () => ({
                url: queryEndpoints.google,
            }),
        }),
        registration: builder.mutation<TRequestAnswer, TUserRegistration>({
            query: (body: TUserRegistration) => ({
                url: queryEndpoints.registration,
                method: 'POST',
                body,
            }),
            transformResponse: () => {
                return {
                    status: 'success',
                    data: {
                        statusCode: 'success',
                        error: '',
                        message: '',
                    },
                };
            },
        }),
        checkEmail: builder.mutation<{ email: string; message: string }, { email: string }>({
            query: (body) => ({
                url: queryEndpoints.checkEmail,
                method: 'POST',
                body,
            }),
        }),
        confirmEmail: builder.mutation<{ email: string }, { email: string; code: string }>({
            query: (body) => ({
                url: queryEndpoints.confirmEmail,
                method: 'POST',
                body,
                credentials: 'include',
            }),
        }),
        changePassword: builder.mutation<{ message: string }, { password: string }>({
            query: (body) => ({
                url: queryEndpoints.changePassword,
                method: 'POST',
                body: { password: body.password, confirmPassword: body.password },
                credentials: 'include',
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegistrationMutation,
    useLazyLoginGoogleQuery,
    useChangePasswordMutation,
    useCheckEmailMutation,
    useConfirmEmailMutation,
} = userApi;
