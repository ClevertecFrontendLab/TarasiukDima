import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/typed-react-redux-hooks';
import { changeShowTokenError } from '@redux/index';
import { Button, Result, Row } from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import { ModalPage } from '@components/index';
import { ROUTES_LINKS, STATUS_CODES } from '@constants/index';

type TFeedbacksPageProps = {
    isErrorOpen: boolean;
    closeErrorCB: () => void;

    isSuccessFeedbackOpen: boolean;
    closeSuccessFeedbackCB: () => void;

    isErrorAddFeedbackOpen: boolean;
    closeErrorAddFeedbackCB: () => void;
    repeateWriteShowModalFeedback: () => void;
};

export const ModalsInfo: React.FC<TFeedbacksPageProps> = ({
    isErrorOpen,
    closeErrorCB,
    isSuccessFeedbackOpen,
    closeSuccessFeedbackCB,
    isErrorAddFeedbackOpen,
    closeErrorAddFeedbackCB,
    repeateWriteShowModalFeedback,
}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isShowTokenError } = useAppSelector((state) => state.app);

    const redirectHomePage = useCallback(() => {
        closeErrorCB();
        return navigate(ROUTES_LINKS.home);
    }, [navigate, closeErrorCB]);

    const closeModalTokenError = useCallback(() => {
        dispatch(changeShowTokenError(false));
    }, [dispatch]);

    return (
        <>
            <ModalPage variant='error' open={isErrorOpen}>
                <Result
                    status={STATUS_CODES.serverError as ResultStatusType}
                    title='Что-то пошло не так'
                    subTitle={
                        <>
                            Произошла ошибка, <br />
                            попробуйте ещё раз.
                        </>
                    }
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

            <ModalPage
                variant='info'
                open={isShowTokenError}
                onCancel={closeModalTokenError}
                closable
            >
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
