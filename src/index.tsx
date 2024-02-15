import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { ConfigProvider } from 'antd';

import { history, store } from '@redux/configure-store';
import {
    MainPage,
    AuthPage,
    ChangePasswordPage,
    RegistrationPage,
    ConfirmEmailPage,
    ResultPage,
} from './pages';
import { ROUTES_LINKS } from './constants';

import 'antd/dist/antd.min.css';
import 'normalize.css';
import './index.scss';

ConfigProvider.config({
    theme: {
        primaryColor: '#262626',
    },
});

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);
{
    /* <Router history={history}> */
}

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ConfigProvider>
                <Router history={history}>
                    <Routes>
                        <Route path={ROUTES_LINKS.home} element={<MainPage />} />

                        <Route path={ROUTES_LINKS.auth} element={<AuthPage />} />
                        <Route path={ROUTES_LINKS.registration} element={<RegistrationPage />} />
                        <Route
                            path={ROUTES_LINKS.changePassword}
                            element={<ChangePasswordPage />}
                        />
                        <Route path={ROUTES_LINKS.confirmEmail} element={<ConfirmEmailPage />} />
                        <Route path={ROUTES_LINKS.resultError} element={<ResultPage />} />
                    </Routes>
                </Router>
            </ConfigProvider>
        </Provider>
    </React.StrictMode>,
);
