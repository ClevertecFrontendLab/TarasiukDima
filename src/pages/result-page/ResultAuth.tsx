import { Link } from 'react-router-dom';
import { ResultComponent } from '@components/index';
import { ROUTES_LINKS } from '@constants/index';

export const ResultAuth: React.FC = () => {
    return (
        <ResultComponent
            status='warning'
            title='Вход не выполнен'
            subTitle='Что-то пошло не так. Попробуйте еще раз'
            extra={
                <Link className='link' to={ROUTES_LINKS.auth}>
                    Повторить
                </Link>
            }
        />
    );
};
