import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVICE_API_URL } from '@constants/index';
import { RootState } from '@redux/configure-store';
import { getCookie } from '@utils/index';

export const feedbackApi = createApi({
    reducerPath: 'feedbackApi',
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
    tagTypes: ['Feedback'],
    endpoints: (builder) => ({}),
});

