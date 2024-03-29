import { Navigate } from 'react-router-dom';
import { ROUTES_LINKS } from '@constants/index';
import { useAppSelector } from '@hooks/typed-react-redux-hooks';

import { TCheckAuthProps } from './types';

export const RequiredAuth: React.FC<TCheckAuthProps> = ({
    children,
    redirect = ROUTES_LINKS.auth,
}) => {
    const { token } = useAppSelector((state) => state.auth);

    if (!token) {
        return <Navigate to={redirect} replace={true} />;
    }

    return children;
};
