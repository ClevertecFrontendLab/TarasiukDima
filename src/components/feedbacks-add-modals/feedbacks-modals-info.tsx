import { Fragment, useCallback } from 'react';
import { ModalPage } from '@components/index';
import { FEEDBACKS_IDS } from '@constants/index';
import { useAppDispatch, useAppSelector } from '@hooks/index';
import { changeShowTokenError } from '@redux/index';
import { Button, Result, Row } from 'antd';

type TFeedbacksModalsInfoProps = {
    isSuccessFeedbackOpen: boolean;
    closeSuccessFeedbackCB: () => void;

    isErrorAddFeedbackOpen: boolean;
    closeErrorAddFeedbackCB: () => void;
    repeatWriteShowModalFeedback: () => void;
};

export const FeedbacksModalsInfo: React.FC<TFeedbacksModalsInfoProps> = ({
    isSuccessFeedbackOpen,
    closeSuccessFeedbackCB,
    isErrorAddFeedbackOpen,
    closeErrorAddFeedbackCB,
    repeatWriteShowModalFeedback,
}) => {
    const dispatch = useAppDispatch();
    const { isShowTokenError } = useAppSelector((state) => state.app);

    const closeModalTokenError = useCallback(() => {
        dispatch(changeShowTokenError(false));
    }, [dispatch]);

    return (
        <Fragment>
            <ModalPage
                variant='info'
                open={isShowTokenError}
                onCancel={closeModalTokenError}
                closable={true}
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
                closable={true}
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
                                onClick={repeatWriteShowModalFeedback}
                                data-test-id={FEEDBACKS_IDS.errorModalAddReviewBtn}
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
        </Fragment>
    );
};
