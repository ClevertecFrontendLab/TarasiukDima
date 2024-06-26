export const ROUTES_LINKS = {
    home: '/main',
    calendar: '/calendar',
    training: '/training',
    progress: '/progress',
    feedbacks: '/feedbacks',
    settings: '/settings',

    profile: '/profile',
    auth: '/auth',
    registration: '/auth/registration',
    changePassword: '/auth/change-password',
    confirmEmail: '/auth/confirm-email',

    resultAll: '/result/:variant',

    resultSuccess: '/result/success',
    resultError: '/result/error',

    resultErrorNoUser: '/result/error-check-email-no-exist',
    resultErrorEmail: '/result/error-check-email',

    resultErrorLogin: '/result/error-login',
    resultErrorUserExist: '/result/error-user-exist',

    resultErrorChangePassword: '/result/error-change-password',
    resultSuccessChangePassword: '/result/success-change-password',
};
