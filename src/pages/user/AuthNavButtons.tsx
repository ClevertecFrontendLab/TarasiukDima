import { Button, Col, Row } from 'antd';
import { Link } from 'react-router-dom';

import { ROUTES_LINKS } from '@constants/index';

import './auth.scss';

interface IUserPagesButtonsProps {
    active?: 'auth' | 'register';
}

interface IButtonForNavProps {
    text: string;
    active: boolean;
    link?: string;
}
const ButtonForNav: React.FC<IButtonForNavProps> = ({ text, active, link = '' }) => {
    if (active) {
        return <Button className='auth-buttons__link active'>{text}</Button>;
    }

    return (
        <Link to={link} className='auth-buttons__link '>
            {text}
        </Link>
    );
};

export const AuthNavButtons: React.FC<IUserPagesButtonsProps> = ({ active = 'auth' }) => {
    return (
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
    );
};
