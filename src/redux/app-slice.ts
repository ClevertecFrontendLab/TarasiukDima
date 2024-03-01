import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type TAppState = {
    isShowSidebar: boolean;
    isShowTokenError: boolean;
};

const appStateInit: TAppState = {
    isShowSidebar: true,
    isShowTokenError: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState: appStateInit,
    reducers: {
        changeShowSidebar: (state) => {
            state.isShowSidebar = !state.isShowSidebar;
        },
        changeShowTokenError: (state, { payload }: PayloadAction<boolean>) => {
            state.isShowTokenError = payload;
        },
    },
});

const { actions, reducer } = appSlice;

export const { changeShowSidebar, changeShowTokenError } = actions;

export { reducer as appReducer };
