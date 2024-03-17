import { memo, useEffect, useRef } from 'react';
import { Row } from 'antd';
import { TCalendarCellContent } from './types';

export const CalendarCell: React.FC<TCalendarCellContent> = memo(
    ({ addRefItemCB, date, children }) => {
        const cellRef = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            addRefItemCB(date, cellRef);
        }, [addRefItemCB, date]);

        return (
            <Row className='cell-content' ref={cellRef}>
                {children}
            </Row>
        );
    },
);
