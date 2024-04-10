/* eslint-disable import/no-extraneous-dependencies */
import { memo, useCallback, useState } from 'react';
import { TTrainingListViewItem } from '@app-types/index';
import { CalendarTrainings, TrainingList } from '@components/index';
import { useDayInfo, useGetChangedTrainingsState, useIsMobile } from '@hooks/index';
import { updatedNeededLengthValue } from '@utils/index';
import { Dayjs } from 'dayjs';

import { CalendarCell } from './calendar-cell';
import { CellModals } from './calendar-cell-modals';
import { TCalendarTrainingVariants } from './types';

export const CalendarTraining: React.FC<TCalendarTrainingVariants> = memo(
    ({ trainingVariants, showErrorModalCb }) => {
        const isMobile = useIsMobile();
        const { currentMonth, currentYear, getDateNeededFormat } = useDayInfo();
        const {
            isFutureDay,
            isEdit,
            changeIsEditTraining,
            selectedDay,
            changeSelectCurrentDay,
            saveTrainingExercises,
            trainingsDataForShow,
            trainingDayFullInfo,
            trainingDayChangedInfo,
            trainingDaySavedData,
            chosenVariantTraining,
            changeChosenNameTrainingCb,
            trainingDayToShow,
            updateChangedTrainingInfoExercises,
            editTrainingButtonCB,

            isUpdateTrainingError,
            isUpdateTrainingSuccess,
            isUpdateTrainingLoading,
            isAddTrainingError,
            isAddTrainingSuccess,
            isAddTrainingLoading,
        } = useGetChangedTrainingsState(trainingVariants);

        const [cellItems, setCellItems] = useState<{
            [key: string]: React.MutableRefObject<HTMLDivElement | null>;
        }>({});
        const [selectedMonth, setSelectedMonth] = useState(updatedNeededLengthValue(currentMonth));
        const [selectedYear, setSelectedYear] = useState(updatedNeededLengthValue(currentYear));
        const [isCellModalShow, setIsCellModalShow] = useState(false);

        const hideCellModal = useCallback(() => {
            setIsCellModalShow(false);
            changeChosenNameTrainingCb(null);
            changeIsEditTraining(false);
        }, [changeIsEditTraining, changeChosenNameTrainingCb]);

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
                const addedTrainingNames: TTrainingListViewItem[] = [];

                if (trainingsDataForShow[cellDay]) {
                    Object.keys(trainingsDataForShow[cellDay]).forEach((training, index) => {
                        addedTrainingNames.push({
                            name: trainingsDataForShow[cellDay][training].name,
                            index,
                            isFinished: trainingsDataForShow[cellDay][training].isImplementation,
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
                            <TrainingList
                                items={addedTrainingNames}
                                className='cell-content__training'
                            />
                        )}
                    </CalendarCell>
                );
            },
            [getDateNeededFormat, addRefCellItem, trainingsDataForShow, isMobile],
        );

        const onSelect = useCallback(
            (date: Dayjs) => {
                changeSelectCurrentDay(date);

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
            [selectedMonth, changeSelectCurrentDay, selectedYear, isMobile, getDateNeededFormat],
        );

        return (
            <CalendarTrainings
                fullscreen={!isMobile}
                onSelect={onSelect}
                dateCellRender={dateCellRender}
                className='training-calendar'
                subContent={
                    Boolean(trainingVariants.length) && isCellModalShow ? (
                        <CellModals
                            isEdit={isEdit}
                            changeIsEditTraining={changeIsEditTraining}
                            saveTrainingExercises={saveTrainingExercises}
                            changeChosenNameTrainingCb={changeChosenNameTrainingCb}
                            isShow={isCellModalShow}
                            curRef={cellItems[selectedDay]}
                            curDay={selectedDay}
                            trainingVariants={trainingVariants}
                            isFutureDay={isFutureDay}
                            dayChangedInfo={trainingDayChangedInfo}
                            dayFullInfo={trainingDayFullInfo}
                            trainingDaySavedData={trainingDaySavedData}
                            closeModalCb={hideCellModal}
                            chosenVariantTraining={chosenVariantTraining}
                            showModalErrorCb={showErrorModalCb}
                            trainingDayToShow={trainingDayToShow}
                            updateChangedTrainingInfoExercises={updateChangedTrainingInfoExercises}
                            editTrainingButtonCB={editTrainingButtonCB}
                            isUpdateTrainingError={isUpdateTrainingError}
                            isUpdateTrainingSuccess={isUpdateTrainingSuccess}
                            isUpdateTrainingLoading={isUpdateTrainingLoading}
                            isAddTrainingError={isAddTrainingError}
                            isAddTrainingSuccess={isAddTrainingSuccess}
                            isAddTrainingLoading={isAddTrainingLoading}
                        />
                    ) : null
                }
            />
        );
    },
);
