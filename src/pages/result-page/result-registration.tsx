import { Fragment, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ResultComponent } from '@components/index';
import { ROUTES_LINKS, USER_IDS } from '@constants/index';
import { Button } from 'antd';

import { IResultItemProps } from './type';

export const ResultRegistration: React.FC<IResultItemProps> = ({ state }) => {
    const navigate = useNavigate();
    const statusCode = state && state.status ? state.status.toString() : '';

    const clickRepeatRegistrationHandler = useCallback(() => {
        navigate(ROUTES_LINKS.registration);
    }, [navigate]);

    if (statusCode === 'success') {
        return (
            <ResultComponent
                status='success'
                title='Регистрация успешна'
                subTitle={
                    <Fragment>
                        Регистрация прошла успешно. Зайдите <br /> в приложение, используя свои
                        e-mail и пароль.
                    </Fragment>
                }
                extra={
                    <Link
                        className='link'
                        to={ROUTES_LINKS.auth}
                        data-test-id={USER_IDS.registrationResultEnterBtn}
                    >
                        Войти
                    </Link>
                }
            />
        );
    }

    if (statusCode === '409') {
        return (
            <ResultComponent
                status='error'
                title='Данные не сохранились'
                subTitle='Такой e-mail уже записан в системе. Попробуйте зарегистрироваться по другому e-mail.'
                extra={
                    <Link
                        className='link'
                        to={ROUTES_LINKS.registration}
                        data-test-id={USER_IDS.registrationResultBackBtn}
                    >
                        Назад к регистрации
                    </Link>
                }
            />
        );
    }

    return (
        <ResultComponent
            status='error'
            title='Данные не сохранились'
            subTitle={
                <Fragment>
                    Что-то пошло не так и ваша регистрация <br />
                    не завершилась. Попробуйте ещё раз.
                </Fragment>
            }
            extra={
                <Button
                    onClick={clickRepeatRegistrationHandler}
                    type='primary'
                    className='link'
                    data-test-id={USER_IDS.registrationResultRetryBtn}
                >
                    Повторить
                </Button>
            }
        />
    );
};
