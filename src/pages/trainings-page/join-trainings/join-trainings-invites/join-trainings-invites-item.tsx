import { FC, memo, useCallback, useRef, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { TTrainingInviteItem } from '@app-types/index';
import { DATE_FORMAT_TO_VIEW } from '@constants/date';
import { useDayInfo } from '@hooks/get-day-info';
import { Avatar, Button, Card, Col } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';

import { JoinTrainingsInvitesItemModal } from './join-trainings-invites-item-modal';

type TJoinTrainingsInvitesItemProps = {
    data: TTrainingInviteItem;
    disabled: boolean;
    agreeCb: (id: string) => void;
    rejectCb: (id: string) => void;
};

export const JoinTrainingsInvitesItem: FC<TJoinTrainingsInvitesItemProps> = memo(
    ({ data, disabled, agreeCb, rejectCb }) => {
        const refModalWrapper = useRef<HTMLDivElement | null>(null);
        const { getDateNeededFormat } = useDayInfo();
        const { training, from, createdAt } = data;
        const [showTrainingExercises, setShowTrainingExercises] = useState(false);

        const userName = [from.firstName, from.lastName].filter((item) => Boolean(item));

        const agreeTraining = useCallback(() => {
            agreeCb(training._id as string);
        }, [agreeCb, training._id]);

        const rejectTraining = useCallback(() => {
            rejectCb(training._id as string);
        }, [rejectCb, training._id]);

        const showExercisesTraining = useCallback(() => {
            setShowTrainingExercises(true);
        }, []);

        const closeExercisesTraining = useCallback(() => {
            setShowTrainingExercises(false);
        }, []);

        const dateToShow = getDateNeededFormat(createdAt, DATE_FORMAT_TO_VIEW);

        return (
            <Card className='invites-list__item'>
                <Col className='invites-list__item_user'>
                    <Avatar
                        className='item__img'
                        shape='circle'
                        size={42}
                        src={from.imageSrc}
                        icon={<UserOutlined />}
                    />

                    <Paragraph className='item__name'>
                        {userName.length
                            ? userName.map((word) => <Paragraph key={word}>{word}</Paragraph>)
                            : 'Пользователь'}
                    </Paragraph>
                </Col>

                <Col className='invites-list__item_details'>
                    <Paragraph className='item__date'>{dateToShow}</Paragraph>

                    <Paragraph className='item__text'>
                        Привет, я ищу партнёра для совместных {training.name}. Ты хочешь
                        присоединиться ко мне на следующих тренировках?
                    </Paragraph>

                    <div className='modal-container' ref={refModalWrapper}>
                        <Button
                            disabled={disabled}
                            onClick={showExercisesTraining}
                            className='show-exercises'
                        >
                            Посмотреть детали тренировки
                        </Button>

                        {showTrainingExercises && (
                            <JoinTrainingsInvitesItemModal
                                isOpen={showTrainingExercises}
                                data={data}
                                refEl={refModalWrapper.current as HTMLElement}
                                closeCb={closeExercisesTraining}
                            />
                        )}
                    </div>
                </Col>

                <Col className='invites-list__item_buttons'>
                    <Button
                        disabled={disabled}
                        onClick={agreeTraining}
                        className='item__button agree-button'
                    >
                        Тренироваться вместе
                    </Button>

                    <Button
                        disabled={disabled}
                        onClick={rejectTraining}
                        className='item__button reject-button'
                    >
                        Отклонить запрос
                    </Button>
                </Col>
            </Card>
        );
    },
);
