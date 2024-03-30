import { Fragment, memo, useCallback, useMemo, useState } from 'react';
import { Feedbacks, PageContent, PageFooter } from '@components/index';
import { COUNT_FEEDBACKS_TO_SHOW, FEEDBACKS_IDS } from '@constants/index';
import { sortArrayByDate } from '@utils/index';
import { Button, Row } from 'antd';
import { TFeedback, TSimpleFn } from 'src/app-types/index';

type TFeedbacksPageContent = {
    addCommentModalHandler: TSimpleFn;
    feedbacks: TFeedback[];
};

export const FeedbacksPageContent: React.FC<TFeedbacksPageContent> = memo(
    ({ addCommentModalHandler, feedbacks }) => {
        const [countItemsToShow, setCountItemsToShow] = useState<null | number>(
            COUNT_FEEDBACKS_TO_SHOW,
        );

        const showAllFeedbacksHandler = useCallback(() => {
            setCountItemsToShow((prev) => (prev ? null : COUNT_FEEDBACKS_TO_SHOW));
        }, []);

        const feedbacksList = useMemo(() => {
            const sortedList = sortArrayByDate<TFeedback, 'createdAt'>(feedbacks, 'createdAt');

            return countItemsToShow ? sortedList.slice(0, countItemsToShow) : sortedList;
        }, [countItemsToShow, feedbacks]);

        return (
            <Fragment>
                <PageContent className='feedbacks__content'>
                    <Feedbacks feedbacks={feedbacksList} />
                </PageContent>

                <PageFooter className='feedbacks__footer'>
                    <Row justify='start' align='stretch' className='feedbacks__footer_line'>
                        <Button
                            type='primary'
                            className='button-page'
                            onClick={addCommentModalHandler}
                            data-test-id={FEEDBACKS_IDS.addReview}
                        >
                            Написать отзыв
                        </Button>

                        {feedbacks.length >= COUNT_FEEDBACKS_TO_SHOW && (
                            <Button
                                type='link'
                                className='show-all link'
                                onClick={showAllFeedbacksHandler}
                                data-test-id={FEEDBACKS_IDS.showAllBtn}
                            >
                                {countItemsToShow ? 'Развернуть все отзывы' : 'Свернуть все отзывы'}
                            </Button>
                        )}
                    </Row>
                </PageFooter>
            </Fragment>
        );
    },
);
