import { Link } from 'react-router-dom';
import { ResultComponent } from '@components/index';
import { IResultItemProps } from './type';
import { ROUTES_LINKS } from '@constants/index';

export const ResultRegistration: React.FC<IResultItemProps> = ({ state }) => {
    const statusCode = state.data?.statusCode.toString();
    console.log('location', state);

    if (statusCode === 'success') {
        return (
            <ResultComponent
                status='success'
                title='Регистрация успешна'
                subTitle={
                    <>
                        Регистрация прошла успешно. Зайдите <br /> в приложение, используя свои
                        e-mail и пароль.
                    </>
                }
                extra={
                    <Link className='link' to={ROUTES_LINKS.auth}>
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
                    <Link className='link' to={ROUTES_LINKS.registration}>
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
                <>
                    Что-то пошло не так и ваша регистрация <br />
                    не завершилась. Попробуйте ещё раз.
                </>
            }
            extra={
                <Link className='link' to={ROUTES_LINKS.registration}>
                    Повторить
                </Link>
            }
        />
    );
};
