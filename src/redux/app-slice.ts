import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IAppState {
    isShowSidebar: boolean;
    isShowTokenError: boolean;
}

const appStateInit: IAppState = {
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
