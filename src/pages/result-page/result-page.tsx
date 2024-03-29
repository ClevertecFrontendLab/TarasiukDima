import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES_LINKS } from '@constants/index';
import { useAppSelector } from '@hooks/typed-react-redux-hooks';
import { getClearLastRoutePath, TPreviousLocations } from '@utils/index';

import { ResultAuth } from './result-auth';
import { ResultChangePassword } from './result-change-password';
import { ResultRegistration } from './result-registration';

export const ResultPage = () => {
    const { state } = useLocation();
    const { previousLocations } = useAppSelector((state) => state.router);

    if (!previousLocations || previousLocations.length === 0) {
        return <Navigate to={ROUTES_LINKS.home} replace={true} />;
    }

    const previousPath = getClearLastRoutePath(previousLocations as TPreviousLocations[]);

    if (previousPath === ROUTES_LINKS.registration) {
        return <ResultRegistration state={state} />;
    }

    if (previousPath === ROUTES_LINKS.auth) {
        return <ResultAuth state={state} />;
    }

    if (previousPath === ROUTES_LINKS.changePassword) {
        return <ResultChangePassword state={state} />;
    }

    return <Navigate to={ROUTES_LINKS.home} replace={true} />;
};
