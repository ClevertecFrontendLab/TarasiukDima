import { memo, useCallback, useState } from 'react';
import { ConfigProvider } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import { useIsMobile, useGetCurrentDayInfo, useAppSelector } from '@hooks/index';
import generateCalendar from 'antd/es/calendar/generateCalendar';
import locale from 'antd/es/locale/ru_RU';
import localeRu from 'dayjs/locale/ru';
import { DATE_FORMAT } from '@constants/index';
import { compareDates, updatedNeededLengthValue } from '@utils/index';
import { TCalendarTrainingVariants, TCellTrainingsData } from './types';
import { CalendarCellContent } from './calendar-trainings-cell';

dayjs.locale('ru', localeRu);
const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig);

export const CalendarTraining: React.FC<TCalendarTrainingVariants> = memo(
    ({ trainingVariants }) => {
        const { personalTraining } = useAppSelector((state) => state.app);
        const isMobile = useIsMobile();
        const { getTimeFormatData, currentMonth, currentYear } = useGetCurrentDayInfo();
        const currentDate = getTimeFormatData(DATE_FORMAT);

        const [selectedDay, setSelectedDay] = useState(currentDate);
        const [selectedMonth, setSelectedMonth] = useState(updatedNeededLengthValue(currentMonth));
        const [selectedYear, setSelectedYear] = useState(updatedNeededLengthValue(currentYear));
        const [isSelected, setIsSelected] = useState<boolean>(false);

        const dateCellRender = useCallback(
            (date: Dayjs) => {
                const cellDay = date.format(DATE_FORMAT);
                const trainingDayInfo =
                    personalTraining.filter(
                        (dayTraining) => dayjs(dayTraining.date).format(DATE_FORMAT) === cellDay,
                    ) || [];

                const startObjDayData: TCellTrainingsData = {};
                trainingDayInfo.forEach((item) => {
                    startObjDayData[item.name] = {
                        ...item,
                        isChanged: false,
                        isNew: false,
                        needRemove: false,
                    };
                });

                return (
                    <CalendarCellContent
                        date={date}
                        trainingVariants={trainingVariants}
                        dayInfo={startObjDayData}
                        isSelectedDay={isSelected && cellDay === selectedDay}
                        isFutureDay={compareDates(currentDate, cellDay) === 1}
                    />
                );
            },
            [trainingVariants, personalTraining, currentDate, selectedDay, isSelected],
        );

        const onSelect = useCallback(
            (date: Dayjs) => {
                if (!isSelected) {
                    setIsSelected(true);
                }

                setSelectedDay(date.format(DATE_FORMAT));

                let withoutModal = false;
                const clickYear = date.format('Y');
                if (clickYear !== selectedYear) {
                    setSelectedYear(clickYear);
                    withoutModal = true;
                }

                const clickMonth = date.format('MM');
                if (clickMonth !== selectedMonth) {
                    setSelectedMonth(clickMonth);
                    withoutModal = true;
                }

                if (isMobile && withoutModal) return;

                console.log('onSelect', date.format(DATE_FORMAT));
            },
            [selectedMonth, selectedYear, isMobile, isSelected],
        );

        return (
            <ConfigProvider locale={locale}>
                <Calendar
                    fullscreen={!isMobile}
                    onSelect={onSelect}
                    dateCellRender={dateCellRender}
                    className='training-calendar'
                />
            </ConfigProvider>
        );
    },
);
