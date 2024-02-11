import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IAppState {
    isShowSidebar: boolean;
}

const appStateInit: IAppState = {
    isShowSidebar: true,
};

const appSlice = createSlice({
    name: 'test',
    initialState: appStateInit,
    reducers: {
        changeShowSidebar: (state) => {
            state.isShowSidebar = !state.isShowSidebar;
        },
    },
});

const { actions, reducer } = appSlice;

export type TChangeShowSidebar = typeof actions.changeShowSidebar.type;
export const { changeShowSidebar } = actions;
export { reducer as appReducer };
