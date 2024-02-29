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

const feedbacksList2 = [
    {
        id: '1',
        fullName: 'Вероника Киверова',
        imageSrc:
            'https://images.unsplash.com/photo-1709038459415-8379ce8ae789?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        message:
            'Я очень довольна этим приложением! Оно помогает мне следить за своим здоровьем и физической формой, предлагая разнообразные упражнения и питание. Я люблю, что приложение адаптируется к моему уровню и целям, и дает мне полезные советы и обратную связь. Я рекомендую это приложение всем, кто хочет улучшить свою жизнь!',
        rating: 5,
        createdAt: '2024-02-29T06:31:14.960Z',
    },
    {
        id: '2',
        fullName: 'Петров Петров',
        imageSrc:
            'https://plus.unsplash.com/premium_photo-1708275668360-cd29b1f5b67d?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        message:
            'Это приложение - отличный помощник для тех, кто занимается спортом. Оно показывает мне, как правильно выполнять упражнения, сколько калорий я сжигаю, и какой прогресс я достиг. Оно также мотивирует меня не сдаваться и достигать новых рекордов. Я уверен, что это приложение поможет мне достичь своей мечты - стать чемпионом!',
        rating: 4,
        createdAt: '2024-03-22T06:31:14.960Z',
    },
    {
        id: '3',
        fullName: 'Елена Ковалева',
        imageSrc:
            'https://images.unsplash.com/photo-1709038459415-8379ce8ae789?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        message:
            'Я не могу представить свою жизнь без этого приложения! Оно стало моим лучшим другом и наставником в области фитнеса. Оно учит меня, как заботиться о своем теле и душе, предоставляя мне интересные и эффективные упражнения, здоровое меню и релаксацию. Я чувствую себя счастливой и красивой благодаря этому приложению!',
        rating: 0,
        createdAt: '2024-01-29T06:31:14.960Z',
    },
    {
        id: '4',
        fullName: '',
        imageSrc: null,
        message: 'Классное приложение!',
        rating: 1,
        createdAt: '2024-03-21T06:31:14.960Z',
    },
];

export const FeedbacksPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [openModalError, setOpenModalError] = useState<boolean>(false);
    const [openModalTokenError, setOpenModalTokenError] = useState<boolean>(false);
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
            console.log('isFeedbacksError', feedbacksErrorData);

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
                        test-id='new-review-submit-button'
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
