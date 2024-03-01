import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { history, store } from '@redux/index';
import { ConfigProvider } from 'antd';

import {
    MainPage,
    AuthPage,
    ChangePasswordPage,
    RegistrationPage,
    ConfirmEmailPage,
    ResultPage,
    FeedbacksPage,
} from './pages';
import { NotAuth, RequiredAuth } from '@components/index';
import { ROUTES_LINKS } from '@constants/index';

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

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ConfigProvider>
                <Router history={history}>
                    <Routes>
                        <Route
                            path={'/'}
                            element={<Navigate to={ROUTES_LINKS.home} replace={true} />}
                        />

                        <Route
                            path={ROUTES_LINKS.home}
                            element={
                                <RequiredAuth redirect={ROUTES_LINKS.auth}>
                                    <MainPage />
                                </RequiredAuth>
                            }
                        />

                        <Route
                            path={ROUTES_LINKS.feedbacks}
                            element={
                                <RequiredAuth redirect={ROUTES_LINKS.auth}>
                                    <FeedbacksPage />
                                </RequiredAuth>
                            }
                        />

                        <Route
                            path={ROUTES_LINKS.auth}
                            element={
                                <NotAuth>
                                    <AuthPage />
                                </NotAuth>
                            }
                        />
                        <Route
                            path={ROUTES_LINKS.registration}
                            element={
                                <NotAuth>
                                    <RegistrationPage />
                                </NotAuth>
                            }
                        />
                        <Route
                            path={ROUTES_LINKS.changePassword}
                            element={<ChangePasswordPage />}
                        />
                        <Route path={ROUTES_LINKS.confirmEmail} element={<ConfirmEmailPage />} />
                        <Route path={ROUTES_LINKS.resultAll} element={<ResultPage />} />

                        <Route
                            path='*'
                            element={
                                <RequiredAuth redirect={ROUTES_LINKS.auth}>
                                    <MainPage />
                                </RequiredAuth>
                            }
                        />
                    </Routes>
                </Router>
            </ConfigProvider>
        </Provider>
    </React.StrictMode>,
);
