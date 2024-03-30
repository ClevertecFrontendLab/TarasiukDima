/* eslint-disable import/no-extraneous-dependencies */
import { memo, useCallback, useMemo, useState } from 'react';
import { useAppSelector, useGetCurrentDayInfo, useIsMobile } from '@hooks/index';
import { compareDates, updatedNeededLengthValue } from '@utils/index';
import { ConfigProvider } from 'antd';
import generateCalendar from 'antd/es/calendar/generateCalendar';
import locale from 'antd/es/locale/ru_RU';
import { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';

import { CalendarCell } from './calendar-cell';
import { CellModals } from './calendar-cell-modals';
import { CalendarTrainingList } from './calendar-trainings-list';
import {
    TCalendarTrainingListItem,
    TCalendarTrainingVariants,
    TChangedTrainingState,
} from './types';

const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig);

export const CalendarTraining: React.FC<TCalendarTrainingVariants> = memo(
    ({ trainingVariants, showErrorModalCb }) => {
        const isMobile = useIsMobile();
        const { personalTraining } = useAppSelector((state) => state.app);
        const { currentMonth, currentYear, getDateNeededFormat, currentDate } =
            useGetCurrentDayInfo();

        const [cellItems, setCellItems] = useState<{
            [key: string]: React.MutableRefObject<HTMLDivElement | null>;
        }>({});

        const [changedPersonalTraining, setChangedPersonalTraining] =
            useState<TChangedTrainingState>({});

        const [selectedDay, setSelectedDay] = useState(currentDate);
        const [selectedMonth, setSelectedMonth] = useState(updatedNeededLengthValue(currentMonth));
        const [selectedYear, setSelectedYear] = useState(updatedNeededLengthValue(currentYear));

        const dataForShow = useMemo(() => {
            const data: TChangedTrainingState = {};
            const arrayWithData = trainingVariants.length ? personalTraining : [];

            arrayWithData.forEach((item) => {
                const dateItem = getDateNeededFormat(item.date);

                if (!data[dateItem]) {
                    data[dateItem] = {};
                }

                data[dateItem][item.name] = item;
            });

            Object.keys(changedPersonalTraining).forEach((dayKey) => {
                Object.keys(changedPersonalTraining[dayKey]).forEach((trainingName) => {
                    if (!data[dayKey]) {
                        data[dayKey] = {};
                    }
                    data[dayKey][trainingName] = changedPersonalTraining[dayKey][trainingName];
                });
            });

            return data;
        }, [personalTraining, getDateNeededFormat, changedPersonalTraining, trainingVariants]);

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

                if (dataForShow[cellDay]) {
                    Object.keys(dataForShow[cellDay]).forEach((training, index) => {
                        addedTrainingNames.push({
                            name: dataForShow[cellDay][training].name,
                            index,
                            isFinished: dataForShow[cellDay][training].isImplementation,
                        });
                    });
                }

                const trainingInDayExist = Boolean(addedTrainingNames.length);

                return (
                    <CalendarCell
                        addRefItemCB={addRefCellItem}
                        date={cellDay}
                        className={isMobile && trainingInDayExist ? 'is-mobile' : ''}
                    >
                        {!isMobile && trainingInDayExist && (
                            <CalendarTrainingList
                                items={addedTrainingNames}
                                className='cell-content__training'
                            />
                        )}
                    </CalendarCell>
                );
            },
            [getDateNeededFormat, addRefCellItem, dataForShow, isMobile],
        );

        const onSelect = useCallback(
            (date: Dayjs) => {
                setSelectedDay(getDateNeededFormat(date));

                let withoutModal = false;
                const clickYear = getDateNeededFormat(date, 'YYYY');

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
            [selectedMonth, selectedYear, isMobile, getDateNeededFormat],
        );

        return (
            <ConfigProvider locale={locale}>
                <Calendar
                    fullscreen={!isMobile}
                    onSelect={onSelect}
                    dateCellRender={dateCellRender}
                    className='training-calendar'
                />

                {Boolean(trainingVariants.length) && isCellModalShow && (
                    <CellModals
                        isShow={isCellModalShow}
                        curRef={cellItems[selectedDay]}
                        curDay={selectedDay}
                        trainingVariants={trainingVariants}
                        isFutureDay={compareDates(currentDate, selectedDay) === 1}
                        dayChangedInfo={changedPersonalTraining[selectedDay]}
                        dayFullInfo={dataForShow[selectedDay]}
                        setChangedPersonalTraining={setChangedPersonalTraining}
                        closeModalCb={hideCellModal}
                        showModalErrorCb={showErrorModalCb}
                    />
                )}
            </ConfigProvider>
        );
    },
);
