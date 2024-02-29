import { Avatar, Comment, List } from 'antd';
import { IFeedback } from '@services/types';
import Paragraph from 'antd/lib/typography/Paragraph';
import { UserOutlined } from '@ant-design/icons';
import { Rating } from '@components/index';

import './feedbacks.scss';

export interface IFeedbacksProps {
    feedbacks: Array<IFeedback>;
    isLoading?: boolean;
}

export const Feedbacks: React.FC<IFeedbacksProps> = ({ feedbacks, isLoading = false }) => {
    return (
        <List
            className='feedbacks-list'
            loading={isLoading}
            dataSource={feedbacks}
            renderItem={({ createdAt, fullName, id, imageSrc, message, rating }) => {
                const userName = fullName ? fullName : 'Пользователь';

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
    );
};

const getCorrectDateForShow = (dateStr: string) => {
    const dateFS = new Date(dateStr);

    return dateFS.toLocaleDateString('ru-RU', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
    });
};
