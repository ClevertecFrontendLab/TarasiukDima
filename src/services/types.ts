import { ResultStatusType } from 'antd/lib/result';

// USER
export interface IUserRegistration {
    email: string;
    password: string;
}

export interface ILoginResponse {
    accessToken: string;
}

export interface IServerErrorResponse {
    error: {
        data: IServerErrorData;
    };
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
    data: IServerErrorData | null;
    email?: string;
    password?: string;
}

export type TServerResponse = IServerErrorResponse | object;

// FEEDBACK
export interface IFeedback {
    fullName: string | null;
    imageSrc: string | null;
    message: string | null;
    rating: number;
    createdAt: Date;
}

export interface IFeedbackCreateBody {
    message: string;
    rating: number;
}
