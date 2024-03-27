import { useAppSelector } from '@hooks/typed-react-redux-hooks';
import { ROUTES_LINKS } from '@constants/index';
import { TCheckAuthProps } from './types';
import { Navigate } from 'react-router-dom';

export const RequiredAuth: React.FC<TCheckAuthProps> = ({
    children,
    redirect = ROUTES_LINKS.auth,
}) => {
    const { token } = useAppSelector((state) => state.auth);

    if (!token) {
        return <Navigate to={redirect} replace />;
    }

    return children;
};
