import { FC, memo } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { TSimpleFn, TTrainingInviteItem } from '@app-types/index';
import { DATE_FORMAT_TO_VIEW } from '@constants/index';
import { useDayInfo } from '@hooks/index';
import { getTrainingBadgeStatusColor, getTrainingPeriodText } from '@utils/index';
import { Badge, Modal, Row } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';

type TJoinTrainingsInvitesItemModalProps = {
    data: TTrainingInviteItem;
    isOpen: boolean;
    closeCb: TSimpleFn;
    refEl: HTMLElement;
};

export const JoinTrainingsInvitesItemModal: FC<TJoinTrainingsInvitesItemModalProps> = memo(
    ({ data, closeCb, refEl, isOpen }) => {
        const { getDateNeededFormat } = useDayInfo();
        const { training } = data;

        return (
            <Modal
                transitionName=''
                maskTransitionName=''
                maskStyle={{
                    backgroundColor: 'transparent',
                }}
                destroyOnClose={true}
                data-test-id=''
                className='invite-training-modal'
                open={isOpen}
                closable={true}
                closeIcon={<CloseOutlined />}
                getContainer={refEl}
                centered={false}
                onCancel={closeCb}
                title={
                    <Badge
                        color={getTrainingBadgeStatusColor(training.name)}
                        text={training.name}
                    />
                }
                footer={null}
            >
                <Row className='invite-training-modal__row' justify='space-between'>
                    <Paragraph className='modal-period'>
                        {training.parameters?.period &&
                            getTrainingPeriodText(training.parameters?.period)}
                    </Paragraph>
                    <Paragraph className='modal-date'>
                        {getDateNeededFormat(training.date, DATE_FORMAT_TO_VIEW)}
                    </Paragraph>
                </Row>

                {training.exercises.map((exercise) => (
                    <Row
                        className='invite-training-modal__row'
                        justify='space-between'
                        key={exercise.name}
                    >
                        <Paragraph className='modal-exercise'>{exercise.name}</Paragraph>
                        <Paragraph className='modal-replays'>{`${exercise.approaches} x (${exercise.weight} кг)`}</Paragraph>
                    </Row>
                ))}
            </Modal>
        );
    },
);
