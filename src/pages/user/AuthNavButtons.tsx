import { memo } from 'react';
import { Button, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { ROUTES_LINKS } from '@constants/index';

import './auth.scss';

type TUserPagesButtonsProps = {
    active?: 'auth' | 'register';
};

type TButtonForNavProps = {
    text: string;
    active: boolean;
    link?: string;
};
const ButtonForNav: React.FC<TButtonForNavProps> = ({ text, active, link = '' }) => {
    if (active) {
        return <Button className='auth-buttons__link active'>{text}</Button>;
    }

    return (
        <Link to={link} className='auth-buttons__link '>
            {text}
        </Link>
    );
};

export const AuthNavButtons: React.FC<TUserPagesButtonsProps> = memo(({ active = 'auth' }) => (
    <Row className='auth-buttons'>
        <Col span={12}>
            <ButtonForNav active={active === 'auth'} text='Вход' link={ROUTES_LINKS.auth} />
        </Col>

        <Col span={12}>
            <ButtonForNav
                active={active === 'register'}
                text='Регистрация'
                link={ROUTES_LINKS.registration}
            />
        </Col>
    </Row>
));
