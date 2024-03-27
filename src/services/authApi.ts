import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@redux/index';
import { getCookie } from '@utils/index';
import { API_TAGS, SERVICE_API_URL } from '@constants/index';
import { TRequestAnswer, TUserRegistration } from '@app_types/index';

const authQueryEndpoints = {
    google: 'google',
    login: 'login',
    registration: 'registration',
    checkEmail: 'check-email',
    confirmEmail: 'confirm-email',
    changePassword: 'change-password',
};

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVICE_API_URL}/auth/`,
        credentials: 'include',
        prepareHeaders: (headers, { getState, endpoint }) => {
            const token = (getState() as RootState).auth.token;
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
    tagTypes: [API_TAGS.auth],
    endpoints: (builder) => ({
        login: builder.mutation<{ accessToken: string }, TUserRegistration>({
            query: (body: TUserRegistration) => ({
                url: authQueryEndpoints.login,
                method: 'POST',
                body,
            }),
        }),
        loginGoogle: builder.query<{ accessToken: string }, null>({
            query: () => ({
                url: authQueryEndpoints.google,
            }),
        }),
        registration: builder.mutation<TRequestAnswer, TUserRegistration>({
            query: (body: TUserRegistration) => ({
                url: authQueryEndpoints.registration,
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
                url: authQueryEndpoints.checkEmail,
                method: 'POST',
                body,
            }),
        }),
        confirmEmail: builder.mutation<{ email: string }, { email: string; code: string }>({
            query: (body) => ({
                url: authQueryEndpoints.confirmEmail,
                method: 'POST',
                body,
                credentials: 'include',
            }),
        }),
        changePassword: builder.mutation<{ message: string }, { password: string }>({
            query: (body) => ({
                url: authQueryEndpoints.changePassword,
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
} = authApi;
