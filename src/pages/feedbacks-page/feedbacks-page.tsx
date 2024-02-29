import { ChangeEvent, useCallback, useState } from 'react';
import { PageLayout, PageHeader, ModalPage, Rating } from '@components/index';
import { ROUTES_LINKS } from '@constants/index';
import { FeedbacksPageEmpty } from './feedbacks-page-empty';
import { FeedbacksPageContent } from './feedbacks-page-content';
import { ModalsInfo } from './modals-info';
import { useAddFeedbackMutation } from '@services/feedbackApi';
import { Button, Input } from 'antd';

import './feedbacks-page.scss';

const routes = [
    {
        path: ROUTES_LINKS.home,
        breadcrumbName: 'Главная',
    },
    {
        path: ROUTES_LINKS.feedbacks,
        breadcrumbName: 'Отзывы пользователей',
    },
];

const feedbacksList = [];

export const FeedbacksPage: React.FC = () => {
    const [openModalError, setOpenModalError] = useState<boolean>(false);
    const [openModalTokenError, setOpenModalTokenError] = useState<boolean>(false);
    const [openModalFeedback, setOpenModalFeedback] = useState<boolean>(false);
    const [openModalOkAddedFeedback, setOpenModalOkAddedFeedback] = useState<boolean>(false);
    const [isErrorAddFeedbackOpen, setErrorAddFeedbackOpen] = useState<boolean>(false);

    const [feedbackStart, setFeedbackStart] = useState<number>(0);
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

    const showAddFeedbackModalHandler = useCallback(() => {
        setOpenModalFeedback(true);
    }, []);

    const closeModalError = useCallback(() => {
        setOpenModalError(false);
    }, []);

    const closeModalTokenError = useCallback(() => {
        setOpenModalTokenError(false);
    }, []);

    const closeModalOkFeedback = useCallback(() => {
        setOpenModalOkAddedFeedback(false);
    }, []);

    const closeModalFeedback = useCallback(() => {
        setOpenModalFeedback(false);
    }, []);

    // feedback modals
    const repeateWriteFeedback = useCallback(() => {
        setOpenModalFeedback(true);
        setErrorAddFeedbackOpen(false);
    }, []);

    const closeErrorAddFeedback = useCallback(() => {
        setErrorAddFeedbackOpen(false);
    }, []);

    const typeFeedback = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
        setFeedbackText(event.target.value);
    }, []);

    const changeFeedbackStarts = useCallback((stars: number) => {
        setFeedbackStart(stars);
    }, []);

    const postFeedback = useCallback(() => {
        if (feedbackStart === 0) return;

        addFeedback({
            message: feedbackText,
            rating: feedbackStart,
        });
    }, [addFeedback, feedbackStart, feedbackText]);

    return (
        <PageLayout>
            <PageHeader routes={routes} />

            {!feedbacksList || feedbacksList.length === 0 ? (
                <FeedbacksPageEmpty addCommentModalHandler={showAddFeedbackModalHandler} />
            ) : (
                <FeedbacksPageContent
                    addCommentModalHandler={showAddFeedbackModalHandler}
                    feedbacks={feedbacksList}
                />
            )}

            <ModalsInfo
                isErrorOpen={openModalError}
                closeErrorCB={closeModalError}
                isTokenErrorOpen={openModalTokenError}
                closeTokenErrorCB={closeModalTokenError}
                isSuccessFeedbackOpen={openModalOkAddedFeedback}
                closeSuccessFeedbackCB={closeModalOkFeedback}
                isErrorAddFeedbackOpen={isErrorAddFeedbackOpen}
                closeErrorAddFeedbackCB={closeErrorAddFeedback}
                repeateWriteShowModalFeedback={repeateWriteFeedback}
            />

            <ModalPage
                width={540}
                variant='content'
                title='Ваш отзыв'
                open={openModalFeedback}
                onCancel={closeModalFeedback}
                closable
                footer={
                    <Button
                        type='primary'
                        className='content-btn button-page'
                        disabled={
                            (feedbackStart === 0 && feedbackText === '') || isFeedbackAddLoading
                        }
                        onClick={postFeedback}
                    >
                        Опубликовать
                    </Button>
                }
            >
                <Rating
                    isClickable
                    onChange={changeFeedbackStarts}
                    rating={feedbackStart}
                    className='content-rating'
                />

                <Input.TextArea
                    className='content-text'
                    allowClear
                    placeholder='Autosize height based on content lines'
                    value={feedbackText}
                    onChange={typeFeedback}
                />
            </ModalPage>
        </PageLayout>
    );
};
