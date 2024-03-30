import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useGetCurrentDayInfo, useGetPersonalTrainings } from '@hooks/index';
import { useAddTrainingMutation, useUpdateTrainingMutation } from '@services/index';
// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs';
import { TTrainingRequired } from 'src/app-types/index';

import { CellExercisesModal } from './calendar-cell-add-exercises-modal';
import { CellDayContext } from './calendar-cell-context';
import { CellDayModal } from './calendar-cell-day-modal';
import { CellTrainingModal } from './calendar-cell-training-modal';
import { TCellModals, TVariantChosenItem } from './types';

export const CellModals: React.FC<TCellModals> = memo(
    ({
        isShow,
        curRef,
        curDay,
        trainingVariants,
        isFutureDay,
        dayChangedInfo = {},
        dayFullInfo = {},

        setChangedPersonalTraining,
        closeModalCb,
        showModalErrorCb,
    }) => {
        const { getPersonalTrainings } = useGetPersonalTrainings();
        const { getDateForSave } = useGetCurrentDayInfo();

        const [isEdit, setIsEdit] = useState<boolean>(false);
        const [isEditExercises, setIsEditExercises] = useState<boolean>(false);
        const [isFinishedItem, setIsFinishedItem] = useState<boolean>(false);
        const [chosenVariantTraining, setChosenVariantTraining] =
            useState<TVariantChosenItem>(null);

        const [showModalDay, setShowModalDay] = useState<boolean>(isShow);
        const [showModalAddNew, setShowModalAddNew] = useState<boolean>(false);
        const [showExercisesModal, setShowExercisesModal] = useState<boolean>(false);

        const date = dayjs(curDay);

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
            setShowModalDay(true);
            setShowModalAddNew(false);
            setShowExercisesModal(false);
        }, [curDay]);

        useEffect(() => {
            if (isAddTrainingError || isUpdateTrainingError) {
                if (chosenVariantTraining) {
                    setChangedPersonalTraining((prevData) => {
                        const newData = {
                            ...prevData,
                        };

                        if (newData[curDay] && newData[curDay][chosenVariantTraining]) {
                            delete newData[curDay][chosenVariantTraining];
                        }

                        return newData;
                    });
                }

                showModalErrorCb();
                closeModalCb();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isAddTrainingError, closeModalCb, showModalErrorCb, isUpdateTrainingError]);

        useEffect(() => {
            if (isUpdateTrainingSuccess || isAddTrainingSuccess) {
                if (chosenVariantTraining) {
                    setChangedPersonalTraining((prevData) => {
                        const newData = {
                            ...prevData,
                        };

                        if (newData[curDay] && newData[curDay][chosenVariantTraining]) {
                            delete newData[curDay][chosenVariantTraining];
                        }

                        return newData;
                    });
                }

                setShowModalAddNew(false);
                setShowExercisesModal(false);
                setIsEdit(false);
                setChosenVariantTraining(null);
                setShowModalDay(true);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isUpdateTrainingSuccess, isAddTrainingSuccess, setChangedPersonalTraining, curDay]);

        const saveExercises = useCallback(() => {
            if (isUpdateTrainingLoading || isAddTrainingLoading || !chosenVariantTraining) return;

            const itemToSave = dayChangedInfo[chosenVariantTraining];

            if (!itemToSave || !itemToSave.isChanged) return;

            if (itemToSave._id) {
                if (isEdit && !isFutureDay) {
                    itemToSave.isImplementation = true;
                }
                updateTraining({ body: itemToSave, trainingId: itemToSave._id as string });
            } else if (itemToSave.exercises.length) {
                addTraining(itemToSave);
            }

            getPersonalTrainings(false);
        }, [
            chosenVariantTraining,
            dayChangedInfo,
            isAddTrainingLoading,
            isUpdateTrainingLoading,
            addTraining,
            isEdit,
            isFutureDay,
            updateTraining,
            getPersonalTrainings,
        ]);

        const changeTrainingVariantInChanged = useCallback(
            (lastName: string, variant: string) => {
                setChangedPersonalTraining((prevData) => {
                    const newData = {
                        ...prevData,
                    };

                    newData[curDay][variant] = prevData[curDay][lastName];
                    newData[curDay][variant].name = variant;
                    delete newData[curDay][lastName];

                    return newData;
                });
            },
            [setChangedPersonalTraining, curDay],
        );

        const addNewTrainingToChanged = useCallback(
            (variant: string) => {
                setChangedPersonalTraining((prevData) => {
                    const newData = {
                        ...prevData,
                    };

                    if (!newData[curDay]) {
                        newData[curDay] = {};
                    }

                    newData[curDay][variant] = {
                        name: variant,
                        exercises: [],
                        date: getDateForSave(date),

                        isImplementation: false,
                        isChanged: false,
                    };

                    return newData;
                });
            },
            [setChangedPersonalTraining, curDay, getDateForSave, date],
        );

        const changeChosenNameTrainingHandler = useCallback(
            (variant: TVariantChosenItem) => {
                setChosenVariantTraining((prev) => {
                    if (prev && variant) {
                        changeTrainingVariantInChanged(prev, variant);
                    } else if (!prev && variant) {
                        addNewTrainingToChanged(variant);
                    }

                    return variant;
                });
            },
            [addNewTrainingToChanged, changeTrainingVariantInChanged],
        );

        const showAddTrainingModalCb = useCallback(() => {
            setIsEdit(false);
            setChosenVariantTraining(null);
            setShowModalDay(false);
            setShowModalAddNew(true);
        }, []);

        const closeAddTrainingModalCb = useCallback(() => {
            setShowModalAddNew(false);
            setShowModalDay(true);
        }, []);

        const editTrainingButtonCb = useCallback((trainingName: string, isFinished = false) => {
            setShowModalDay(false);
            setChosenVariantTraining(trainingName as keyof TTrainingRequired);
            setIsEdit(true);

            if (isFinished) {
                setIsFinishedItem(true);
                setShowExercisesModal(true);
            } else {
                setIsFinishedItem(false);
                setShowModalAddNew(true);
            }
        }, []);

        const showExercisesModalCb = useCallback(() => {
            setIsEditExercises(false);
            setShowModalAddNew(false);
            setShowExercisesModal(true);
        }, []);

        const showEditExercisesModalCb = useCallback(() => {
            setIsEdit(true);
            setIsEditExercises(true);
            setShowModalAddNew(false);
            setShowExercisesModal(true);
        }, []);

        const closeExercisesModalCb = useCallback(() => {
            setIsEditExercises(false);
            setShowExercisesModal(false);

            if (isFinishedItem) {
                setIsFinishedItem(false);
                setShowModalDay(true);
            } else {
                setShowModalAddNew(true);
            }
        }, [isFinishedItem]);

        const cellDayContextValue = useMemo(
            () => ({
                dayChangedInfo,
                dayFullInfo,
                date,
                curDay,
                trainingVariants,
                isFutureDay,
                isEdit,
                isFinishedItem,
                chosenVariantTraining,
                changeTrainingVariantCb: changeChosenNameTrainingHandler,
            }),
            [
                dayChangedInfo,
                dayFullInfo,
                date,
                curDay,
                trainingVariants,
                isFutureDay,
                isEdit,
                isFinishedItem,
                chosenVariantTraining,
                changeChosenNameTrainingHandler,
            ],
        );

        if (!curRef || !curRef.current) return null;

        return (
            <CellDayContext.Provider value={cellDayContextValue}>
                {showModalDay && (
                    <CellDayModal
                        refEl={curRef.current as HTMLElement}
                        isShow={showModalDay}
                        closeCb={closeModalCb}
                        addNewTrainingCb={showAddTrainingModalCb}
                        editTrainingCb={editTrainingButtonCb}
                    />
                )}

                {showModalAddNew && (
                    <CellTrainingModal
                        refEl={curRef.current as HTMLElement}
                        isShow={showModalAddNew}
                        isLoading={isAddTrainingLoading || isUpdateTrainingLoading}
                        closeCb={closeAddTrainingModalCb}
                        saveExercisesCb={saveExercises}
                        showAddExercisesCb={showExercisesModalCb}
                        showEditExerciseCb={showEditExercisesModalCb}
                    />
                )}

                {showExercisesModal && (
                    <CellExercisesModal
                        isShow={showExercisesModal}
                        closeAddExercises={closeExercisesModalCb}
                        setChangedPersonalTraining={setChangedPersonalTraining}
                        isEditExercises={isEditExercises}
                    />
                )}
            </CellDayContext.Provider>
        );
    },
);
