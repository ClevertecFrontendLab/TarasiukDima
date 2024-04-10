/* eslint-disable import/no-extraneous-dependencies */
import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
    TSimpleFn,
    TTrainingExerciseItem,
    TTrainingNameChosenIVariant,
    TTrainingVariants,
} from '@app-types/index';
import { AddExercisesModal, AppDatePicker } from '@components/index';
import { DEFAULT_TRAINING_NAME_VARIANT, MY_TRAININGS_IDS, TRAININGS_IDS } from '@constants/index';
import { useDayInfo } from '@hooks/index';
import { compareDates } from '@utils/date';
import { getEmptyTrainingStateItem, getTrainingPeriodText } from '@utils/index';
import { Button, Col, Row, Select } from 'antd';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Dayjs } from 'dayjs';

import { TrainingsContext } from '../trainings-context';
import { TTrainingsContent } from '../types';

type TMyTrainingsExercisesModalProps = {
    isShow: boolean;
    closeAddExercises: TSimpleFn;
    trainingVariants: TTrainingVariants;
};

const periodVariants = [
    {
        value: '0',
        label: 'Периодичность',
    },
    {
        value: '1',
        label: getTrainingPeriodText(1),
    },
    {
        value: '2',
        label: getTrainingPeriodText(2),
    },
    {
        value: '3',
        label: getTrainingPeriodText(3),
    },
    {
        value: '4',
        label: getTrainingPeriodText(4),
    },
    {
        value: '5',
        label: getTrainingPeriodText(5),
    },
    {
        value: '6',
        label: getTrainingPeriodText(6),
    },
    {
        value: '7',
        label: getTrainingPeriodText(7),
    },
];

