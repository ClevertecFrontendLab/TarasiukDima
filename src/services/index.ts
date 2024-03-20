export {
    userApi,
    useLoginMutation,
    useRegistrationMutation,
    useChangePasswordMutation,
    useCheckEmailMutation,
    useConfirmEmailMutation,
} from './userApi';

export { useGetFeedbackQuery, useAddFeedbackMutation, feedbackApi } from './feedbackApi';

export {
    trainingApi,
    useAddTrainingMutation,
    useDeleteTrainingMutation,
    useLazyGetTrainingQuery,
    useUpdateTrainingMutation,
} from './trainingApi';

export { useLazyGetTrainingsListQuery, catalogsApi } from './catalogsApi';
