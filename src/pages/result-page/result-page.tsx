import { Button } from 'antd';
import { ResultComponent } from '@components/index';

import './result-page.scss';

export const ResultPage: React.FC = () => {
    // useLocation


    return (
        <ResultComponent
            status='500'
            title='Что-то пошло не так'
            subTitle='Произошла ошибка, попробуйте отправить форму ещё раз.'
            extra={<Button type='primary'>Назад</Button>}
        />
    );
};