export const MyTrainingsExercisesModal: React.FC<TMyTrainingsExercisesModalProps> = memo(
    ({ isShow, closeAddExercises, trainingVariants }) => {
        const { getDayJsItem, currentDate, getDateNeededFormat } = useDayInfo();

        const {
            selectedDay,
            chosenVariantTraining,
            isFutureDay,
            isEdit,
            isAddTrainingLoading,
            isUpdateTrainingLoading,
            changeSelectCurrentDay,
            trainingDayToShow,
            trainingDayFullInfo,
            trainingDaySavedData,
            trainingDayChangedInfo,
            changeChosenNameTrainingCb,
            saveTrainingExercises,
            updateChangedTrainingInfoExercises,
            updateChangedTrainingParameters,
        } = useContext(TrainingsContext) as TTrainingsContent;
        const [defaultSelectValue, setDefaultSelectValue] = useState(
            chosenVariantTraining ?? DEFAULT_TRAINING_NAME_VARIANT,
        );

        const [isShowSelectVariant, setIsShowSelectVariant] = useState(false);
        const [isPeriodActive, setIsPeriodActive] = useState(
            trainingDayFullInfo[chosenVariantTraining ?? '']?.parameters?.repeat ?? false,
        );
        const [selectedPeriod, setSelectedPeriod] = useState(
            trainingDayFullInfo[chosenVariantTraining ?? '']?.parameters?.period?.toString() ?? '0',
        );

        useEffect(() => {
            if (chosenVariantTraining) {
                setDefaultSelectValue(chosenVariantTraining);
            } else {
                setDefaultSelectValue(DEFAULT_TRAINING_NAME_VARIANT);
            }
        }, [chosenVariantTraining]);

        const isCantEdit =
            !trainingDayFullInfo[chosenVariantTraining as string]?.isImplementation || false;

        const initialExercises: TTrainingExerciseItem[] = useMemo(() => {
            const itemToShow =
                trainingDayChangedInfo[chosenVariantTraining as string] ??
                trainingDayFullInfo[chosenVariantTraining as string];

            if (itemToShow?.exercises) {
                const newState = [...(itemToShow?.exercises || [])];

                if (!isEdit) {
                    newState.push(getEmptyTrainingStateItem());
                }

                return newState;
            }

            return [getEmptyTrainingStateItem()];
        }, [chosenVariantTraining, trainingDayChangedInfo, trainingDayFullInfo, isEdit]);

        const changeVisibleSelectTrainingName = useCallback(() => {
            setIsShowSelectVariant((prev) => !prev);
        }, []);

        const onChangeIsPeriod = useCallback(
            (event: CheckboxChangeEvent) => {
                const checkedPeriod = event.target.checked;

                updateChangedTrainingParameters({
                    repeat: checkedPeriod,
                    period: +selectedPeriod,
                });
                setIsPeriodActive(checkedPeriod);
            },
            [updateChangedTrainingParameters, selectedPeriod],
        );

        const changePeriodTime = useCallback(
            (value: string) => {
                updateChangedTrainingParameters({
                    repeat: isPeriodActive,
                    period: +value,
                });
                setSelectedPeriod(value);
            },
            [updateChangedTrainingParameters, isPeriodActive],
        );

        const closeExercisesModal = useCallback(
            (exercises: TTrainingExerciseItem[]) => {
                updateChangedTrainingInfoExercises(exercises);
                closeAddExercises();
            },
            [updateChangedTrainingInfoExercises, closeAddExercises],
        );

        const onChangeSelectDay = useCallback(
            (date: Dayjs | null) => {
                changeSelectCurrentDay(date, false);
            },
            [changeSelectCurrentDay],
        );

        const disabledPickerDate = useCallback(
            (date: Dayjs) => {
                const dayCheck = getDateNeededFormat(date);

                if (currentDate === dayCheck) {
                    return true;
                }

                const compare = compareDates(dayCheck, currentDate);

                return compare === 1;
            },
            [getDateNeededFormat, currentDate],
        );

        const updateExercisesInfoCb = useCallback(
            (exercisesNew: TTrainingExerciseItem[]) => {
                updateChangedTrainingInfoExercises(exercisesNew);
            },
            [updateChangedTrainingInfoExercises],
        );

        const saveExercisesCb = useCallback(() => {
            saveTrainingExercises();
            closeAddExercises();
        }, [saveTrainingExercises, closeAddExercises]);

        const variantsTrainingForChoose = useMemo(() => {
            const addedTrainingNames = Object.keys(trainingDayFullInfo);

            return trainingVariants
                .map((item) => ({
                    value: item.name,
                    label: item.name,
                }))
                .filter((item) => !addedTrainingNames.includes(item.label));
        }, [trainingDayFullInfo, trainingVariants]);

        const { isDisabledChoseTrainingName, isTrainingVariantExist } = useMemo(() => {
            let trainingVariantExist = false;
            let isDisabled = false;

            if (trainingDaySavedData) {
                Object.entries(trainingDaySavedData).forEach(([, value]) => {
                    if (value.name === defaultSelectValue) {
                        isDisabled = true;
                        trainingVariantExist = true;
                    }
                });
            }

            return {
                isDisabledChoseTrainingName: isDisabled,
                isTrainingVariantExist: trainingVariantExist,
            };
        }, [trainingDaySavedData, defaultSelectValue]);

        const disabledSaveBtn = useMemo(() => {
            if (isEdit) return false;

            const isChangedExercises =
                trainingDayChangedInfo[chosenVariantTraining as string]?.isChanged ?? false;

            const disabledBtn =
                !isChangedExercises ||
                isAddTrainingLoading ||
                isUpdateTrainingLoading ||
                !selectedDay;

            if (isTrainingVariantExist || !chosenVariantTraining) {
                return disabledBtn;
            }

            const exercises = trainingDayChangedInfo[chosenVariantTraining]?.exercises || [];
            // eslint-disable-next-line no-extra-boolean-cast
            const emptyExercises = exercises ? !Boolean(exercises.length) : true;

            return disabledBtn || emptyExercises;
        }, [
            isTrainingVariantExist,
            selectedDay,
            isEdit,
            chosenVariantTraining,
            trainingDayChangedInfo,
            isAddTrainingLoading,
            isUpdateTrainingLoading,
        ]);

        return (
            <AddExercisesModal
                closeAddExercisesCb={closeExercisesModal}
                dayToView={trainingDayToShow}
                initialExercises={initialExercises}
                isEditExercises={isEdit}
                isCantEdit={isCantEdit}
                isFinishedItem={false}
                isFutureDay={isFutureDay}
                isShow={isShow}
                updateExercisesInfoCb={updateExercisesInfoCb}
                isShowTextLastEdit={Boolean(selectedDay)}
                // title={isEdit ? 'Редактировать тренировку' : 'Новая тренировка'}
                title={isEdit ? 'Редактирование' : 'Добавление упражнений'}
                startModalContent={
                    <Col className='add-new__header'>
                        <div className='add-new__header_variant' id='select-wrapper'>
                            <Select
                                open={isShowSelectVariant}
                                onChange={changeChosenNameTrainingCb}
                                onClick={changeVisibleSelectTrainingName}
                                data-test-id={TRAININGS_IDS.modalCreateSelect}
                                value={defaultSelectValue as TTrainingNameChosenIVariant}
                                disabled={isDisabledChoseTrainingName}
                                options={variantsTrainingForChoose}
                                getPopupContainer={() =>
                                    document.getElementById('select-wrapper') as HTMLDivElement
                                }
                            />
                        </div>
                        <Row
                            justify='space-between'
                            align='middle'
                            className='add-new__header_conditions'
                        >
                            <AppDatePicker
                                disabledDate={disabledPickerDate}
                                className='add-new__daypicker'
                                name='day-training'
                                dataTestId={MY_TRAININGS_IDS.datePicker}
                                placeholder='Select day'
                                value={selectedDay ? getDayJsItem(selectedDay) : null}
                                onChange={onChangeSelectDay}
                            />

                            <Checkbox
                                data-test-id={MY_TRAININGS_IDS.periodsCheckbox}
                                className='add-new__periods'
                                onChange={onChangeIsPeriod}
                                checked={isPeriodActive}
                            >
                                <span>С периодичностью</span>
                            </Checkbox>

                            <div className='add-new__period_variant' id='period-wrapper'>
                                {isPeriodActive && (
                                    <Select
                                        data-test-id={MY_TRAININGS_IDS.periodsSelect}
                                        onChange={changePeriodTime}
                                        value={selectedPeriod}
                                        options={periodVariants}
                                        getPopupContainer={() =>
                                            document.getElementById(
                                                'period-wrapper',
                                            ) as HTMLDivElement
                                        }
                                    />
                                )}
                            </div>
                        </Row>
                    </Col>
                }
                footer={
                    <Button type='primary' disabled={disabledSaveBtn} onClick={saveExercisesCb}>
                        Сохранить
                    </Button>
                }
            />
        );
    },
);
