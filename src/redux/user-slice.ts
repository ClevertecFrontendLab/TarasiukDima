import { TTrainingInviteItem, TUserInfo } from '@app-types/index';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TUserState = {
    userData: TUserInfo | null;
    invites: TTrainingInviteItem[];
};
const appStateInit: TUserState = {
    userData: null,
    invites: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState: appStateInit,
    reducers: {
        changeUserData: (state, { payload }: PayloadAction<TUserInfo | null>) => {
            state.userData = payload;
        },
        changeInvites: (state, { payload }: PayloadAction<TTrainingInviteItem[]>) => {
            state.invites = payload;
        },
    },
});

const { actions, reducer } = userSlice;

export const { changeUserData, changeInvites } = actions;

export { reducer as userReducer };
