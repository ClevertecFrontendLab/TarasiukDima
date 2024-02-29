import { useCallback, useMemo, useState } from 'react';
import { Button, Row } from 'antd';
import { Feedbacks, PageContent, PageFooter } from '@components/index';
import { TSimpleFn } from '@app_types/common';
import { IFeedback } from '@services/types';
import { sortArrayByDate } from '@utils/index';

interface IFeedbacksPageContent {
    addCommentModalHandler: TSimpleFn;
    feedbacks: Array<IFeedback>;
}

const COUNT_FEEDBACKS_TO_SHOW = 4;

export const FeedbacksPageContent: React.FC<IFeedbacksPageContent> = ({
    addCommentModalHandler,
    feedbacks,
}) => {
    const [countItemsToShow, setCountItemsToShow] = useState<null | number>(
        COUNT_FEEDBACKS_TO_SHOW,
    );

    const showAllFeedbacksHandler = useCallback(() => {
        setCountItemsToShow((prev) => {
            return prev ? null : COUNT_FEEDBACKS_TO_SHOW;
        });
    }, []);

    const feedbacksList = useMemo(() => {
        const sortedList = sortArrayByDate<IFeedback, 'createdAt'>(feedbacks, 'createdAt');
        return countItemsToShow ? sortedList.slice(0, countItemsToShow) : sortedList;
    }, [countItemsToShow, feedbacks]);
    return (
        <>
            <PageContent className='feedbacks__content'>
                <Feedbacks feedbacks={feedbacksList} />
            </PageContent>

            <PageFooter className='feedbacks__footer'>
                <Row justify='start' align='stretch' className='feedbacks__footer_line'>
                    <Button
                        type='primary'
                        className='button-page'
                        onClick={addCommentModalHandler}
                        data-test-id='write-review'
                    >
                        Написать отзыв
                    </Button>

                    {feedbacks.length >= COUNT_FEEDBACKS_TO_SHOW && (
                        <Button
                            type='link'
                            className='show-all link'
                            onClick={showAllFeedbacksHandler}
                            data-test-id='all-reviews-button'
                        >
                            {countItemsToShow ? 'Развернуть все отзывы' : 'Свернуть все отзывы'}
                        </Button>
                    )}
                </Row>
            </PageFooter>
        </>
    );
};
