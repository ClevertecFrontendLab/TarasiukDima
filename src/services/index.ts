export {
    authApi,
    useLoginMutation,
    useRegistrationMutation,
    useChangePasswordMutation,
    useCheckEmailMutation,
    useConfirmEmailMutation,
} from './auth-api';

export { useGetFeedbackQuery, useAddFeedbackMutation, feedbackApi } from './feedback-api';

export {
    trainingApi,
    useAddTrainingMutation,
    useDeleteTrainingMutation,
    useLazyGetTrainingQuery,
    useUpdateTrainingMutation,
} from './training-api';

export { useLazyGetTrainingsListQuery, catalogsApi, useGetTariffsListQuery } from './catalogs-api';

export { useBuyTariffMutation, tariffsApi } from './tariffs-api';

export {
    useGetUserInfoQuery,
    useLazyGetUserInfoQuery,
    userApi,
    useUpdateUserInfoMutation,
} from './user-api';

export { useUploadFileMutation, filesQueryEndpoints, filesApi } from './files-api';
