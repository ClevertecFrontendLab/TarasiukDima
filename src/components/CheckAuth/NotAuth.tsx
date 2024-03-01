import { FC } from 'react';
import { useAppSelector } from '@hooks/typed-react-redux-hooks';
import { Navigate } from 'react-router-dom';
import { ROUTES_LINKS } from '@constants/index';
import { TCheckAuthProps } from './types';

export const NotAuth: FC<TCheckAuthProps> = ({ children, redirect = ROUTES_LINKS.home }) => {
    const { token } = useAppSelector((state) => state.user);

    if (token) {
        return <Navigate to={redirect} replace />;
    }

    return children;
};
