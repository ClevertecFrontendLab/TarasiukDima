import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@redux/index';
import { API_TAGS, SERVICE_API_URL } from '@constants/index';
import { TUserPhotoResponse } from '@app_types/index';

export const filesQueryEndpoints = {
    upload: 'upload-image',
};

export const filesApi = createApi({
    reducerPath: 'filesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVICE_API_URL}/`,
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'multipart/form-data');
            return headers;
        },
    }),
    tagTypes: [API_TAGS.files],
    endpoints: (builder) => ({
        uploadFile: builder.mutation<TUserPhotoResponse, FormData>({
            query: (body) => ({
                url: filesQueryEndpoints.upload,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useUploadFileMutation } = filesApi;
