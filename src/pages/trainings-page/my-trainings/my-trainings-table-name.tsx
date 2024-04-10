import React, { FC, useEffect, useRef } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { getTrainingBadgeStatusColor } from '@utils/index';
import { Badge, Button, Row } from 'antd';

type TMyTrainingsTableRowNameProps = {
    name: string;
    date: string;
    showDayModalCb: (name: string, date: string) => void;
    changeTableRowRefItems: (
        rowRef: React.MutableRefObject<HTMLDivElement | null>,
        date: string,
    ) => void;
};

export const MyTrainingsTableRowName: FC<TMyTrainingsTableRowNameProps> = ({
    name,
    date,
    showDayModalCb,
    changeTableRowRefItems,
}) => {
    const rowRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        changeTableRowRefItems(rowRef, date);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Row justify='space-between' align='middle' ref={rowRef}>
            <Badge color={getTrainingBadgeStatusColor(name)} text={name} />

            <Button
                className='down-btn'
                data-test-id=''
                onClick={() => {
                    showDayModalCb(name, date);
                }}
                aria-label={`Показать упражнения для тренировки - '${name}'`}
            >
                <DownOutlined />
            </Button>
        </Row>
    );
};
