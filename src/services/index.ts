export {
    authApi,
    useLoginMutation,
    useRegistrationMutation,
    useChangePasswordMutation,
    useCheckEmailMutation,
    useConfirmEmailMutation,
} from './authApi';

export { useGetFeedbackQuery, useAddFeedbackMutation, feedbackApi } from './feedbackApi';

export {
    trainingApi,
    useAddTrainingMutation,
    useDeleteTrainingMutation,
    useLazyGetTrainingQuery,
    useUpdateTrainingMutation,
} from './trainingApi';

export { useLazyGetTrainingsListQuery, catalogsApi, useGetTariffsListQuery } from './catalogsApi';

export {
    useGetUserInfoQuery,
    useLazyGetUserInfoQuery,
    userApi,
    useUpdateUserInfoMutation,
} from './userApi';

export { useUploadFileMutation, filesQueryEndpoints, filesApi } from './filesApi';
