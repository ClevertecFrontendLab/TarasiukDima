import { memo } from 'react';
import { EditFilled, EditOutlined } from '@ant-design/icons';
import { Badge, Button, List, Row } from 'antd';
import { getTrainingBadgeStatusColor } from '@utils/index';
import { TRAININGS_IDS } from '@constants/index';
import { TCalendarTrainingListProps } from './types';

export const CalendarTrainingList: React.FC<TCalendarTrainingListProps> = memo(
    ({ items, needButtonEdit = false, editButtonCb, className = '' }) => (
        <List
            className={className}
            dataSource={items}
            renderItem={({ name, isFinished, index }) => (
                <li key={name + index}>
                    <Row
                        align='middle'
                        justify='space-between'
                        className={isFinished ? 'isFinished' : ''}
                    >
                        <Badge color={getTrainingBadgeStatusColor(name)} text={name} />

                        {needButtonEdit && (
                            <Button
                                className='edit-training'
                                data-test-id={TRAININGS_IDS.modalTrainingEditBtn + index}
                                onClick={() => {
                                    editButtonCb && editButtonCb(name, isFinished);
                                }}
                                aria-label={`Редактировать тренировку - '${name}'`}
                                disabled={isFinished}
                            >
                                {isFinished ? <EditFilled /> : <EditOutlined />}
                            </Button>
                        )}
                    </Row>
                </li>
            )}
        />
    ),
);
