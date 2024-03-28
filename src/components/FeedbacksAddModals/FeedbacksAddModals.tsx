import { ChangeEvent, FC, memo, useCallback, useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import { useAddFeedbackMutation } from '@services/index';
import { FEEDBACKS_IDS } from '@constants/index';
import { FeedbacksModalsInfo } from './FeedbacksModalsInfo';
import { ModalPage, Rating } from '..';

type TFeedbacksAddModalsProps = {
    openModalFeedback: boolean;
    setOpenModalFeedback: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FeedbacksAddModals: FC<TFeedbacksAddModalsProps> = memo(
    ({ openModalFeedback, setOpenModalFeedback }) => {
        const [openModalOkAddedFeedback, setOpenModalOkAddedFeedback] = useState<boolean>(false);
        const [isErrorAddFeedbackOpen, setErrorAddFeedbackOpen] = useState<boolean>(false);

        const [feedbackStar, setFeedbackStar] = useState<number>(0);
        const [feedbackText, setFeedbackText] = useState<string>('');

        const [
            addFeedback,
            {
                isError: isErrorFeedbackAdd,
                isSuccess: isSuccessFeedbackAdd,
                error: feedbackAddErrorData,
                isLoading: isFeedbackAddLoading,
            },
        ] = useAddFeedbackMutation();

        useEffect(() => {
            if (isErrorFeedbackAdd && feedbackAddErrorData) {
                setOpenModalFeedback(false);
                setErrorAddFeedbackOpen(true);
            }
        }, [isErrorFeedbackAdd, feedbackAddErrorData, setOpenModalFeedback]);

        useEffect(() => {
            if (isSuccessFeedbackAdd) {
                setOpenModalOkAddedFeedback(true);
                setOpenModalFeedback(false);
                setFeedbackStar(0);
                setFeedbackText('');
            }
        }, [isSuccessFeedbackAdd, setOpenModalFeedback]);

        const closeModalOkFeedback = useCallback(() => {
            setOpenModalOkAddedFeedback(false);
        }, []);

        const closeModalFeedback = useCallback(() => {
            setOpenModalFeedback(false);
        }, [setOpenModalFeedback]);

        const repeatWriteFeedback = useCallback(() => {
            setOpenModalFeedback(true);
            setErrorAddFeedbackOpen(false);
        }, [setOpenModalFeedback]);

        const closeErrorAddFeedback = useCallback(() => {
            setErrorAddFeedbackOpen(false);
        }, []);

        const typeFeedback = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
            setFeedbackText(event.target.value);
        }, []);

        const changeFeedbackStars = useCallback((star: number) => {
            setFeedbackStar(star);
        }, []);

        const postFeedback = useCallback(() => {
            // eslint-disable-next-line no-extra-boolean-cast
            if (!Boolean(feedbackStar)) return;

            addFeedback({
                message: feedbackText,
                rating: feedbackStar,
            });
        }, [addFeedback, feedbackStar, feedbackText]);

        return (
            <>
                <FeedbacksModalsInfo
                    isSuccessFeedbackOpen={openModalOkAddedFeedback}
                    closeSuccessFeedbackCB={closeModalOkFeedback}
                    isErrorAddFeedbackOpen={isErrorAddFeedbackOpen}
                    closeErrorAddFeedbackCB={closeErrorAddFeedback}
                    repeatWriteShowModalFeedback={repeatWriteFeedback}
                />

                <ModalPage
                    width={540}
                    variant='content'
                    title='Ваш отзыв'
                    blur='light'
                    open={openModalFeedback}
                    onCancel={closeModalFeedback}
                    closable
                    footer={
                        <Button
                            type='primary'
                            className='content-btn button-page'
                            disabled={
                                // eslint-disable-next-line no-extra-boolean-cast
                                (!Boolean(feedbackStar) && !feedbackText) || isFeedbackAddLoading
                            }
                            onClick={postFeedback}
                            data-test-id={FEEDBACKS_IDS.newSubmitBtn}
                        >
                            Опубликовать
                        </Button>
                    }
                >
                    <Rating
                        isClickable
                        onChange={changeFeedbackStars}
                        rating={feedbackStar}
                        className='content-rating'
                    />

                    <Input.TextArea
                        className='content-text'
                        allowClear
                        placeholder='Autosize height based on content lines'
                        value={feedbackText}
                        onChange={typeFeedback}
                        autoSize={{ minRows: 2, maxRows: 8 }}
                    />
                </ModalPage>
            </>
        );
    },
);
