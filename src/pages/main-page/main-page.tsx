import { Link } from 'react-router-dom';
import { AndroidFilled, AppleFilled, SettingOutlined } from '@ant-design/icons';
import { Button, Card, List, Row } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Title from 'antd/lib/typography/Title';
import { PageContent, PageFooter, PageHeader, PageLayout } from '@components/index';
import { cardsData, listData } from './home-data';
import { ROUTES_LINKS } from '@constants/index';

import './main-page.scss';

const routes = [
    {
        path: ROUTES_LINKS.home,
        breadcrumbName: 'Главная',
    },
];

export const MainPage = () => (
    <PageLayout className='home-page'>
        <PageHeader className='home-header' routes={routes}>
            <Title className='home-header_title'>
                Приветствуем тебя <br /> в CleverFit — приложении, которое поможет тебе добиться
                своей мечты!
            </Title>

            <Button className='home-header_settings' type='link'>
                <SettingOutlined /> Настройки
            </Button>
        </PageHeader>

        <PageContent className='home-content'>
            <Paragraph className='home-content__item able-item'>
                <Paragraph>С CleverFit ты сможешь:</Paragraph>

                <List dataSource={listData} renderItem={(item) => <List.Item>{item}</List.Item>} />
            </Paragraph>

            <Paragraph className='home-content__item about-item'>
                CleverFit — это не просто приложение, а твой личный помощник
                <br /> в мире фитнеса. Не откладывай на завтра — начни тренироваться уже сегодня!
            </Paragraph>

            <List
                grid={{ gutter: 16, column: 3, xs: 1 }}
                dataSource={cardsData}
                className='home-content__cards'
                renderItem={(item) => (
                    <List.Item>
                        <Card title={item.title} className='cards__item'>
                            {item.link}
                        </Card>
                    </List.Item>
                )}
            />
        </PageContent>

        <PageFooter className='home-footer'>
            <Row justify='space-between' align='bottom' className='home-footer__line'>
                <Link
                    to={ROUTES_LINKS.feedbacks}
                    className='home-footer__reviews'
                    data-test-id='see-reviews'
                >
                    Смотреть отзывы
                </Link>

                <Card
                    className='home-footer__downloads'
                    title={
                        <>
                            <Link to='#'>Скачать на телефон</Link>
                            <Paragraph>Доступно в PRO-тарифе</Paragraph>
                        </>
                    }
                >
                    <Button type='link' className='downloads__link'>
                        <AndroidFilled /> Android OS
                    </Button>
                    <Button type='link' className='downloads__link'>
                        <AppleFilled /> Apple iOS
                    </Button>
                </Card>
            </Row>
        </PageFooter>
    </PageLayout>
);
