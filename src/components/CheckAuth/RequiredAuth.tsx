import { FC } from 'react';
import { useAppSelector } from '@hooks/typed-react-redux-hooks';
import { ROUTES_LINKS } from '@constants/index';
import { ICheckAuthProps } from './types';
import { Navigate } from 'react-router-dom';

export const RequiredAuth: FC<ICheckAuthProps> = ({ children, redirect = ROUTES_LINKS.auth }) => {
    const { token } = useAppSelector((state) => state.user);

    if (!token) {
        return <Navigate to={redirect} replace />;
    }

    return children;
};
