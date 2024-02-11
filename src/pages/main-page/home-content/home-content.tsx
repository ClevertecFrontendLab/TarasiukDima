import { Link } from 'react-router-dom';
import { AndroidFilled, AppleFilled, SettingOutlined } from '@ant-design/icons';
import { Button, Card, Layout, List, Row, Space } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import Paragraph from 'antd/lib/typography/Paragraph';
import Title from 'antd/lib/typography/Title';

import { cardsData, listData } from './home-data';

import './home-content.scss';

const HomeContent = () => {
    return (
        <Layout className='page-layout'>
            <Header className='page-layout__header'>
                <Paragraph className='page-layout__header_current-link'>Главная</Paragraph>

                <Title className='page-layout__header_title'>
                    Приветствуем тебя <br/> в CleverFit — приложении, которое поможет тебе добиться своей мечты!
                </Title>

                <Button className='page-layout__header_settings' type='link'>
                    <SettingOutlined /> Настройки
                </Button>
            </Header>

            <Content className='page-layout__content'>
                <Paragraph className='page-layout__content_item able-item'>
                    <Paragraph>С CleverFit ты сможешь:</Paragraph>

                    <List
                        dataSource={listData}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                </Paragraph>

                <Paragraph className='page-layout__content_item about-item'>
                    CleverFit — это не просто приложение, а твой личный помощник<br/> в мире фитнеса. Не
                    откладывай на завтра — начни тренироваться уже сегодня!
                </Paragraph>

                <List
                    grid={{ gutter: 16, column: 3, xs: 1, }}
                    dataSource={cardsData}
                    className='page-layout__content_cards'
                    renderItem={(item) => (
                        <List.Item>
                            <Card title={item.title} className='cards__item'>
                                {item.link}
                            </Card>
                        </List.Item>
                    )}
                />
            </Content>

            <Footer className='page-layout__footer'>
                <Row justify='space-between' align='bottom' className='page-layout__footer_line'>
                    <Button type='link' className='page-layout__footer_reviews'>
                        Смотреть отзывы
                    </Button>

                    <Card
                        className='page-layout__footer_downloads'
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
            </Footer>
        </Layout>
    );
};

export default HomeContent;
