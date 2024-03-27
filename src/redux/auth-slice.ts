import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TOKEN_AUTH_LOCALSTORAGE } from '@constants/index';
import { getLocalStorageItem } from '@utils/index';

type TUserState = {
    isAuth: boolean;
    token: string;
    email: string;
    password: string;
    code: string;
};

const readTokenWhileInit = () => {
    const accessToken = new URLSearchParams(window.location.search).get('accessToken');

    if (accessToken) {
        return accessToken;
    }

    return getLocalStorageItem(TOKEN_AUTH_LOCALSTORAGE);
};

const appStateInit: TUserState = {
    isAuth: false,
    token: readTokenWhileInit(),
    email: '',
    password: '',
    code: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState: appStateInit,
    reducers: {
        changeIsAuth: (state, { payload }: PayloadAction<boolean>) => {
            state.isAuth = payload;
        },
        setToken: (state, { payload }: PayloadAction<string>) => {
            state.token = payload;
        },
        setEmail: (state, { payload }: PayloadAction<string>) => {
            state.email = payload;
        },
        setPassword: (state, { payload }: PayloadAction<string>) => {
            state.password = payload;
        },
        setCode: (state, { payload }: PayloadAction<string>) => {
            state.code = payload;
        },
    },
});

const { actions, reducer } = authSlice;

export const { changeIsAuth, setToken, setPassword, setEmail, setCode } = actions;

export { reducer as authReducer };
