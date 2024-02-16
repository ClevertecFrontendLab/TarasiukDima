import { Button } from 'antd';
import { Navigate, useLocation } from 'react-router-dom';
import { ResultRegistration } from './ResultRegistration';
import { ResultAuth } from './ResultAuth';
import { ResultComponent } from '@components/index';
import { ROUTES_LINKS } from '@constants/index';

import './result-page.scss';

export const ResultPage: React.FC = () => {
    const { state } = useLocation();

    if (!state || !state.from) {
        return <Navigate to={ROUTES_LINKS.home} replace />;
    }

    if (state.from === 'registration') {
        return <ResultRegistration state={state} />;
    }

    if (state.from === 'auth') {
        return <ResultAuth />;
    }

    return (
        <ResultComponent
            status='500'
            title='Что-то пошло не так'
            subTitle='Произошла ошибка, попробуйте отправить форму ещё раз.'
            extra={<Button type='primary'>Назад</Button>}
        />
    );
};
