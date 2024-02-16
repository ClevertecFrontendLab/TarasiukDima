import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { serviceURL } from '@constants/index';
import { RootState } from '@redux/configure-store';
import { IRequestAnswer, IServerErrorResponse, IUserRegistration } from './types';

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
        baseUrl: `${serviceURL}/auth/`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).user.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        login: builder.mutation<{ accessToken: string }, IUserRegistration>({
            query: (body: IUserRegistration) => ({
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
        registration: builder.mutation<IRequestAnswer, IUserRegistration>({
            query: (body: IUserRegistration) => ({
                url: queryEndpoints.registration,
                method: 'POST',
                body,
            }),
            transformResponse: () => {
                console.log('Good response');

                return {
                    from: 'registration',
                    data: {
                        statusCode: 'success',
                        error: '',
                        message: '',
                    },
                };
            },
            transformErrorResponse: (response, _, arg) => {
                console.log('Bad response');

                return {
                    from: 'registration',
                    data: (response as IServerErrorResponse).data || null,
                    email: arg.email,
                };
            },
        }),
    }),
});

export const { useLoginMutation, useRegistrationMutation, useLazyLoginGoogleQuery } = userApi;
