import { memo } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Badge, Button, List, Row } from 'antd';
import { getTrainingBadgeStatusColor } from '@utils/index';
import { TTrainingEditButtonCb } from './types';

export type TCalendarTrainingListItem = {
    name: string;
    disabled: boolean;
    index: number;
};

type TCalendarTrainingListProps = {
    items: TCalendarTrainingListItem[];
    className?: string;
    needButtonEdit?: boolean;
    editButtonCb?: TTrainingEditButtonCb;
};

export const CalendarTrainingList: React.FC<TCalendarTrainingListProps> = memo(
    ({ items, needButtonEdit = false, editButtonCb, className = '' }) => (
        <List
            className={className}
            dataSource={items}
            renderItem={(item) => (
                <li key={item.name}>
                    <Row align='middle' justify='space-between'>
                        <Badge color={getTrainingBadgeStatusColor(item.name)} text={item.name} />

                        {needButtonEdit && (
                            <Button
                                className='edit-training'
                                data-test-id={`modal-update-training-edit-button${item.index}`}
                                disabled={item.disabled}
                                onClick={() => {
                                    editButtonCb && editButtonCb(item.name);
                                }}
                                aria-label={`Редактировать тренировку - '${item.name}'`}
                            >
                                <EditOutlined />
                            </Button>
                        )}
                    </Row>
                </li>
            )}
        />
    ),
);
