import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Result, Row } from 'antd';
import { ModalPage } from '@components/index';
import { ROUTES_LINKS } from '@constants/index';

interface IFeedbacksPageProps {
    isErrorOpen: boolean;
    closeErrorCB: () => void;

    isTokenErrorOpen: boolean;
    closeTokenErrorCB: () => void;

    isSuccessFeedbackOpen: boolean;
    closeSuccessFeedbackCB: () => void;

    isErrorAddFeedbackOpen: boolean;
    closeErrorAddFeedbackCB: () => void;
    repeateWriteShowModalFeedback: () => void;
}

export const ModalsInfo: React.FC<IFeedbacksPageProps> = ({
    isErrorOpen,
    closeErrorCB,
    isTokenErrorOpen,
    closeTokenErrorCB,
    isSuccessFeedbackOpen,
    closeSuccessFeedbackCB,
    isErrorAddFeedbackOpen,
    closeErrorAddFeedbackCB,
    repeateWriteShowModalFeedback,
}) => {
    const navigate = useNavigate();

    const redirectHomePage = useCallback(() => {
        closeErrorCB();
        return navigate(ROUTES_LINKS.home);
    }, [navigate, closeErrorCB]);

    return (
        <>
            <ModalPage variant='error' open={isErrorOpen}>
                <Result
                    status='500'
                    title='Что-то пошло не так'
                    subTitle='Что-то пошло не так'
                    extra={
                        <Button
                            type='primary'
                            className='cbp button-page'
                            onClick={redirectHomePage}
                        >
                            Назад
                        </Button>
                    }
                />
            </ModalPage>

            <ModalPage variant='info' open={isTokenErrorOpen} onCancel={closeTokenErrorCB} closable>
                <Result status='error' title='Отсутствует токен' />
            </ModalPage>

            <ModalPage variant='info' open={isSuccessFeedbackOpen}>
                <Result
                    status='success'
                    title='Отзыв успешно опубликован'
                    extra={
                        <Button
                            type='primary'
                            className='wbp button-page'
                            onClick={closeSuccessFeedbackCB}
                        >
                            Отлично
                        </Button>
                    }
                />
            </ModalPage>

            <ModalPage
                variant='info'
                open={isErrorAddFeedbackOpen}
                onCancel={closeErrorAddFeedbackCB}
                closable
            >
                <Result
                    status='error'
                    title='Данные не сохранились'
                    subTitle='Что-то пошло не так. Попробуйте ещё раз.'
                    extra={
                        <Row className='error-buttons' justify='center' align='stretch'>
                            <Button
                                type='primary'
                                className='button-page'
                                onClick={repeateWriteShowModalFeedback}
                                data-test-id='write-review-not-saved-modal'
                            >
                                Написать отзыв
                            </Button>

                            <Button
                                type='default'
                                className='button-page'
                                onClick={closeErrorAddFeedbackCB}
                            >
                                Закрыть
                            </Button>
                        </Row>
                    }
                />
            </ModalPage>
        </>
    );
};
