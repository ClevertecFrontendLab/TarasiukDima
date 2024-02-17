import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TOKEN_AUTH_LOCALSTORAGE } from '@constants/index';
import { getLocalStorageItem } from '@utils/index';

interface IAppState {
    isAuth: boolean;
    token: string;
    email: string;
    password: string;
    code: string;
}

const appStateInit: IAppState = {
    isAuth: false,
    token: getLocalStorageItem(TOKEN_AUTH_LOCALSTORAGE),
    email: '',
    password: '',
    code: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState: appStateInit,
    reducers: {
        changeShowSidebar: (state, { payload }: PayloadAction<boolean>) => {
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

const { actions, reducer } = userSlice;

export const { changeShowSidebar, setToken, setPassword, setEmail, setCode } = actions;
export { reducer as userReducer };
