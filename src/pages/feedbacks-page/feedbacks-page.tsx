import { Fragment, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeedbacksAddModals, ModalPage, PageHeader, PageLayout } from '@components/index';
import {
    REPEAT_FEEDBACKS_REQUEST,
    ROUTES_LINKS,
    STATUS_CODES,
    TOKEN_AUTH_LOCALSTORAGE,
} from '@constants/index';
import { useAppDispatch } from '@hooks/index';
import { setToken } from '@redux/index';
import { useGetFeedbackQuery } from '@services/index';
import { removeLocalStorageItem } from '@utils/index';
import { Button, Result } from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import { TServerErrorResponse } from 'src/app-types/index';

import { FeedbacksPageContent } from './feedbacks-page-content';
import { FeedbacksPageEmpty } from './feedbacks-page-empty';

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

    const [isOpenModalFeedback, setIsOpenModalFeedback] = useState<boolean>(false);
    const [openModalError, setOpenModalError] = useState<boolean>(false);

    const {
        currentData: feedbacksList = [],
        error: feedbacksErrorData,
        isLoading: isFeedbacksLoading,
        isError: isFeedbacksError,
    } = useGetFeedbackQuery(null, {
        pollingInterval: REPEAT_FEEDBACKS_REQUEST,
    });

    useEffect(() => {
        if (isFeedbacksError && feedbacksErrorData) {
            const statusError = (feedbacksErrorData as TServerErrorResponse).status.toString();

            if (statusError === STATUS_CODES.notAuth) {
                dispatch(setToken(''));
                removeLocalStorageItem(TOKEN_AUTH_LOCALSTORAGE);

                navigate(ROUTES_LINKS.auth);

                return;
            }

            setOpenModalError(true);
        }
    }, [dispatch, isFeedbacksError, navigate, feedbacksErrorData]);

    const showAddFeedbackModalHandler = useCallback(() => {
        setIsOpenModalFeedback(true);
    }, []);

    const redirectHomePage = useCallback(() => {
        setOpenModalError(false);

        return navigate(ROUTES_LINKS.home);
    }, [navigate]);

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

            <FeedbacksAddModals
                openModalFeedback={isOpenModalFeedback}
                setOpenModalFeedback={setIsOpenModalFeedback}
            />

            <ModalPage variant='error' open={openModalError}>
                <Result
                    status={STATUS_CODES.serverError as ResultStatusType}
                    title='Что-то пошло не так'
                    subTitle={
                        <Fragment>
                            Произошла ошибка, <br />
                            попробуйте ещё раз.
                        </Fragment>
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
        </PageLayout>
    );
};
