import dayjs, { Dayjs } from 'dayjs';
import localeRu from 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import { DATE_FORMAT } from '@constants/date';

dayjs.extend(isLeapYear);
dayjs.extend(utc);
dayjs.locale('ru', localeRu);

export const useGetCurrentDayInfo = () => {
    const now = dayjs().local();
    const currentYear = now.year();
    const currentMonth = now.month() + 1;
    const currentDay = now.date();

    const getDateNeededFormat = (date: string | Dayjs | null = null, dateFormat = DATE_FORMAT) => {
        if (date) {
            return dayjs(date).local().format(dateFormat);
        }
        return now.format(dateFormat);
    };

    const getDateForSave = (date: string | Dayjs | null = null) => {
        return dayjs(date).local().format();
    };

    const currentDate = getDateNeededFormat();

    return {
        currentYear,
        currentMonth,
        currentDay,
        currentDate,
        getDateNeededFormat,
        getDateForSave,
    };
};
