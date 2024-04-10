/* eslint-disable import/no-extraneous-dependencies */
import { FC, ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import generateCalendar from 'antd/es/calendar/generateCalendar';
import locale from 'antd/es/locale/ru_RU';
import { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';

const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig);

type TCalendarTrainingsProps = {
    fullscreen: boolean;
    onSelect: (date: Dayjs) => void;
    // disabledBeforeCurrentDay?: boolean;
    dateCellRender: (date: Dayjs) => ReactNode;
    subContent?: ReactNode;
    className?: string;
};
export const CalendarTrainings: FC<TCalendarTrainingsProps> = ({
    fullscreen,
    onSelect,
    // disabledBeforeCurrentDay = false,
    className = 'training-calendar',
    dateCellRender,
    subContent,
}) => (
    <ConfigProvider locale={locale}>
        <Calendar
            fullscreen={fullscreen}
            onSelect={onSelect}
            dateCellRender={dateCellRender}
            className={className}
        />

        {subContent}
    </ConfigProvider>
);
