import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useGetCurrentDayInfo, useGetPersonalTrainings } from '@hooks/index';
import { useAddTrainingMutation, useUpdateTrainingMutation } from '@services/index';
import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { CellDayModal } from './calendar-cell-day-modal';
import { CellDayContext } from './calendar-cell-context';
import { CellTrainingModal } from './calendar-cell-training-modal';
import { CellExercisesModal } from './calendar-cell-add-exercises-modal';
import { MODALS_STYLE, TRAININGS_IDS } from '@constants/index';
import { TTrainingRequired } from '@app_types/index';
import { TCellModals, TVariantChosenItem } from './types';

export const CellModals: React.FC<TCellModals> = memo(
    ({
        curRef,
        curDay,
        trainingVariants,
        isFutureDay,
        dayChangedInfo = {},
        dayFullInfo = {},

        setChangedPersonalTraining,
        closeModalCb,
    }) => {

        const { getPersonalTrainings } = useGetPersonalTrainings();
        const { getDateForSave } = useGetCurrentDayInfo();
        console.log('dayChangedInfo', dayFullInfo, dayChangedInfo);
        console.log("getDateForSave", getDateForSave(curDay));

        const [isEdit, setIsEdit] = useState<boolean>(false);
        const [isEditExercises, setIsEditExercises] = useState<boolean>(false);
        const [isFinishedItem, setIsFinishedItem] = useState<boolean>(false);
        const [chosenVariantTraining, setChosenVariantTraining] =
            useState<TVariantChosenItem>(null);

        const [showModalDay, setShowModalDay] = useState<boolean>(true);
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
                setShowModalAddNew(false);
                setShowExercisesModal(false);
                setShowModalDay(false);

                Modal.error({
                    centered: true,
                    closable: true,
                    closeIcon: (
                        <CloseOutlined data-test-id={TRAININGS_IDS.modalErrorUserCloseBtn} />
                    ),
                    title: (
                        <span data-test-id={TRAININGS_IDS.modalErrorUserTitle}>
                            При сохранении данных произошла ошибка
                        </span>
                    ),
                    content: (
                        <span data-test-id={TRAININGS_IDS.modalErrorUserSubTitle}>
                            Придётся попробовать ещё раз
                        </span>
                    ),
                    okText: 'Закрыть',
                    okButtonProps: {
                        className: 'right-btn',
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        'data-test-id': TRAININGS_IDS.modalErrorUserBtn,
                    },
                    className: 'modal-page',
                    maskStyle: MODALS_STYLE.maskStyleSmall,
                });
            }
        }, [isAddTrainingError, isUpdateTrainingError]);

        useEffect(() => {
            if (isUpdateTrainingSuccess || isAddTrainingSuccess) {
                console.log(
                    'isUpdateTrainingSuccess || isAddTrainingSuccess',
                    isUpdateTrainingSuccess,
                    isAddTrainingSuccess,
                );
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
            console.log('showAddTrainingModalCb');
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
            console.log('editTrainingButtonCb', trainingName, isFinished);

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
            console.log('showExercisesModalCb');

            setIsEditExercises(false);
            setShowModalAddNew(false);
            setShowExercisesModal(true);
        }, []);

        const showEditExercisesModalCb = useCallback(() => {
            console.log('showEditExercisesModalCb');

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
                dayChangedInfo: dayChangedInfo,
                dayFullInfo: dayFullInfo,
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
                <CellDayModal
                    refEl={curRef.current as HTMLElement}
                    isShow={showModalDay}
                    closeCb={closeModalCb}
                    addNewTrainingCb={showAddTrainingModalCb}
                    editTrainingCb={editTrainingButtonCb}
                />

                <CellTrainingModal
                    refEl={curRef.current as HTMLElement}
                    isShow={showModalAddNew}
                    isLoading={isAddTrainingLoading || isUpdateTrainingLoading}
                    closeCb={closeAddTrainingModalCb}
                    saveExercisesCb={saveExercises}
                    showAddExercisesCb={showExercisesModalCb}
                    showEditExerciseCb={showEditExercisesModalCb}
                />

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
