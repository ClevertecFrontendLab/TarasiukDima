import { ResultStatusType } from 'antd/lib/result';

export interface IUserRegistration {
    email: string;
    password: string;
}

export interface ILoginResponse {
    accessToken: string;
}

export interface IServerErrorData {
    statusCode: ResultStatusType | 409;
    error: string;
    message: string;
}

export interface IServerErrorResponse {
    status: string | number;
    data: IServerErrorData;
}

export interface IRequestAnswer {
    from: string;
    data: IServerErrorData | null;
    email?: string;
}

export type TServerResponse = IServerErrorResponse | object;
