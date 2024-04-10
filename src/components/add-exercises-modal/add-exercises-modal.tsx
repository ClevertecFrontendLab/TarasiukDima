import { Fragment, memo, ReactNode, useCallback, useMemo, useState } from 'react';
import { CloseOutlined, EditOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { TExerciseNewInfo, TTrainingExerciseItem } from '@app-types/index';
import { TRAININGS_IDS } from '@constants/index';
import { getEmptyTrainingStateItem } from '@utils/index';
import { Button, Drawer, Row } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';

import { AddExercisesModalItem } from './add-exercises-modal-item';

import './add-exercises-modal.scss';

type TAddExercisesModalProps = {
    isShow: boolean;
    isEditExercises: boolean;
    isCantEdit: boolean;
    initialExercises: TTrainingExerciseItem[];
    title: string;
    startModalContent?: ReactNode;
    footer?: ReactNode;
    isFinishedItem: boolean;
    isFutureDay: boolean;
    isShowTextLastEdit?: boolean;
    dayToView: string;
    closeAddExercisesCb: (exercises: TTrainingExerciseItem[]) => void;
    updateExercisesInfoCb?: (exercises: TTrainingExerciseItem[]) => void;
};

export const AddExercisesModal: React.FC<TAddExercisesModalProps> = memo(
    ({
        isShow,
        isEditExercises,
        isCantEdit,
        initialExercises,
        title = '',
        startModalContent,
        isFinishedItem,
        isFutureDay,
        dayToView,
        isShowTextLastEdit = true,
        closeAddExercisesCb,
        updateExercisesInfoCb,
        footer = null,
    }) => {
        const [exercises, setExercises] = useState<TTrainingExerciseItem[]>(initialExercises);

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
            setExercises((prev) => [...prev, getEmptyTrainingStateItem()]);
        }, []);

        const changeExercisesInfoCB = useCallback(
            (ind: number, excInfo: TExerciseNewInfo) => {
                setExercises((prev) => {
                    const newExercises = [...prev];

                    newExercises[ind] = {
                        ...excInfo,
                        isImplementation: newExercises[ind].isImplementation,
                    };

                    if (updateExercisesInfoCb) {
                        updateExercisesInfoCb(newExercises);
                    }

                    return newExercises;
                });
            },
            [updateExercisesInfoCb],
        );

        const removeExercisesCb = useCallback(() => {
            setExercises((prev) => {
                const newExercises = [...prev].filter((item) => !item.isChecked);

                if (updateExercisesInfoCb) {
                    updateExercisesInfoCb(newExercises);
                }

                return newExercises;
            });
        }, [updateExercisesInfoCb]);

        const closeExercisesModal = useCallback(() => {
            closeAddExercisesCb(exercises);
        }, [closeAddExercisesCb, exercises]);

        return (
            <Drawer
                destroyOnClose={true}
                data-test-id={TRAININGS_IDS.modalExercise}
                closeIcon={<CloseOutlined data-test-id={TRAININGS_IDS.modalExerciseCloseBtn} />}
                className='drawer-site add-exercises-modal'
                title={
                    <Fragment>
                        {isEditExercises ? <EditOutlined /> : <PlusOutlined />}
                        <span className='exercises-title'>{title}</span>
                    </Fragment>
                }
                placement='right'
                onClose={closeExercisesModal}
                open={isShow}
                footer={footer}
            >
                {startModalContent}

                {exercises.map(
                    ({ name, approaches, weight, replays, isChecked = false }, index: number) => (
                        <AddExercisesModalItem
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
                            isEdit={isEditExercises}
                        />
                    ),
                )}

                {!isFinishedItem && (
                    <Row className='buttons-wrapper'>
                        <Button type='text' className='add-more' onClick={addNewExerciseCb}>
                            <PlusOutlined />
                            <span>Добавить ещё</span>
                        </Button>

                        {isEditExercises && (
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

                {isShowTextLastEdit && !isFutureDay && isCantEdit && (
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
