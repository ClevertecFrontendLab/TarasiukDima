import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory } from 'history';

import { appReducer } from './app-slice';
import { authReducer } from './auth-slice';
import { userReducer } from './user-slice';
import { userApi, feedbackApi, trainingApi, catalogsApi, authApi, filesApi } from '@services/index';

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
    history: createBrowserHistory(),
    savePreviousLocations: 2,
});

export const store = configureStore({
    reducer: combineReducers({
        app: appReducer,
        auth: authReducer,
        user: userReducer,
        router: routerReducer,
        [userApi.reducerPath]: userApi.reducer,
        [feedbackApi.reducerPath]: feedbackApi.reducer,
        [trainingApi.reducerPath]: trainingApi.reducer,
        [catalogsApi.reducerPath]: catalogsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [filesApi.reducerPath]: filesApi.reducer,
    }),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            routerMiddleware,
            userApi.middleware,
            feedbackApi.middleware,
            trainingApi.middleware,
            catalogsApi.middleware,
            authApi.middleware,
            filesApi.middleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const history = createReduxHistory(store);
