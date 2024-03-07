import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TTraining } from '@app_types/index';

type TAppState = {
    isShowSidebar: boolean;
    isShowLoader: boolean;
    isShowTokenError: boolean;
    isShowTrainingListError: boolean;
    personalTraining: TTraining[];
};

const appStateInit: TAppState = {
    isShowSidebar: true,
    isShowLoader: false,
    isShowTokenError: false,
    isShowTrainingListError: false,
    personalTraining: [],
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
        changeShowTrainingListError: (state, { payload }: PayloadAction<boolean>) => {
            state.isShowTrainingListError = payload;
        },
        changePersonalTrainingList: (state, { payload }: PayloadAction<TTraining[]>) => {
            state.personalTraining = payload;
        },
        changeShowLoader: (state, { payload }: PayloadAction<boolean>) => {
            state.isShowLoader = payload;
        },
    },
});

const { actions, reducer } = appSlice;

export const {
    changeShowSidebar,
    changeShowTokenError,
    changeShowTrainingListError,
    changePersonalTrainingList,
    changeShowLoader,
} = actions;

export { reducer as appReducer };
