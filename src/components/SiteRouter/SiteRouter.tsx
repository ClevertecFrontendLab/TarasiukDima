import { Navigate, Route, Routes } from 'react-router-dom';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { history } from '@redux/index';
import {
    MainPage,
    AuthPage,
    ChangePasswordPage,
    RegistrationPage,
    ConfirmEmailPage,
    ResultPage,
    FeedbacksPage,
    CalendarPage,
    ProfilePage,
    NotFoundPage,
} from '@pages/index';
import { NotAuth, RequiredAuth } from '@components/index';
import { ROUTES_LINKS } from '@constants/index';

export const SiteRouter = () => (
    <Router history={history}>
        <Routes>
            <Route path={'/'} element={<Navigate to={ROUTES_LINKS.home} replace={true} />} />

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
                path={ROUTES_LINKS.calendar}
                element={
                    <RequiredAuth redirect={ROUTES_LINKS.auth}>
                        <CalendarPage />
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
                path={ROUTES_LINKS.profile}
                element={
                    <RequiredAuth redirect={ROUTES_LINKS.home}>
                        <ProfilePage />
                    </RequiredAuth>
                }
            />

            <Route path={ROUTES_LINKS.changePassword} element={<ChangePasswordPage />} />

            <Route path={ROUTES_LINKS.confirmEmail} element={<ConfirmEmailPage />} />

            <Route path={ROUTES_LINKS.resultAll} element={<ResultPage />} />

            <Route
                path='*'
                element={
                    <RequiredAuth redirect={ROUTES_LINKS.auth}>
                        <NotFoundPage />
                    </RequiredAuth>
                }
            />
        </Routes>
    </Router>
);
