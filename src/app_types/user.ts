export type TUserRegistration = {
    email: string;
    password: string;
};

export type TLoginResponse = {
    accessToken: string;
};

type TUserCommonInfo = {
    email: string;
    readyForJointTraining: boolean;
    sendNotification: boolean;
    firstName?: string;
    lastName?: string;
    birthday?: string;
    imgSrc?: string;
};

export type TUserInfoUpdateBody = Partial<TUserCommonInfo> & {
    password?: string;
};

export type TUserInfo = TUserCommonInfo & {
    tariff?: {
        tariffId: string;
        expired: string;
    };
};
