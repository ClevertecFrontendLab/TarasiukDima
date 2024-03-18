import { memo } from 'react';
import { Button, Result } from 'antd';
import { PageContent } from '@components/index';
import { FEEDBACKS_IDS } from '@constants/index';
import { TSimpleFn } from '@app_types/common';

export const FeedbacksPageEmpty: React.FC<{ addCommentModalHandler: TSimpleFn }> = memo(
    ({ addCommentModalHandler }) => (
        <PageContent className='feedbacks__non-content'>
            <Result
                className='feedbacks__non-content_text'
                icon={null}
                title='Оставьте свой отзыв первым'
                extra={
                    <>
                        Вы можете быть первым, кто оставит отзыв об этом фитнесс приложении.
                        <br />
                        Поделитесь своим мнением и опытом с другими пользователями, <br />и помогите
                        им сделать правильный выбор.
                    </>
                }
            />

            <Button
                type='primary'
                className='button-page'
                onClick={addCommentModalHandler}
                data-test-id={FEEDBACKS_IDS.addReview}
            >
                Написать отзыв
            </Button>
        </PageContent>
    ),
);
