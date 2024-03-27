import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@hooks/typed-react-redux-hooks';
import { useAddFeedbackMutation, useGetFeedbackQuery } from '@services/index';
import { setToken } from '@redux/index';
import { removeLocalStorageItem } from '@utils/storage';
import { Button, Input } from 'antd';
import { PageLayout, PageHeader, ModalPage, Rating } from '@components/index';
import { FeedbacksPageEmpty } from './feedbacks-page-empty';
import { FeedbacksPageContent } from './feedbacks-page-content';
import { ModalsInfo } from './modals-info';
import {
    FEEDBACKS_IDS,
    REPEAT_FEEDBACKS_REQUEST,
    ROUTES_LINKS,
    STATUS_CODES,
    TOKEN_AUTH_LOCALSTORAGE,
} from '@constants/index';
import { TServerErrorResponse } from '@app_types/index';

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

export const FeedbacksPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [openModalError, setOpenModalError] = useState<boolean>(false);
    const [openModalFeedback, setOpenModalFeedback] = useState<boolean>(false);
    const [openModalOkAddedFeedback, setOpenModalOkAddedFeedback] = useState<boolean>(false);
    const [isErrorAddFeedbackOpen, setErrorAddFeedbackOpen] = useState<boolean>(false);

    const [feedbackStar, setFeedbackStar] = useState<number>(0);
    const [feedbackText, setFeedbackText] = useState<string>('');

    const {
        currentData: feedbacksList = [],
        error: feedbacksErrorData,
        isLoading: isFeedbacksLoading,
        isError: isFeedbacksError,
    } = useGetFeedbackQuery(null, {
        pollingInterval: REPEAT_FEEDBACKS_REQUEST,
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

    useEffect(() => {
        if (isFeedbacksError && feedbacksErrorData) {
            const statusError = (feedbacksErrorData as TServerErrorResponse).status.toString();

            if (statusError === STATUS_CODES.not_auth) {
                dispatch(setToken(''));
                removeLocalStorageItem(TOKEN_AUTH_LOCALSTORAGE);

                navigate(ROUTES_LINKS.auth);
                return;
            }

            setOpenModalError(true);
        }
    }, [dispatch, isFeedbacksError, navigate, feedbacksErrorData]);

    useEffect(() => {
        if (isErrorFeedbackAdd && feedbackAddErrorData) {
            setOpenModalFeedback(false);
            setErrorAddFeedbackOpen(true);
        }
    }, [isErrorFeedbackAdd, feedbackAddErrorData]);

    useEffect(() => {
        if (isSuccessFeedbackAdd) {
            setOpenModalOkAddedFeedback(true);
            setOpenModalFeedback(false);
            setFeedbackStar(0);
            setFeedbackText('');
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
        <PageLayout isLoading={isFeedbacksLoading} className='feedbacks-page'>
            <PageHeader routes={routes} />

            {
                // eslint-disable-next-line no-extra-boolean-cast
                !Boolean(feedbacksList.length) ? (
                    <FeedbacksPageEmpty addCommentModalHandler={showAddFeedbackModalHandler} />
                ) : (
                    <FeedbacksPageContent
                        addCommentModalHandler={showAddFeedbackModalHandler}
                        feedbacks={feedbacksList}
                    />
                )
            }

            <ModalsInfo
                isErrorOpen={openModalError}
                closeErrorCB={closeModalError}
                isSuccessFeedbackOpen={openModalOkAddedFeedback}
                closeSuccessFeedbackCB={closeModalOkFeedback}
                isErrorAddFeedbackOpen={isErrorAddFeedbackOpen}
                closeErrorAddFeedbackCB={closeErrorAddFeedback}
                repeatWriteShowModalFeedback={repeateWriteFeedback}
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
        </PageLayout>
    );
};
