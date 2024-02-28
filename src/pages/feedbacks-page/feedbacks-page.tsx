import { Button, List, Row } from 'antd';
import { PageLayout, PageHeader, PageContent, PageFooter } from '@components/index';
import { ROUTES_LINKS } from '@constants/index';

import './feedbacks-page.scss';

const routes = [
    {
        path: ROUTES_LINKS.home,
        breadcrumbName: 'Главная',
    },
    {
        path: ROUTES_LINKS.feedbacks,
        breadcrumbName: 'Отзывы',
    },
];

export const FeedbacksPage: React.FC = () => {
    return (
        <PageLayout>
            <PageHeader routes={routes} />

            <PageContent className='feedbacks__content'>
                <List
                    grid={{ gutter: 16, column: 3, xs: 1 }}
                    dataSource={[]}
                    className='feedbacks__content_cards'
                />
            </PageContent>

            <PageFooter className='feedbacks__footer'>
                <Row justify='start' align='stretch' className='feedbacks__footer_line'>
                    <Button type='link' className='feedbacks__footer_reviews'>
                        Написать отзыв
                    </Button>
                    <Button type='link' className='feedbacks__footer_reviews'>
                        Развернуть все отзывы
                    </Button>
                </Row>
            </PageFooter>
        </PageLayout>
    );
};
