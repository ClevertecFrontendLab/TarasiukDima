import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { TTrainingRequired } from '@app-types/index';

import { CellExercisesModal } from './calendar-cell-add-exercises-modal';
import { CellDayContext } from './calendar-cell-context';
import { CellDayModal } from './calendar-cell-day-modal';
import { CellTrainingModal } from './calendar-cell-training-modal';
import { TCellModals } from './types';

export const CellModals: React.FC<TCellModals> = memo(
    ({
        isShow,
        isEdit,
        isFutureDay,
        curRef,
        curDay,
        trainingVariants,
        trainingDayToShow,
        trainingDaySavedData,
        chosenVariantTraining,
        saveTrainingExercises,
        dayChangedInfo = {},
        dayFullInfo = {},
        closeModalCb,
        showModalErrorCb,
        changeIsEditTraining,
        changeChosenNameTrainingCb,
        updateChangedTrainingInfoExercises,
        editTrainingButtonCB,

        isUpdateTrainingError,
        isUpdateTrainingSuccess,
        isUpdateTrainingLoading,
        isAddTrainingError,
        isAddTrainingSuccess,
        isAddTrainingLoading,
    }) => {
        const [isEditExercises, setIsEditExercises] = useState<boolean>(false);
        const [isFinishedItem, setIsFinishedItem] = useState<boolean>(false);

        const [showModalDay, setShowModalDay] = useState<boolean>(isShow);
        const [showModalAddNew, setShowModalAddNew] = useState<boolean>(false);
        const [showExercisesModal, setShowExercisesModal] = useState<boolean>(false);

        useEffect(() => {
            setShowModalDay(true);
            setShowModalAddNew(false);
            setShowExercisesModal(false);
        }, [curDay]);

        useEffect(() => {
            if (isUpdateTrainingError || isAddTrainingError) {
                showModalErrorCb();
                closeModalCb();
            }
        }, [isUpdateTrainingError, isAddTrainingError, closeModalCb, showModalErrorCb]);

        useEffect(() => {
            if (isUpdateTrainingSuccess || isAddTrainingSuccess) {
                setShowModalAddNew(false);
                setShowExercisesModal(false);
                setShowModalDay(true);
            }
        }, [isUpdateTrainingSuccess, isAddTrainingSuccess]);

        const showAddTrainingModalCb = useCallback(() => {
            changeChosenNameTrainingCb(null);
            changeIsEditTraining(false);
            setShowModalDay(false);
            setShowModalAddNew(true);
        }, [changeIsEditTraining, changeChosenNameTrainingCb]);

        const closeAddTrainingModalCb = useCallback(() => {
            changeChosenNameTrainingCb(null);
            setShowModalAddNew(false);
            setShowModalDay(true);
        }, [changeChosenNameTrainingCb]);

        const editTrainingButtonCb = useCallback(
            (trainingName: string, isFinished = false) => {
                setShowModalDay(false);
                editTrainingButtonCB(trainingName as keyof TTrainingRequired);

                if (isFinished) {
                    setIsFinishedItem(true);
                    setShowExercisesModal(true);
                } else {
                    setIsFinishedItem(false);
                    setShowModalAddNew(true);
                }
            },
            [editTrainingButtonCB],
        );

        const showExercisesModalCb = useCallback(() => {
            setIsEditExercises(false);
            setShowModalAddNew(false);
            setShowExercisesModal(true);
        }, []);

        const showEditExercisesModalCb = useCallback(() => {
            changeIsEditTraining(true);
            setIsEditExercises(true);
            setShowModalAddNew(false);
            setShowExercisesModal(true);
        }, [changeIsEditTraining]);

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
                trainingDayToShow,
                curDay,
                trainingVariants,
                isFutureDay,
                isEdit,
                isFinishedItem,
                chosenVariantTraining,
                trainingDaySavedData,
                changeTrainingVariantCb: changeChosenNameTrainingCb,
            }),
            [
                changeChosenNameTrainingCb,
                chosenVariantTraining,
                curDay,
                dayChangedInfo,
                dayFullInfo,
                isEdit,
                isFinishedItem,
                isFutureDay,
                trainingDayToShow,
                trainingVariants,
                trainingDaySavedData,
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
                        isLoading={isUpdateTrainingLoading || isAddTrainingLoading}
                        closeCb={closeAddTrainingModalCb}
                        saveExercisesCb={saveTrainingExercises}
                        showAddExercisesCb={showExercisesModalCb}
                        showEditExerciseCb={showEditExercisesModalCb}
                    />
                )}

                {showExercisesModal && (
                    <CellExercisesModal
                        isShow={showExercisesModal}
                        closeAddExercises={closeExercisesModalCb}
                        isEditExercises={isEditExercises}
                        updateChangedTrainingInfoExercises={updateChangedTrainingInfoExercises}
                    />
                )}
            </CellDayContext.Provider>
        );
    },
);
