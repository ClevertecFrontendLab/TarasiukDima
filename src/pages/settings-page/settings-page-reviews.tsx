import { memo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row } from 'antd';
import { ROUTES_LINKS } from '@constants/index';
import { FeedbacksAddModals } from '@components/index';

export const SettingsPageReviews = memo(() => {
    const [isOpenModalFeedback, setIsOpenModalFeedback] = useState<boolean>(false);

    const showAddFeedbackModalHandler = useCallback(() => {
        setIsOpenModalFeedback(true);
    }, []);

    return (
        <>
            <Row className='settings-page__review-buttons' justify='start' align='stretch'>
                <Button
                    type='primary'
                    className='page-button'
                    onClick={showAddFeedbackModalHandler}
                >
                    Написать отзыв
                </Button>

                <Link to={ROUTES_LINKS.feedbacks} className='page-button all-button'>
                    Смотреть все отзывы
                </Link>
            </Row>

            <FeedbacksAddModals
                openModalFeedback={isOpenModalFeedback}
                setOpenModalFeedback={setIsOpenModalFeedback}
            />
        </>
    );
});
