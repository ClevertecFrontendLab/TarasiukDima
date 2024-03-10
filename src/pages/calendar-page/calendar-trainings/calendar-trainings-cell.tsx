import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useGetPersonalTrainings } from '@hooks/index';
import { CellDayContext } from './calendar-cell-context';
import { useAddTrainingMutation, useUpdateTrainingMutation } from '@services/index';
import { Modal, Row } from 'antd';
import { changeShowLoader } from '@redux/index';
import { CalendarTrainingList } from './calendar-trainings-list';
import { CellTrainingDayModal } from './calendar-trainings-day-modal';
import { CellAddTrainingModal } from './calendar-trainings-add-training-modal';
import { CellAddExercisesModal } from './calendar-trainings-add-exercises-modal';
import { DATE_FORMAT_TO_VIEW } from '@constants/index';
import { TTraining, TTrainingBody, TTrainingExercise, TTrainingRequired } from '@app_types/index';
import {
    TCalendarCellContentProps,
    TCellTrainingsData,
    TExerciseInfo,
    TTrainingCellDataExercise,
    TVariantChosenItem,
} from './types';

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

export const CalendarCellContent: React.FC<TCalendarCellContentProps> = memo(
    ({ date, trainingVariants, dayInfo = {}, isFutureDay, isSelectedDay }) => {
        const cellRef = useRef<HTMLDivElement>(null);
        const dispatch = useAppDispatch();
        const { getPersonalTrainings } = useGetPersonalTrainings();

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

                setShowModalAddNew(false);
                setShowExercisesModal(false);
                setShowModalTraining(false);
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
            (ind: number, excInfo: TExerciseInfo) => {
                if (!chosenVariantTraining && excInfo.name) return;
                const nameTraining = chosenVariantTraining as keyof TTrainingRequired;

                setDayData((prev) => {
                    const newData = {
                        ...prev,
                    };

                    let prevExercises: TTrainingCellDataExercise[] = [];
                    let isNewItem = true;
                    let itemDate = date.toISOString();
                    if (prev[nameTraining]) {
                        prevExercises = prev[nameTraining]?.exercises;
                        isNewItem = prev[nameTraining].isNew;
                        itemDate = prev[nameTraining].date;
                    }

                    newData[nameTraining] = {
                        ...prev[nameTraining],
                        name: nameTraining,
                        date: itemDate,
                        exercises: prevExercises,
                        isNew: isNewItem,
                        isChanged: true,
                    };

                    newData[nameTraining].exercises[ind] = { ...excInfo, isImplementation: false };

                    return newData;
                });

                setIsExercisesChanged(true);
            },
            [date, chosenVariantTraining],
        );

        const removeExercisesHandler = useCallback(() => {
            if (!chosenVariantTraining) return;

            const nameTraining = chosenVariantTraining as keyof TTrainingRequired;
            setDayData((prev) => {
                const newData = {
                    ...prev,
                };

                const newExercises = newData[nameTraining].exercises.filter(
                    (item) => !item.isChecked,
                );
                newData[nameTraining] = {
                    ...prev[nameTraining],
                    exercises: newExercises,
                };

                return newData;
            });
        }, [chosenVariantTraining]);

        const saveExercises = useCallback(() => {
            for (const key in dayData) {
                if (!dayData[key].isChanged) {
                    continue;
                }

                const body: TTrainingBody | TTraining = {
                    ...dayData[key],
                };

                const newExercises = dayData[key].exercises.map(
                    (item: TTrainingCellDataExercise) => {
                        const newExItem: TTrainingExercise = { ...item };

                        if (newExItem.isChecked) {
                            delete newExItem.isChecked;
                        }

                        return newExItem;
                    },
                ) as TTrainingExercise[];

                body.exercises = newExercises;

                if ('_id' in body) {
                    if (isEdit && !isFutureDay) {
                        body.isImplementation = true;
                    }

                    updateTraining({ body, trainingId: body['_id'] as string });
                } else {
                    addTraining(body);
                }
            }

            setIsExercisesChanged(false);
            setShowModalAddNew(false);
            setShowExercisesModal(false);
            setIsEdit(false);
            setCountExercisesShow(1);
            setChosenVariantTraining(null);
            setShowModalTraining(true);
            getPersonalTrainings();
        }, [isEdit, isFutureDay, addTraining, updateTraining, dayData, getPersonalTrainings]);

        const changeChosenNameTrainingHandler = useCallback(
            (variant: TVariantChosenItem) => {
                setChosenVariantTraining((prev) => {
                    if (isEdit && prev && variant) {
                        setDayData((prevData) => {
                            const newData = prevData;
                            newData[variant] = newData[prev];
                            newData[variant].name = variant;
                            delete newData[prev];

                            return newData;
                        });
                        setIsExercisesChanged(true);
                    }
                    return variant;
                });
            },
            [isEdit],
        );

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
            const chosenExercises =
                chosenVariantTraining && dayData[chosenVariantTraining]
                    ? dayData[chosenVariantTraining].exercises
                    : [];
            const countExercises = chosenExercises.length || 1;

            if (isEdit) {
                setCountExercisesShow(countExercises);
            } else {
                setCountExercisesShow(1);
            }

            setShowModalAddNew(false);
            setShowExercisesModal(true);
        }, [chosenVariantTraining, dayData, isEdit]);

        const removeEmptyExercises = useCallback(() => {
            if (
                chosenVariantTraining &&
                dayData[chosenVariantTraining] &&
                dayData[chosenVariantTraining].exercises
            ) {
                setDayData((prevData) => {
                    const newData = prevData;
                    const newExercises = prevData[chosenVariantTraining].exercises.filter(
                        (item) => item.name,
                    );
                    newData[chosenVariantTraining].exercises = newExercises;
                    return newData;
                });
            }
        }, [chosenVariantTraining, dayData]);

        const closeAddExercisesModalHandler = useCallback(() => {
            removeEmptyExercises();
            setShowExercisesModal(false);
            setShowModalAddNew(true);
        }, [removeEmptyExercises]);

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
                        removeHandlerCB={removeExercisesHandler}
                    />
                </CellDayContext.Provider>
            </Row>
        );
    },
);
