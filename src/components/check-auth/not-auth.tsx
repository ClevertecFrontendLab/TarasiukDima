import { Navigate } from 'react-router-dom';
import { ROUTES_LINKS } from '@constants/index';
import { useAppSelector } from '@hooks/typed-react-redux-hooks';

import { TCheckAuthProps } from './types';

export const NotAuth: React.FC<TCheckAuthProps> = ({ children, redirect = ROUTES_LINKS.home }) => {
    const { token } = useAppSelector((state) => state.auth);

    if (token) {
        return <Navigate to={redirect} replace={true} />;
    }

    return children;
};
