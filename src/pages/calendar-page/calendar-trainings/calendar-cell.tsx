import { memo, useEffect, useRef } from 'react';
import { Row } from 'antd';
import classNames from 'classnames';

import { TCalendarCellContent } from './types';

export const CalendarCell: React.FC<TCalendarCellContent> = memo(
    ({ addRefItemCB, date, children, className = '' }) => {
        const cellRef = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            addRefItemCB(date, cellRef);
        }, [addRefItemCB, date]);

        return (
            <Row
                className={classNames('cell-content', {
                    [className]: className,
                })}
                ref={cellRef}
            >
                {children}
            </Row>
        );
    },
);
