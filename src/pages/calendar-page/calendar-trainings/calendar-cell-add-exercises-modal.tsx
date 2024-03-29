import { Fragment, memo, useCallback, useContext, useMemo, useState } from 'react';
import { CloseOutlined, EditOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { DATE_FORMAT_TO_VIEW, TRAININGS_IDS } from '@constants/index';
import { useGetCurrentDayInfo, useGetSavedTraining } from '@hooks/index';
import { getTrainingBadgeStatusColor, isTwoSameExercisesArrays } from '@utils/index';
import { Badge, Button, Drawer, Row } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';

import { CellAddNewExercises } from './calendar-cell-add-exercises-form';
import { CellDayContext } from './calendar-cell-context';
import {
    TCellAddNewExercisesProps,
    TCellDayContext,
    TExerciseNewInfo,
    TTrainingExerciseItem,
} from './types';

const emptyExercise: TTrainingExerciseItem = {
    name: '',
    replays: 1,
    weight: 0,
    approaches: 1,
    isImplementation: false,
    isChecked: false,
};

export const CellExercisesModal: React.FC<TCellAddNewExercisesProps> = memo(
    ({ isShow, isEditExercises, closeAddExercises, setChangedPersonalTraining }) => {
        const { getDateNeededFormat, getDateForSave } = useGetCurrentDayInfo();
        const {
            isFutureDay,
            isFinishedItem,
            isEdit,
            dayChangedInfo,
            dayFullInfo,
            date,
            curDay,
            chosenVariantTraining,
        } = useContext(CellDayContext) as TCellDayContext;

        const dayToView = getDateNeededFormat(date);
        const isCantEdit = !dayFullInfo[chosenVariantTraining as string]?.isImplementation || false;

        const { getSavedTrainingByName } = useGetSavedTraining();

        const [exercises, setExercises] = useState<TTrainingExerciseItem[]>(() => {
            const dataToShow =
                dayChangedInfo[chosenVariantTraining as string] ??
                dayFullInfo[chosenVariantTraining as string];

            if (dataToShow?.exercises) {
                const newState = [...(dataToShow?.exercises || [])];

                if (!isFinishedItem && !isEditExercises) {
                    newState.push({ ...emptyExercise });
                }

                return newState;
            }

            return !isFinishedItem ? [{ ...emptyExercise }] : [];
        });

        const existChosenItem = useMemo(() => {
            let result = false;

            exercises.forEach((item) => {
                if (item.isChecked) {
                    result = true;
                }
            });

            return result;
        }, [exercises]);

        const addNewExerciseCb = useCallback(() => {
            setExercises((prev) => [...prev, { ...emptyExercise }]);
        }, []);

        const changeExercisesInfoCB = useCallback((ind: number, excInfo: TExerciseNewInfo) => {
            setExercises((prev) => {
                const newExercises = [...prev];

                newExercises[ind] = {
                    ...excInfo,
                    isImplementation: newExercises[ind].isImplementation,
                };

                return newExercises;
            });
        }, []);

        const removeExercisesCb = useCallback(() => {
            setExercises((prev) => [...prev].filter((item) => !item.isChecked));
        }, []);

        const changePersonalTrainings = useCallback(() => {
            if (!chosenVariantTraining) return;

            const changedItem = dayChangedInfo[chosenVariantTraining];
            const savedItem = getSavedTrainingByName(curDay, chosenVariantTraining)[0];
            const newExercises = exercises.filter((item) => item.name);

            if (!savedItem || !changedItem || exercises.length !== changedItem.exercises.length) {
                if (changedItem && isTwoSameExercisesArrays(newExercises, changedItem.exercises)) {
                    return;
                }

                if (!changedItem && isTwoSameExercisesArrays(newExercises, savedItem.exercises)) {
                    return;
                }

                setChangedPersonalTraining((prev) => {
                    const newData = {
                        ...prev,
                        [curDay]: { ...prev[curDay] },
                    };

                    if (!newData[curDay]) {
                        newData[curDay] = {};
                    }

                    if (!newData[curDay][chosenVariantTraining]) {
                        newData[curDay][chosenVariantTraining] = savedItem
                            ? { ...savedItem }
                            : {
                                  name: chosenVariantTraining,
                                  exercises: [],
                                  date: getDateForSave(date),

                                  isImplementation: false,
                                  isChanged: false,
                              };
                    }

                    newData[curDay][chosenVariantTraining].isChanged = true;
                    newData[curDay][chosenVariantTraining].exercises = newExercises;

                    return newData;
                });
            }
        }, [
            setChangedPersonalTraining,
            curDay,
            dayChangedInfo,
            getSavedTrainingByName,
            getDateForSave,
            chosenVariantTraining,
            exercises,
            date,
        ]);

        const closeExercisesModal = useCallback(() => {
            changePersonalTrainings();
            closeAddExercises();
        }, [changePersonalTrainings, closeAddExercises]);

        return (
            <Drawer
                destroyOnClose={true}
                data-test-id={TRAININGS_IDS.modalExercise}
                closeIcon={<CloseOutlined data-test-id={TRAININGS_IDS.modalExerciseCloseBtn} />}
                className='drawer-site exercises-modal'
                title={
                    <Fragment>
                        {isEdit ? <EditOutlined /> : <PlusOutlined />}
                        <span className='exercises-title'>
                            {isEdit ? 'Редактирование' : 'Добавление упражнений'}
                        </span>
                    </Fragment>
                }
                placement='right'
                onClose={closeExercisesModal}
                open={isShow}
            >
                <Row className='exercises-modal__var-info' justify='space-between' align='middle'>
                    <Badge
                        className='exercises-modal__var-info_badge'
                        color={getTrainingBadgeStatusColor(chosenVariantTraining as string)}
                        text={chosenVariantTraining}
                    />
                    <Paragraph className='exercises-modal__var-info_date'>
                        {getDateNeededFormat(date, DATE_FORMAT_TO_VIEW)}
                    </Paragraph>
                </Row>

                {exercises.map(
                    ({ name, approaches, weight, replays, isChecked = false }, index: number) => (
                        <CellAddNewExercises
                            isFinished={isFinishedItem}
                            // eslint-disable-next-line react/no-array-index-key
                            key={index + dayToView}
                            keyItem={index}
                            testIdIndex={index}
                            changeExercisesInfoCB={changeExercisesInfoCB}
                            name={name}
                            weight={weight}
                            approaches={approaches}
                            replays={replays}
                            isChecked={isChecked}
                        />
                    ),
                )}

                {!isFinishedItem && (
                    <Row className='buttons-wrapper'>
                        <Button type='text' className='add-more' onClick={addNewExerciseCb}>
                            <PlusOutlined />
                            <span>Добавить ещё</span>
                        </Button>

                        {isEdit && (
                            <Button
                                type='text'
                                className='remove'
                                disabled={!existChosenItem}
                                onClick={removeExercisesCb}
                            >
                                <MinusOutlined />
                                <span>Удалить</span>
                            </Button>
                        )}
                    </Row>
                )}

                {!isFutureDay && isCantEdit && (
                    <Paragraph className='last-chance-edit'>
                        После сохранения внесенных изменений
                        <br /> отредактировать проведенную тренировку
                        <br /> будет невозможно
                    </Paragraph>
                )}
            </Drawer>
        );
    },
);
