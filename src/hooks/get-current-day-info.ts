import dayjs from 'dayjs';
import { getTimeInNeededFormat } from '@utils/date';

export const useGetCurrentDayInfo = () => {
    const now = dayjs();
    const currentYear = now.year();
    const currentMonth = now.month() + 1;
    const currentDay = now.date();

    const getTimeFormatData = (format: string) =>
        getTimeInNeededFormat({
            format,
            year: currentYear.toString(),
            month: currentMonth.toString(),
            day: currentDay.toString(),
        });

    return {
        currentYear,
        currentMonth,
        currentDay,
        getTimeFormatData,
    };
};
