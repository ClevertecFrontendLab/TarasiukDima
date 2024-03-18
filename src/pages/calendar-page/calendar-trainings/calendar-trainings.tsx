import { memo, useCallback, useMemo, useState } from 'react';
import { ConfigProvider } from 'antd';
import { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import { useIsMobile, useGetCurrentDayInfo, useAppSelector } from '@hooks/index';
import generateCalendar from 'antd/es/calendar/generateCalendar';
import locale from 'antd/es/locale/ru_RU';
import { compareDates, updatedNeededLengthValue } from '@utils/index';
import { CellModals } from './calendar-cell-modals';
import { CalendarCell } from './calendar-cell';
import { CalendarTrainingList } from './calendar-trainings-list';
import {
    TCalendarTrainingVariants,
    TCalendarTrainingListItem,
    TChangedTrainingState,
} from './types';

const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig);

export const CalendarTraining: React.FC<TCalendarTrainingVariants> = memo(
    ({ trainingVariants }) => {
        const [cellItems, setCellItems] = useState<{
            [key: string]: React.MutableRefObject<HTMLDivElement | null>;
        }>({});
        const { currentMonth, currentYear, getDateNeededFormat, currentDate } =
            useGetCurrentDayInfo();

        const isMobile = useIsMobile();
        const { personalTraining } = useAppSelector((state) => state.app);

        const [selectedDay, setSelectedDay] = useState(currentDate);
        const [selectedMonth, setSelectedMonth] = useState(updatedNeededLengthValue(currentMonth));
        const [selectedYear, setSelectedYear] = useState(updatedNeededLengthValue(currentYear));
        const [isSelected, setIsSelected] = useState<boolean>(false);

        const initialChangedState = useMemo(() => {
            const newState: TChangedTrainingState = {};
            personalTraining.forEach((item) => {
                const dateItem = getDateNeededFormat(item.date);

                if (!newState[dateItem]) {
                    newState[dateItem] = {};
                }

                newState[dateItem][item.name] = { ...item, isChanged: false };
            });

            return newState;
        }, [personalTraining, getDateNeededFormat]);

        const [changedPersonalTraining, setChangedPersonalTraining] =
            useState<TChangedTrainingState>(initialChangedState);
        const [isCellModalShow, setIsCellModalShow] = useState(false);

        const hideCellModal = useCallback(() => {
            setIsCellModalShow(false);
        }, []);

        const addRefCellItem = useCallback(
            (date: string, cell: React.MutableRefObject<HTMLDivElement | null>) => {
                setCellItems((prev) => ({
                    ...prev,
                    [date]: cell,
                }));
            },
            [],
        );

        const dateCellRender = useCallback(
            (date: Dayjs) => {
                const cellDay = getDateNeededFormat(date.toString());
                const addedTrainingNames: TCalendarTrainingListItem[] = [];

                if (changedPersonalTraining[cellDay]) {
                    let index = 0;
                    for (const training in changedPersonalTraining[cellDay]) {
                        addedTrainingNames.push({
                            name: changedPersonalTraining[cellDay][training].name,
                            index: index,
                            isFinished: changedPersonalTraining[cellDay][training].isImplementation,
                        });
                        index++;
                    }
                }

                return (
                    <CalendarCell addRefItemCB={addRefCellItem} date={cellDay}>
                        {Boolean(addedTrainingNames.length) && (
                            <CalendarTrainingList
                                items={addedTrainingNames}
                                className='cell-content__training'
                            />
                        )}
                    </CalendarCell>
                );
            },
            [getDateNeededFormat, addRefCellItem, changedPersonalTraining],
        );

        const onSelect = useCallback(
            (date: Dayjs) => {
                if (!isSelected) {
                    setIsSelected(true);
                }

                setSelectedDay(getDateNeededFormat(date));

                let withoutModal = false;
                const clickYear = getDateNeededFormat(date, 'Y');
                if (clickYear !== selectedYear) {
                    setSelectedYear(clickYear);
                    withoutModal = true;
                }

                const clickMonth = getDateNeededFormat(date, 'MM');
                if (clickMonth !== selectedMonth) {
                    setSelectedMonth(clickMonth);
                    withoutModal = true;
                }

                if (isMobile && withoutModal) {
                    setIsCellModalShow(false);
                    return;
                }

                setIsCellModalShow(true);
            },
            [selectedMonth, selectedYear, isMobile, isSelected, getDateNeededFormat],
        );

        return (
            <ConfigProvider locale={locale}>
                <Calendar
                    fullscreen={!isMobile}
                    onSelect={onSelect}
                    dateCellRender={dateCellRender}
                    className='training-calendar'
                />

                {isCellModalShow && (
                    <CellModals
                        curRef={cellItems[selectedDay]}
                        curDay={selectedDay}
                        trainingVariants={trainingVariants}
                        isFutureDay={compareDates(currentDate, selectedDay) === 1}
                        dayChangedInfo={changedPersonalTraining[selectedDay]}
                        setChangedPersonalTraining={setChangedPersonalTraining}
                        closeModalCb={hideCellModal}
                    />
                )}
            </ConfigProvider>
        );
    },
);
