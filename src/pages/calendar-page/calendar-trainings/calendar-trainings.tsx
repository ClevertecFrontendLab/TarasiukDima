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
import { CellModals } from './calendar-cell-modals';
import { CalendarCell } from './calendar-cell';
import { CalendarTrainingList } from './calendar-trainings-list';
import {
    TCalendarTrainingVariants,
    TCalendarTrainingListItem,
    TChangedTrainingState,
} from './types';

dayjs.locale('ru', localeRu);
const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig);

export const CalendarTraining: React.FC<TCalendarTrainingVariants> = memo(
    ({ trainingVariants }) => {
        const [cellItems, setCellItems] = useState<{
            [key: string]: React.MutableRefObject<HTMLDivElement | null>;
        }>({});
        const { getTimeFormatData, currentMonth, currentYear } = useGetCurrentDayInfo();
        const currentDate = getTimeFormatData(DATE_FORMAT);
        const isMobile = useIsMobile();
        const { personalTraining } = useAppSelector((state) => state.app);

        const [selectedDay, setSelectedDay] = useState(currentDate);
        const [selectedMonth, setSelectedMonth] = useState(updatedNeededLengthValue(currentMonth));
        const [selectedYear, setSelectedYear] = useState(updatedNeededLengthValue(currentYear));
        const [isSelected, setIsSelected] = useState<boolean>(false);

        const [changedPersonalTraining, setChangedPersonalTraining] =
            useState<TChangedTrainingState>({});
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
                const cellDay = date.format(DATE_FORMAT);
                const addedTrainingNames: TCalendarTrainingListItem[] = [];

                if (changedPersonalTraining[cellDay]) {
                    let index = 0;
                    for (const training in changedPersonalTraining[cellDay]) {
                        addedTrainingNames.push({
                            name: changedPersonalTraining[cellDay][training].name,
                            disabled: false,
                            index: index,
                        });
                        index++;
                    }
                } else {
                    personalTraining.filter((item, index) => {
                        if (dayjs(item.date).format(DATE_FORMAT) === cellDay) {
                            addedTrainingNames.push({
                                name: item.name,
                                disabled: false,
                                index: index,
                            });
                        }
                    });
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
            [addRefCellItem, changedPersonalTraining, personalTraining],
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

                if (isMobile && withoutModal) {
                    setIsCellModalShow(false);
                    return;
                }

                setIsCellModalShow(true);
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
