export { changeIsAuth, setToken, setPassword, setEmail, setCode, userReducer } from './user-slice';

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
