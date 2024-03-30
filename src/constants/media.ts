import { UploadFileStatus } from 'antd/lib/upload/interface';

export const MEDIA_SERVER_URL = 'https://training-api.clevertec.ru';
export const MAX_WIDTH_FOR_MOBILE_PX = 575;

export const MEDIA_LOADING_STATUS: { [key: string]: UploadFileStatus } = {
    loading: 'uploading',
    done: 'done',
    error: 'error',
};
