import { ResultComponent } from '@components/index';
import Paragraph from 'antd/lib/typography/Paragraph';

import './auth.scss';

export const ConfirmEmailPage: React.FC = () => {
    return (
        <ResultComponent
            title={
                <Paragraph>
                    Введите код <br />
                    для восстановления аккауанта
                </Paragraph>
            }
            subTitle={
                <>
                    Мы отправили вам на e-mail <span>victorbyden@gmail.com</span> <br />
                    шестизначный код. Введите его в поле ниже.
                </>
            }
            extra={
                <>
                    <Paragraph>Не пришло письмо? Проверьте папку Спам.</Paragraph>
                </>
            }
        />
    );
};
