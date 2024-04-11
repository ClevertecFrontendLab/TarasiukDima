import {
    TTrainingBodyAddInvite,
    TTrainingInviteItem,
    TTrainingInviteItemAddResponse,
    TTrainingInviteItemAnswerBody,
} from '@app-types/index';
import { API_TAGS, SERVICE_API_URL } from '@constants/index';
import { RootState } from '@redux/index';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const invitesQueryEndpoints = {
    getInvites: '',
    addInvite: '',
    updateInvite: '',
    deleteInvite: '',
};

export const invitesApi = createApi({
    reducerPath: 'invitesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVICE_API_URL}/invite`,
        prepareHeaders: (headers, { getState }) => {
            const { token } = (getState() as RootState).auth;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: [API_TAGS.invite],
    endpoints: (builder) => ({
        getInvitesList: builder.query<TTrainingInviteItem[], null>({
            query: () => ({
                url: invitesQueryEndpoints.getInvites,
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ _id }) => ({ type: API_TAGS.invite, id: _id })),
                          { type: API_TAGS.invite, id: 'LIST' },
                      ]
                    : [{ type: API_TAGS.invite, id: 'LIST' }],
        }),

        addInvite: builder.mutation<TTrainingInviteItemAddResponse, TTrainingBodyAddInvite>({
            query: (body) => ({
                url: invitesQueryEndpoints.addInvite,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: API_TAGS.invite, id: 'LIST' }],
        }),

        updateInvite: builder.mutation<
            TTrainingInviteItemAddResponse,
            TTrainingInviteItemAnswerBody
        >({
            query: (body) => ({
                url: invitesQueryEndpoints.updateInvite,
                method: 'PUT',
                body,
            }),
            invalidatesTags: [{ type: API_TAGS.invite, id: 'LIST' }],
        }),

        removeInvite: builder.mutation<object, string>({
            query: (removeId) => ({
                url: `${invitesQueryEndpoints.addInvite}/${removeId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: API_TAGS.invite, id: 'LIST' }],
        }),
    }),
});

export const {
    useAddInviteMutation,
    useGetInvitesListQuery,
    useUpdateInviteMutation,
    useRemoveInviteMutation,
} = invitesApi;
