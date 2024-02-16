import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TOKEN_AUTH_LOCALSTORAGE } from '@constants/index';
import { getLocalStorageItem } from '@utils/index';

interface IAppState {
    isAuth: boolean;
    token: string;
}

const appStateInit: IAppState = {
    isAuth: false,
    token: getLocalStorageItem(TOKEN_AUTH_LOCALSTORAGE),
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
    },
});

const { actions, reducer } = userSlice;

export const { changeShowSidebar, setToken } = actions;
export { reducer as userReducer };
