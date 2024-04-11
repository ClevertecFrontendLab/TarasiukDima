export { changeUserData, changeInvites, userReducer } from './user-slice';

export { changeIsAuth, setToken, setPassword, setEmail, setCode, authReducer } from './auth-slice';

export {
    changeShowSidebar,
    changeShowTokenError,
    appReducer,
    changeShowTrainingListError,
    changePersonalTrainingList,
    changeShowLoader,
} from './app-slice';

export { store, history } from './configure-store';

export type { RootState, AppDispatch } from './configure-store';
