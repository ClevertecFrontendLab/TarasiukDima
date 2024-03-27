import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TUserInfo } from '@app_types/user';

type TUserState = {
    userData: TUserInfo | null;
};
const appStateInit: TUserState = {
    userData: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState: appStateInit,
    reducers: {
        changeUserData: (state, { payload }: PayloadAction<TUserInfo | null>) => {
            state.userData = payload;
        },
    },
});

const { actions, reducer } = userSlice;

export const { changeUserData } = actions;

export { reducer as userReducer };
