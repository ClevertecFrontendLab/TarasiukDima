import { createContext, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch } from '@hooks/index';
import { useAddTrainingMutation, useUpdateTrainingMutation } from '@services/index';
import { Modal, Row } from 'antd';
import { changeShowLoader } from '@redux/index';
import { CalendarTrainingList } from './calendar-trainings-list';
import { CellTrainingDayModal } from './calendar-trainings-day-modal';
import { CellAddTrainingModal } from './calendar-trainings-add-training-modal';
import { CellAddExercisesModal } from './calendar-trainings-add-exercises-modal';
import { DATE_FORMAT_TO_VIEW } from '@constants/index';
import { TTrainingExercise, TTrainingRequired, TTrainingVariants } from '@app_types/index';
import { TCalendarCellContentProps, TCellTrainingsData, TVariantChosenItem } from './types';
import { Dayjs } from 'dayjs';

const ModalErrorOptions = {
    centered: true,
    closable: true,
    title: 'При сохранении данных произошла ошибка',
    content: 'Придётся попробовать ещё раз',
    okText: 'Закрыть',
    okButtonProps: {
        className: 'right-btn',
    },
    className: 'modal-page',
};

export type TCellDayContext = {
    dayData: TCellTrainingsData;
    date: Dayjs;
    trainingVariants: TTrainingVariants;
    isFutureDay: boolean;
    isEdit: boolean;
    chosenVariantTraining: TVariantChosenItem;
    changeTrainingVariantCb: (variant: TVariantChosenItem) => void;
};
export const CellDayContext = createContext<TCellDayContext | null>(null);

