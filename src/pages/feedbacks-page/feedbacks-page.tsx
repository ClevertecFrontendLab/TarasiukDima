import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@hooks/typed-react-redux-hooks';
import { useAddFeedbackMutation, useGetFeedbackQuery } from '@services/feedbackApi';
import { removeLocalStorageItem } from '@utils/storage';
import { setToken } from '@redux/user-slice';
import { PageLayout, PageHeader, ModalPage, Rating } from '@components/index';
import { ROUTES_LINKS, TOKEN_AUTH_LOCALSTORAGE } from '@constants/index';
import { FeedbacksPageEmpty } from './feedbacks-page-empty';
import { FeedbacksPageContent } from './feedbacks-page-content';
import { ModalsInfo } from './modals-info';
import { Button, Input } from 'antd';
import { IServerErrorResponse } from '@services/types';

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

export const FeedbacksPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [openModalError, setOpenModalError] = useState<boolean>(false);
    const [openModalFeedback, setOpenModalFeedback] = useState<boolean>(false);
    const [openModalOkAddedFeedback, setOpenModalOkAddedFeedback] = useState<boolean>(false);
    const [isErrorAddFeedbackOpen, setErrorAddFeedbackOpen] = useState<boolean>(false);

    const [feedbackStart, setFeedbackStart] = useState<number>(0);
    const [feedbackText, setFeedbackText] = useState<string>('');

    const {
        currentData: feedbacksList = [],
        error: feedbacksErrorData,
        isLoading: isFeedbacksLoading,
        isError: isFeedbacksError,
    } = useGetFeedbackQuery(null, {
        pollingInterval: 10000,
    });

    const [
        addFeedback,
        {
            isError: isErrorFeedbackAdd,
            isSuccess: isSuccessFeedbackAdd,
            error: feedbackAddErrorData,
            isLoading: isFeedbackAddLoading,
        },
    ] = useAddFeedbackMutation();

    // got error Feedbacks
    useEffect(() => {
        if (isFeedbacksError && feedbacksErrorData) {
            const statusError = (feedbacksErrorData as IServerErrorResponse).status.toString();

            if (statusError === '403') {
                dispatch(setToken(''));
                removeLocalStorageItem(TOKEN_AUTH_LOCALSTORAGE);

                navigate(ROUTES_LINKS.auth);
                return;
            }

            setOpenModalError(true);
        }
    }, [dispatch, isFeedbacksError, navigate, feedbacksErrorData]);

    // got error add a Feedback
    useEffect(() => {
        if (isErrorFeedbackAdd && feedbackAddErrorData) {
            setOpenModalFeedback(false);
            setErrorAddFeedbackOpen(true);
            return;
        }
    }, [isErrorFeedbackAdd, feedbackAddErrorData]);

    // got success add a Feedback
    useEffect(() => {
        if (isSuccessFeedbackAdd) {
            setOpenModalOkAddedFeedback(true);
            setOpenModalFeedback(false);
            setFeedbackStart(0);
            setFeedbackText('');
            return;
        }
    }, [isSuccessFeedbackAdd]);

    const showAddFeedbackModalHandler = useCallback(() => {
        setOpenModalFeedback(true);
    }, []);

    const closeModalError = useCallback(() => {
        setOpenModalError(false);
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
        <PageLayout isLoading={isFeedbacksLoading}>
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
                        data-test-id='new-review-submit-button'
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
                    autoSize={{ minRows: 2, maxRows: 8 }}
                />
            </ModalPage>
        </PageLayout>
    );
};
