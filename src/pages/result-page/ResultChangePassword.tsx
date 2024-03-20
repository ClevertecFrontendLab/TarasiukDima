import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ResultComponent } from '@components/index';
import { ROUTES_LINKS, USER_IDS } from '@constants/index';

type TResultChangePasswordProps = {
    state?: {
        variant: 'error' | null;
        password: string;
    };
};
export const ResultChangePassword: React.FC<TResultChangePasswordProps> = ({ state }) => {
    const navigate = useNavigate();

    const repeatChangePasswordHandler = useCallback(() => {
        navigate(ROUTES_LINKS.changePassword);
        return;
    }, [navigate]);

    if (state && state.variant === 'error') {
        return (
            <ResultComponent
                status='error'
                title='Данные не сохранились'
                subTitle='Что-то пошло не так. Попробуйте ещё раз'
                extra={
                    <Button
                        className='link'
                        type='primary'
                        onClick={repeatChangePasswordHandler}
                        data-test-id={USER_IDS.changeResultRetryBtn}
                    >
                        Повторить
                    </Button>
                }
            />
        );
    }

    return (
        <ResultComponent
            status='success'
            title='Пароль успешно изменен'
            subTitle={
                <>
                    Теперь можно войти в аккаунт, используя
                    <br /> свой логин и новый пароль
                </>
            }
            extra={
                <Link
                    className='link'
                    to={ROUTES_LINKS.auth}
                    data-test-id={USER_IDS.changeResultEntryBtn}
                >
                    Вход
                </Link>
            }
        />
    );
};