export const CalendarCellContent: React.FC<TCalendarCellContentProps> = memo(
    ({ date, trainingVariants, dayInfo = {}, isFutureDay, isSelectedDay }) => {
        const cellRef = useRef<HTMLDivElement>(null);
        const dispatch = useAppDispatch();

        const [showModalTraining, setShowModalTraining] = useState<boolean>(isSelectedDay);
        const [showModalAddNew, setShowModalAddNew] = useState<boolean>(false);
        const [isEdit, setIsEdit] = useState<boolean>(false);

        const [showExercisesModal, setShowExercisesModal] = useState<boolean>(false);
        const [isExercisesChanged, setIsExercisesChanged] = useState<boolean>(false);
        const [countExercisesShow, setCountExercisesShow] = useState(1);

        const [dayData, setDayData] = useState<TCellTrainingsData>(dayInfo);
        const [chosenVariantTraining, setChosenVariantTraining] =
            useState<TVariantChosenItem>(null);

        const dateItemToView = date.format(DATE_FORMAT_TO_VIEW);
        const addedTrainingNames = Object.keys(dayInfo);
        const addNewItemBtnDisabled =
            !isFutureDay || trainingVariants.length === addedTrainingNames.length;
        // eslint-disable-next-line no-extra-boolean-cast
        const isEmptyDay = !Boolean(addedTrainingNames.length);

        const [
            updateTraining,
            {
                isError: isUpdateTrainingError,
                isSuccess: isUpdateTrainingSuccess,
                isLoading: isUpdateTrainingLoading,
            },
        ] = useUpdateTrainingMutation();

        const [
            addTraining,
            {
                isError: isAddTrainingError,
                isSuccess: isAddTrainingSuccess,
                isLoading: isAddTrainingLoading,
            },
        ] = useAddTrainingMutation();

        useEffect(() => {
            if (isAddTrainingError) {
                Modal.error(ModalErrorOptions);
            }
        }, [isAddTrainingError]);

        useEffect(() => {
            if (isAddTrainingSuccess) {
                dispatch(changeShowLoader(false));
            }
        }, [isAddTrainingSuccess, dispatch]);

        useEffect(() => {
            if (isAddTrainingLoading) {
                dispatch(changeShowLoader(true));
            }
        }, [isAddTrainingLoading, dispatch]);

        useEffect(() => {
            if (isUpdateTrainingError) {
                Modal.error(ModalErrorOptions);
            }
        }, [isUpdateTrainingError]);

        useEffect(() => {
            if (isUpdateTrainingSuccess) {
                dispatch(changeShowLoader(false));
            }
        }, [isUpdateTrainingSuccess, dispatch]);

        useEffect(() => {
            if (isUpdateTrainingLoading) {
                dispatch(changeShowLoader(true));
            }
        }, [isUpdateTrainingLoading, dispatch]);

        useEffect(() => {
            if (showModalAddNew && !isSelectedDay) {
                setShowModalAddNew(false);
            }
        }, [isSelectedDay, showModalAddNew]);

        const updateExercisesInfo = useCallback(
            (ind: number, excInfo: TTrainingExercise) => {
                if (!chosenVariantTraining && excInfo.name) return;
                const nameTraining = chosenVariantTraining as keyof TTrainingRequired;

                setDayData((prev) => {
                    const newData = {
                        ...prev,
                    };

                    const prevExercises = prev[nameTraining]?.exercises || [];
                    const isNewItem = prev[nameTraining] ? prev[nameTraining].isNew : true;

                    newData[nameTraining] = {
                        ...prev[nameTraining],
                        name: nameTraining,
                        date: date.toISOString(),
                        exercises: prevExercises,
                        isNew: isNewItem,
                        isChanged: true,
                    };

                    newData[nameTraining].exercises[ind] = excInfo;

                    return newData;
                });

                setIsExercisesChanged(true);
            },
            [date, chosenVariantTraining],
        );

        const saveExercises = useCallback(() => {
            for (const key in dayData) {
                const body = dayData[key];

                if (body.id) {
                    updateTraining({ body, trainingId: body.id });
                } else {
                    addTraining(body);
                }
            }

            setIsExercisesChanged(false);
        }, [addTraining, updateTraining, dayData]);

        const changeChosenNameTrainingHandler = useCallback((variant: TVariantChosenItem) => {
            console.log('variant', variant);
            setChosenVariantTraining(variant);
        }, []);

        const showDayInfoModalHandler = useCallback(() => {
            setShowModalTraining(true);
        }, []);

        const closeDayInfoModalHandler = useCallback(() => {
            setShowModalTraining(false);
        }, []);

        const showAddNewTrainingModalHandler = useCallback(() => {
            setIsEdit(false);
            setChosenVariantTraining(null);
            setShowModalTraining(false);
            setShowModalAddNew(true);
        }, []);

        const closeAddNewTrainingModalHandler = useCallback(() => {
            setShowModalAddNew(false);
            setShowModalTraining(true);
        }, []);

        const showEditTrainingDataModalHandler = useCallback((trainingName: string) => {
            setIsEdit(true);
            setChosenVariantTraining(trainingName as keyof TTrainingRequired);
            setShowModalTraining(false);
            setShowModalAddNew(true);
        }, []);

        const showAddExercisesModalHandler = useCallback(() => {
            setShowModalAddNew(false);
            setShowExercisesModal(true);
        }, []);

        const closeAddExercisesModalHandler = useCallback(() => {
            setShowExercisesModal(false);
            setShowModalAddNew(true);
        }, []);

        const addNewExercisesForm = useCallback(() => {
            setCountExercisesShow((prev) => prev + 1);
        }, []);

        const cellDayContextValue = useMemo(
            () => ({
                dayData,
                date,
                trainingVariants,
                isFutureDay,
                isEdit,
                chosenVariantTraining,

                changeTrainingVariantCb: changeChosenNameTrainingHandler,
            }),
            [
                trainingVariants,
                dayData,
                date,
                isFutureDay,
                isEdit,
                chosenVariantTraining,
                changeChosenNameTrainingHandler,
            ],
        );

        return (
            <Row className='cell-content' ref={cellRef}>
                <button
                    className='cell-content__training_btn'
                    onClick={showDayInfoModalHandler}
                    aria-label={`Показать модальное окно для даты - ${dateItemToView}`}
                />

                {!isEmptyDay && (
                    <CalendarTrainingList
                        items={addedTrainingNames.map((trainingName, index) => ({
                            name: trainingName,
                            disabled: false,
                            index: index,
                        }))}
                        className='cell-content__training'
                    />
                )}

                <CellDayContext.Provider value={cellDayContextValue}>
                    <CellTrainingDayModal
                        isShow={showModalTraining && isSelectedDay}
                        isEmptyDay={isEmptyDay}
                        refEl={cellRef.current as HTMLElement}
                        date={dateItemToView}
                        addNewDisabled={addNewItemBtnDisabled}
                        closeCb={closeDayInfoModalHandler}
                        addNewTrainingCb={showAddNewTrainingModalHandler}
                        editTrainingCb={showEditTrainingDataModalHandler}
                    />

                    <CellAddTrainingModal
                        isShow={showModalAddNew}
                        isLoading={isAddTrainingLoading || isUpdateTrainingLoading}
                        refEl={cellRef.current as HTMLElement}
                        isCanSaveExercises={!isExercisesChanged}
                        closeCb={closeAddNewTrainingModalHandler}
                        saveExercisesCb={saveExercises}
                        showAddExercisesCb={showAddExercisesModalHandler}
                    />

                    <CellAddExercisesModal
                        isShow={showExercisesModal}
                        countExercisesForm={countExercisesShow}
                        trainingName={(chosenVariantTraining as string) || ''}
                        closeAddExercises={closeAddExercisesModalHandler}
                        addNewExerciseCb={addNewExercisesForm}
                        changeExercisesInfoCB={updateExercisesInfo}
                    />
                </CellDayContext.Provider>
            </Row>
        );
    },
);
