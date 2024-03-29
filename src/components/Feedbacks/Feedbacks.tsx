import { memo } from 'react';
import { Avatar, Comment, List } from 'antd';
import { getCorrectDateForShow } from '@utils/index';
import Paragraph from 'antd/lib/typography/Paragraph';
import { UserOutlined } from '@ant-design/icons';
import { Rating } from '@components/index';
import { TFeedback } from '@app_types/index';

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
                            <>
                                <Avatar
                                    className='item__img'
                                    shape='circle'
                                    size={42}
                                    src={imageSrc}
                                    icon={<UserOutlined />}
                                />

                                <Paragraph className='item__name'>
                                    {userName.split(' ').map((word, ind) => (
                                        <Paragraph key={ind}>{word}</Paragraph>
                                    ))}
                                </Paragraph>
                            </>
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
