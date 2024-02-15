import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IAppState {
    isAuth: boolean;
}

const appStateInit: IAppState = {
    isAuth: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState: appStateInit,
    reducers: {
        changeShowSidebar: (state, { payload }: PayloadAction<boolean>) => {
            state.isAuth = payload;
        },
    },
});

const { actions, reducer } = userSlice;

export type TChangeShowSidebar = typeof actions.changeShowSidebar.type;
export const { changeShowSidebar } = actions;
export { reducer as userReducer };
