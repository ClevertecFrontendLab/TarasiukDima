export const SERVICE_API_URL = 'https://marathon-api.clevertec.ru';

export const REPEAT_FEEDBACKS_REQUEST = 30000;

export const API_TAGS = {
    feedbacks: 'Feedbacks',
    training: 'Training',
    catalogs: 'Catalogs',
    tariffs: 'Tariffs',
    userTariff: 'UserTariff',
    user: 'User',
    auth: 'Auth',
    files: 'Files',
};

export const STATUS_CODES = {
    requestError: '400',
    notAuth: '403',
    notFound: '404',
    badRequest: '409',
    maxRequests: '429',
    serverError: '500',
};
