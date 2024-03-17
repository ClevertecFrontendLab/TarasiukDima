import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useAppSelector, useGetCurrentDayInfo, useGetPersonalTrainings } from '@hooks/index';
import { useAddTrainingMutation, useUpdateTrainingMutation } from '@services/index';
import { Modal } from 'antd';
import { CellDayModal } from './calendar-cell-day-modal';
import { CellDayContext } from './calendar-cell-context';
import { CellTrainingModal } from './calendar-cell-training-modal';
import { CellExercisesModal } from './calendar-cell-add-exercises-modal';
import { DATE_FORMAT } from '@constants/index';
import { TTrainingRequired } from '@app_types/index';
import { TCellModals, TTrainingDayData, TVariantChosenItem } from './types';
import localeRu from 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import isLeapYear from 'dayjs/plugin/isLeapYear';

dayjs.extend(isLeapYear);
dayjs.extend(utc);
dayjs.locale('ru', localeRu);

export const CellModals: React.FC<TCellModals> = memo(
    ({
        curRef,
        curDay,
        trainingVariants,
        isFutureDay,
        dayChangedInfo = {},

        setChangedPersonalTraining,
        closeModalCb,
    }) => {
        const { getPersonalTrainings } = useGetPersonalTrainings();
        const { personalTraining } = useAppSelector((state) => state.app);
        const { getDateNeededFormat, getDateForSave } = useGetCurrentDayInfo();

        const [isEdit, setIsEdit] = useState<boolean>(false);
        const [chosenVariantTraining, setChosenVariantTraining] =
            useState<TVariantChosenItem>(null);

        const [showModalDay, setShowModalDay] = useState<boolean>(true);
        const [showModalAddNew, setShowModalAddNew] = useState<boolean>(false);
        const [isEditExercises, setIsEditExercises] = useState<boolean>(false);
        const [isFinishedItem, setIsFinishedItem] = useState<boolean>(false);

        const [showExercisesModal, setShowExercisesModal] = useState<boolean>(false);

        const date = dayjs(curDay);
        const changedItemsExist = Boolean(Object.keys(dayChangedInfo).length);
        const daySavedTraining = useMemo(() => {
            return personalTraining.filter((item) => getDateNeededFormat(item.date) === curDay);
        }, [personalTraining, getDateNeededFormat, curDay]);

        const dayData = useMemo(() => {
            if (!changedItemsExist) {
                const dayDataContent: TTrainingDayData = {};
                daySavedTraining.forEach((item) => {
                    dayDataContent[item.name] = item;
                });

                return dayDataContent;
            }
            return dayChangedInfo;
        }, [changedItemsExist, dayChangedInfo, daySavedTraining]);
        const addedTrainingNames = Object.keys(dayData) as string[];
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
            setShowModalDay(true);
            setShowModalAddNew(false);
            setShowExercisesModal(false);
        }, [curDay]);

        useEffect(() => {
            if (isAddTrainingError || isUpdateTrainingError) {
                Modal.error({
                    centered: true,
                    closable: true,
                    title: 'При сохранении данных произошла ошибка',
                    content: 'Придётся попробовать ещё раз',
                    okText: 'Закрыть',
                    okButtonProps: {
                        className: 'right-btn',
                    },
                    className: 'modal-page',
                });

                setShowModalAddNew(false);
                setShowExercisesModal(false);
                setShowModalDay(false);
            }
        }, [isAddTrainingError, isUpdateTrainingError]);

        useEffect(() => {
            if (isUpdateTrainingSuccess || isAddTrainingSuccess) {
                setShowModalAddNew(false);
                setShowExercisesModal(false);
                setIsEdit(false);
                setChosenVariantTraining(null);
                setShowModalDay(true);
            }
        }, [isUpdateTrainingSuccess, isAddTrainingSuccess]);

        const saveExercises = useCallback(() => {
            if (isUpdateTrainingLoading || isAddTrainingLoading || !chosenVariantTraining) return;

            const itemToSave = dayData[chosenVariantTraining];

            if (itemToSave._id) {
                if (isEdit && !isFutureDay) {
                    itemToSave.isImplementation = true;
                }
                updateTraining({ body: itemToSave, trainingId: itemToSave._id as string });
            } else {
                addTraining(itemToSave);
            }

            getPersonalTrainings();
        }, [
            chosenVariantTraining,
            dayData,
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
                    newData[curDay][variant] = { ...prevData[curDay][lastName] };
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
                    };

                    return newData;
                });
            },
            [setChangedPersonalTraining, curDay, getDateForSave, date],
        );

        const changeChosenNameTrainingHandler = useCallback(
            (variant: TVariantChosenItem) => {
                setChosenVariantTraining((prev) => {
                    if (isEdit && prev && variant) {
                        changeTrainingVariantInChanged(prev, variant);
                    } else if (!prev && variant) {
                        addNewTrainingToChanged(variant);
                    }
                    return variant;
                });
            },
            [isEdit, addNewTrainingToChanged, changeTrainingVariantInChanged],
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
                setShowExercisesModal(true);
                setIsFinishedItem(true);
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
                dayData,
                date,
                trainingVariants,
                isFutureDay,
                isEdit,
                isFinishedItem,
                chosenVariantTraining,
                changeTrainingVariantCb: changeChosenNameTrainingHandler,
            }),
            [
                dayData,
                date,
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
                    isEmptyDay={isEmptyDay}
                    addedTrainingNames={addedTrainingNames}
                    closeCb={closeModalCb}
                    addNewTrainingCb={showAddTrainingModalCb}
                    editTrainingCb={editTrainingButtonCb}
                />

                <CellTrainingModal
                    refEl={curRef.current as HTMLElement}
                    isShow={showModalAddNew}
                    isLoading={isAddTrainingLoading || isUpdateTrainingLoading}
                    isCanSaveExercises={changedItemsExist}
                    daySavedTraining={daySavedTraining}
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
                        curDay={curDay}
                        isEditExercises={isEditExercises}
                    />
                )}
            </CellDayContext.Provider>
        );
    },
);
