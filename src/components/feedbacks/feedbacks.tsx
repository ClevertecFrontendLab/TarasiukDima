import { Fragment, memo } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Rating } from '@components/index';
import { getCorrectDateForShow } from '@utils/index';
import { Avatar, Comment, List } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import { TFeedback } from 'src/app-types/index';

import './feedbacks.scss';

type TFeedbacksProps = {
    feedbacks: TFeedback[];
    isLoading?: boolean;
};

export const Feedbacks: React.FC<TFeedbacksProps> = memo(({ feedbacks, isLoading = false }) => (
    <List
        className='feedbacks-list'
        loading={isLoading}
        dataSource={feedbacks}
        renderItem={({ createdAt, fullName, id, imageSrc, message, rating }) => {
            const userName = fullName || 'Пользователь';

            return (
                <List.Item className='feedbacks-list__item'>
                    <Comment
                        key={id}
                        avatar={
                            <Fragment>
                                <Avatar
                                    className='item__img'
                                    shape='circle'
                                    size={42}
                                    src={imageSrc}
                                    icon={<UserOutlined />}
                                />

                                <Paragraph className='item__name'>
                                    {userName.split(' ').map((word) => (
                                        <Paragraph key={word}>{word}</Paragraph>
                                    ))}
                                </Paragraph>
                            </Fragment>
                        }
                        content={message}
                        author={<Rating isClickable={false} rating={rating} />}
                        datetime={getCorrectDateForShow(createdAt)}
                    />
                </List.Item>
            );
        }}
    />
));
