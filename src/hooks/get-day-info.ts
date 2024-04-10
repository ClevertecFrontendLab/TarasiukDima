/* eslint-disable import/no-extraneous-dependencies */
import { useCallback } from 'react';
import { DATE_FORMAT } from '@constants/date';
import dayjs, { Dayjs } from 'dayjs';
import localeRu from 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.locale('ru', localeRu);

export const useDayInfo = () => {
    const now = dayjs().local();
    const currentYear = now.year();
    const currentMonth = now.month() + 1;
    const currentDay = now.date();

    const getDateNeededFormat = useCallback(
        (date: string | Dayjs | null = null, dateFormat = DATE_FORMAT) => {
            if (date) {
                return dayjs(date).local().format(dateFormat);
            }

            return now.format(dateFormat);
        },
        [now],
    );

    const getDateForSave = useCallback(
        (date: string | Dayjs | null = null) => dayjs(date).utcOffset(0, true).format(),
        [],
    );

    const getDayJsItem = useCallback((date: string | Dayjs | null = null) => dayjs(date), []);

    const currentDate = getDateNeededFormat();

    return {
        currentYear,
        currentMonth,
        currentDay,
        currentDate,
        getDateNeededFormat,
        getDateForSave,
        getDayJsItem,
    };
};
