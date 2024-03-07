import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory } from 'history';

import { appReducer } from './app-slice';
import { userReducer } from './user-slice';
import { userApi, feedbackApi, trainingApi, catalogsApi } from '@services/index';

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
    history: createBrowserHistory(),
    savePreviousLocations: 1,
});

export const store = configureStore({
    reducer: combineReducers({
        app: appReducer,
        user: userReducer,
        router: routerReducer,
        [userApi.reducerPath]: userApi.reducer,
        [feedbackApi.reducerPath]: feedbackApi.reducer,
        [trainingApi.reducerPath]: trainingApi.reducer,
        [catalogsApi.reducerPath]: catalogsApi.reducer,
    }),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            routerMiddleware,
            userApi.middleware,
            feedbackApi.middleware,
            trainingApi.middleware,
            catalogsApi.middleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const history = createReduxHistory(store);
