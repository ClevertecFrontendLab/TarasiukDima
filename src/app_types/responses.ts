import { ResultStatusType } from 'antd/lib/result';

export type TServerErrorData = {
    statusCode: ResultStatusType | 409;
    error: string;
    message: string;
};

export type TServerErrorResponse = {
    status: string | number;
    data: TServerErrorData;
};

export type TRequestAnswer = {
    data: TServerErrorData | null;
    email?: string;
    password?: string;
};

export type TServerResponse = TServerErrorResponse | object;
