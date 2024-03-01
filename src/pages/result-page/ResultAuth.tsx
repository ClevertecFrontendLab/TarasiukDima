import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ResultComponent } from '@components/index';
import { ROUTES_LINKS } from '@constants/index';
import { useCallback } from 'react';

type TResultAuthProps = {
    state?: {
        variantError: 'no-user' | 'server' | null;
    };
}
export const ResultAuth: React.FC<TResultAuthProps> = ({ state }) => {
    const navigate = useNavigate();

    const repeatCheckEmailHandler = useCallback(() => {
        navigate(ROUTES_LINKS.auth);
        return;
    }, [navigate]);

    if (state && state.variantError === 'no-user') {
        return (
            <ResultComponent
                status='error'
                title='Такой e-mail не зарегистрирован'
                subTitle={
                    <>
                        Мы не нашли в базе вашего e-mail. Попробуйте
                        <br /> войти с другим e-mail.
                    </>
                }
                extra={
                    <Link className='link' to={ROUTES_LINKS.auth} data-test-id='check-retry-button'>
                        Попробовать снова
                    </Link>
                }
            />
        );
    }

    if (state && state.variantError === 'server') {
        return (
            <ResultComponent
                status='500'
                title='Что-то пошло не так'
                subTitle={<>Произошла ошибка, попробуйте отправить форму ещё раз.</>}
                extra={
                    <Button
                        className='small-link'
                        type='primary'
                        onClick={repeatCheckEmailHandler}
                        data-test-id='check-back-button'
                    >
                        Назад
                    </Button>
                }
            />
        );
    }

    return (
        <ResultComponent
            status='warning'
            title='Вход не выполнен'
            subTitle='Что-то пошло не так. Попробуйте еще раз'
            extra={
                <Link className='link' to={ROUTES_LINKS.auth} data-test-id='login-retry-button'>
                    Повторить
                </Link>
            }
        />
    );
};
