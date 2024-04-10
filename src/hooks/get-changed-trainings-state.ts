/* eslint-disable import/no-extraneous-dependencies */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    TCalendarTrainingsLogic,
    TChangedTrainingState,
    TTrainingExerciseItem,
    TTrainingNameChosenIVariant,
    TTrainingParameters,
    TTrainingVariants,
} from '@app-types/index';
import { DATE_FORMAT_TO_VIEW } from '@constants/index';
import { useAppSelector, useDayInfo, useGetPersonalTrainings } from '@hooks/index';
import { useAddTrainingMutation, useUpdateTrainingMutation } from '@services/index';
import { compareDates } from '@utils/date';
import { deepCopyObject, isTwoSameExercisesArrays } from '@utils/index';
import { Dayjs } from 'dayjs';

export const useGetChangedTrainingsState = (
    trainingVariants: TTrainingVariants,
): TCalendarTrainingsLogic => {
    const { personalTraining } = useAppSelector((state) => state.app);
    const { getPersonalTrainings } = useGetPersonalTrainings(null);
    const { getDateNeededFormat, getDateForSave, currentDate, getDayJsItem } = useDayInfo();

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [selectedDay, setSelectedDay] = useState<string>(currentDate);
    const [lastChangedTrainingStateBeforeSave, setLastChangedTrainingStateBeforeSave] =
        useState<TChangedTrainingState | null>(null);
    const [changedPersonalTraining, setChangedPersonalTraining] = useState<TChangedTrainingState>(
        {},
    );
    const [chosenVariantTraining, setChosenVariantTraining] =
        useState<TTrainingNameChosenIVariant>(null);

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
        if (isUpdateTrainingSuccess || isAddTrainingSuccess) {
            setLastChangedTrainingStateBeforeSave(null);

            if (chosenVariantTraining) {
                setChangedPersonalTraining((prevData) => {
                    const newData = {
                        ...prevData,
                    };

                    if (newData[selectedDay] && newData[selectedDay][chosenVariantTraining]) {
                        delete newData[selectedDay][chosenVariantTraining];
                    }

                    return newData;
                });
            }
            setChosenVariantTraining(null);
            setIsEdit(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUpdateTrainingSuccess, isAddTrainingSuccess]);

    useEffect(() => {
        if (isAddTrainingError || isUpdateTrainingError) {
            if (lastChangedTrainingStateBeforeSave) {
                setChangedPersonalTraining(lastChangedTrainingStateBeforeSave);
                setLastChangedTrainingStateBeforeSave(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAddTrainingError, isUpdateTrainingError]);

    const { savedTrainingData, trainingsDataForShow } = useMemo(() => {
        const savedTrainingDataDataObj: TChangedTrainingState = {};
        const arrayWithData = trainingVariants.length ? personalTraining : [];

        arrayWithData.forEach((item) => {
            const dateItem = getDateNeededFormat(item.date);

            if (!savedTrainingDataDataObj[dateItem]) {
                savedTrainingDataDataObj[dateItem] = {};
            }

            savedTrainingDataDataObj[dateItem][item.name] = deepCopyObject(item, {});
        });

        const trainingsDataForShowObj: TChangedTrainingState = deepCopyObject(
            savedTrainingDataDataObj,
            {},
        );

        Object.keys(changedPersonalTraining).forEach((dayKey) => {
            Object.keys(changedPersonalTraining[dayKey]).forEach((trainingName) => {
                if (!dayKey) return;

                if (!trainingsDataForShowObj[dayKey]) {
                    trainingsDataForShowObj[dayKey] = {};
                }
                trainingsDataForShowObj[dayKey][trainingName] =
                    changedPersonalTraining[dayKey][trainingName];
            });
        });

        return {
            savedTrainingData: savedTrainingDataDataObj,
            trainingsDataForShow: trainingsDataForShowObj,
        };
    }, [changedPersonalTraining, personalTraining, getDateNeededFormat, trainingVariants]);

    const {
        isFutureDay,
        date,
        trainingDayToShow,
        trainingDayFullInfo,
        trainingDayChangedInfo,
        trainingDaySavedData,
    } = useMemo(
        () => ({
            isFutureDay: compareDates(currentDate, selectedDay) === 1,
            date: getDayJsItem(selectedDay),
            trainingDayToShow: getDateNeededFormat(selectedDay, DATE_FORMAT_TO_VIEW) ?? {},
            trainingDayFullInfo: trainingsDataForShow[selectedDay] ?? {},
            trainingDayChangedInfo: changedPersonalTraining[selectedDay] ?? {},
            trainingDaySavedData: savedTrainingData[selectedDay] ?? {},
        }),
        [
            selectedDay,
            getDayJsItem,
            getDateNeededFormat,
            changedPersonalTraining,
            trainingsDataForShow,
            savedTrainingData,
            currentDate,
        ],
    );

    const saveChangedTrainingLastState = useCallback(() => {
        setLastChangedTrainingStateBeforeSave(deepCopyObject(changedPersonalTraining, {}));
    }, [changedPersonalTraining]);

    const saveTrainingExercises = useCallback(() => {
        if (isUpdateTrainingLoading || isAddTrainingLoading || !chosenVariantTraining) return;

        const itemToSave = changedPersonalTraining[selectedDay][chosenVariantTraining];

        if (!itemToSave || !itemToSave.isChanged) return;

        const { isChanged, ...trainingSaveBody } = itemToSave;

        if (trainingSaveBody._id) {
            if (isEdit && !isFutureDay) {
                trainingSaveBody.isImplementation = true;
            }
            updateTraining({ body: trainingSaveBody, trainingId: trainingSaveBody._id as string });
        } else if (trainingSaveBody.exercises.length) {
            addTraining(trainingSaveBody);
        }

        getPersonalTrainings(false);
    }, [
        addTraining,
        changedPersonalTraining,
        chosenVariantTraining,
        getPersonalTrainings,
        isAddTrainingLoading,
        isEdit,
        isFutureDay,
        isUpdateTrainingLoading,
        selectedDay,
        updateTraining,
    ]);

    const changeSelectCurrentDay = useCallback(
        (newDate: Dayjs | null, needClearVariantTrainingName = true) => {
            let newValue = '';

            if (newDate) {
                newValue = getDateNeededFormat(newDate);
            }
            setSelectedDay(newValue);
            if (needClearVariantTrainingName) {
                setChosenVariantTraining(null);
            }
            setIsEdit(false);
        },
        [getDateNeededFormat],
    );

    const changeIsEditTraining = useCallback((isEditNow: boolean) => {
        setIsEdit(isEditNow);
    }, []);

    const addNewTrainingToChanged = useCallback(
        (variant: string) => {
            setChangedPersonalTraining((prevData) => {
                const newData = {
                    ...prevData,
                };

                if (!newData[selectedDay]) {
                    newData[selectedDay] = {};
                }

                newData[selectedDay][variant] = {
                    name: variant,
                    exercises: [],
                    date: getDateForSave(date),

                    isImplementation: false,
                    isChanged: false,
                };

                return newData;
            });
        },
        [selectedDay, getDateForSave, date],
    );

    const changeTrainingVariantInChanged = useCallback(
        (lastName: string, variant: string) => {
            setChangedPersonalTraining((prevData) => {
                const newData = {
                    ...prevData,
                };

                if (!newData[selectedDay]) {
                    newData[selectedDay] = {};
                }

                newData[selectedDay][variant] = { ...prevData[selectedDay][lastName] };
                newData[selectedDay][variant].name = variant;
                delete newData[selectedDay][lastName];

                return newData;
            });
        },
        [selectedDay],
    );

    const changeChosenNameTrainingCb = useCallback(
        (variant: TTrainingNameChosenIVariant) => {
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

    const editTrainingButtonCB = useCallback((variant: TTrainingNameChosenIVariant) => {
        setIsEdit(true);
        setChosenVariantTraining(variant);
    }, []);

    const updateChangedTrainingInfoExercises = useCallback(
        (exercises: TTrainingExerciseItem[]) => {
            if (!chosenVariantTraining || !selectedDay) return;

            const changedItem = changedPersonalTraining[selectedDay]
                ? changedPersonalTraining[selectedDay][chosenVariantTraining]
                : null;
            const savedItem = savedTrainingData[selectedDay]
                ? savedTrainingData[selectedDay][chosenVariantTraining]
                : null;
            const withoutEmptyExercises = exercises.filter((item) => item.name);
            let isChangedItem = true;

            if (
                changedItem &&
                isTwoSameExercisesArrays(withoutEmptyExercises, changedItem.exercises)
            ) {
                return;
            }

            if (savedItem && isTwoSameExercisesArrays(withoutEmptyExercises, savedItem.exercises)) {
                isChangedItem = false;
            }

            setChangedPersonalTraining((prev) => {
                const newData = {
                    ...prev,
                    [selectedDay]: { ...prev[selectedDay] },
                };

                if (!newData[selectedDay][chosenVariantTraining]) {
                    newData[selectedDay][chosenVariantTraining] = savedItem
                        ? deepCopyObject(savedItem, {})
                        : {
                              name: chosenVariantTraining,
                              exercises: [],
                              date: getDateForSave(date),

                              isImplementation: false,
                              isChanged: false,
                          };
                }

                newData[selectedDay][chosenVariantTraining].isChanged = isChangedItem;
                newData[selectedDay][chosenVariantTraining].exercises = withoutEmptyExercises;

                return newData;
            });
        },
        [
            changedPersonalTraining,
            chosenVariantTraining,
            date,
            getDateForSave,
            savedTrainingData,
            selectedDay,
        ],
    );

    const updateChangedTrainingParameters = useCallback(
        (data: Partial<TTrainingParameters>) => {
            if (!chosenVariantTraining || !selectedDay) return;

            const savedItem = savedTrainingData[selectedDay]
                ? savedTrainingData[selectedDay][chosenVariantTraining]
                : null;
            let isChangedItem = true;

            if (
                savedItem &&
                savedItem.parameters &&
                savedItem.parameters.period === data.period &&
                savedItem.parameters.repeat === data.repeat
            ) {
                isChangedItem = false;
            }

            setChangedPersonalTraining((prev) => {
                const newData = {
                    ...prev,
                    [selectedDay]: { ...prev[selectedDay] },
                };

                if (!newData[selectedDay][chosenVariantTraining]) {
                    newData[selectedDay][chosenVariantTraining] = savedItem
                        ? deepCopyObject(savedItem, {})
                        : {
                              name: chosenVariantTraining,
                              exercises: [],
                              date: getDateForSave(date),

                              isImplementation: false,
                              isChanged: false,
                          };
                }

                newData[selectedDay][chosenVariantTraining].isChanged = isChangedItem;
                newData[selectedDay][chosenVariantTraining].parameters = {
                    ...deepCopyObject(
                        newData[selectedDay][chosenVariantTraining].parameters ?? {
                            repeat: false,
                            period: null,
                            jointTraining: false,
                            participants: [],
                        },
                        {},
                    ),
                    repeat: data.repeat,
                    period: data.period ?? null,
                };

                return newData;
            });
        },
        [chosenVariantTraining, date, getDateForSave, savedTrainingData, selectedDay],
    );

    return {
        changedPersonalTraining,
        trainingsDataForShow,
        savedTrainingData,

        trainingDayFullInfo,
        trainingDayChangedInfo,
        trainingDaySavedData,

        isUpdateTrainingError,
        isUpdateTrainingSuccess,
        isUpdateTrainingLoading,
        isAddTrainingError,
        isAddTrainingSuccess,
        isAddTrainingLoading,

        isFutureDay,
        isEdit,
        trainingDayToShow,
        changeIsEditTraining,
        selectedDay,
        changeSelectCurrentDay,
        saveTrainingExercises,
        chosenVariantTraining,
        changeChosenNameTrainingCb,
        updateChangedTrainingInfoExercises,
        updateChangedTrainingParameters,
        editTrainingButtonCB,
        saveChangedTrainingLastState,
    };
};
