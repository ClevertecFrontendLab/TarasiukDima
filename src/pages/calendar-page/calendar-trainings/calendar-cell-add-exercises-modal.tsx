import { memo, useCallback, useContext, useMemo, useState } from 'react';
import { useGetCurrentDayInfo } from '@hooks/index';
import { getTrainingBadgeStatusColor } from '@utils/index';
import { DATE_FORMAT_TO_VIEW, TRAININGS_IDS } from '@constants/index';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Button, Drawer, Row } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import { CellAddNewExercises } from './calendar-cell-add-exercises-form';
import { CellDayContext } from './calendar-cell-context';
import { TTrainingBody } from '@app_types/index';
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
        const { getDateNeededFormat } = useGetCurrentDayInfo();
        const {
            isFutureDay,
            isFinishedItem,
            isEdit,
            dayData,
            date,
            curDay,
            chosenVariantTraining,
        } = useContext(CellDayContext) as TCellDayContext;

        const dayToView = getDateNeededFormat(date);
        const isCantEdit = !dayData[chosenVariantTraining as string]?.isImplementation || false;

        const [exercises, setExercises] = useState<TTrainingExerciseItem[]>(() => {
            if (dayData[chosenVariantTraining as string]?.exercises) {
                const newState = [...(dayData[chosenVariantTraining as string]?.exercises || [])];

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

        const changePersonalTrainings = useCallback(
            (key: string, keyTraining: string, newTrainingData: TTrainingBody) => {
                setChangedPersonalTraining((prev) => {
                    const newData = {
                        ...prev,
                        [key]: { ...prev[key] },
                    };
                    newData[key][keyTraining] = { ...newTrainingData, isChanged: true };
                    return newData;
                });
            },
            [setChangedPersonalTraining],
        );

        const closeExercisesModal = useCallback(() => {
            if (chosenVariantTraining) {
                const newData = { ...dayData[chosenVariantTraining] };
                newData.exercises = exercises.filter((item) => item.name);
                changePersonalTrainings(curDay, chosenVariantTraining, newData);
            }
            closeAddExercises();
        }, [
            changePersonalTrainings,
            chosenVariantTraining,
            closeAddExercises,
            curDay,
            dayData,
            exercises,
        ]);

        return (
            <Drawer
                data-test-id={TRAININGS_IDS.modalExercise}
                closeIcon={
                    <CloseOutlined data-test-id={TRAININGS_IDS.modalExerciseCloseBtn}/>
                }
                className='exercises-modal'
                title={
                    <>
                        <PlusOutlined />
                        <span className='exercises-title'>Добавление упражнений</span>
                    </>
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