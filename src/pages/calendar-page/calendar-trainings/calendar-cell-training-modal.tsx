import { memo, useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { DEFAULT_TRAINING_NAME_VARIANT } from '@constants/index';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Modal, Row, Select } from 'antd';
import { CellDayContext } from './calendar-cell-context';
import { CalendarTrainingList } from './calendar-trainings-list';
import { EmptyIcon } from './empty';
import {
    TCalendarTrainingListItem,
    TCellDayContext,
    TCellTrainingModalProps,
    TVariantChosenItem,
} from './types';

export const CellTrainingModal: React.FC<TCellTrainingModalProps> = memo(
    ({
        refEl,
        isShow,
        isLoading,
        isCanSaveExercises,
        daySavedTraining,

        closeCb,
        saveExercisesCb,
        showAddExercisesCb,
        showEditExerciseCb,
    }) => {
        const { dayData, trainingVariants, chosenVariantTraining, changeTrainingVariantCb } =
            useContext(CellDayContext) as TCellDayContext;
        const addedTrainingNames = Object.keys(dayData);

        const [defaultSelectValue, setDefaultSelectValue] = useState(
            chosenVariantTraining ? chosenVariantTraining : DEFAULT_TRAINING_NAME_VARIANT,
        );

        const items: TCalendarTrainingListItem[] = [];
        if (chosenVariantTraining && dayData[chosenVariantTraining]) {
            const trainingDay = dayData[chosenVariantTraining];
            trainingDay.exercises.forEach((exerciseItem, index) => {
                items.push({
                    name: exerciseItem.name,
                    index,
                });
            });
        }

        let variantsTrainingForChoose = trainingVariants.map((item) => {
            return {
                value: item.name,
                label: item.name,
            };
        });

        variantsTrainingForChoose = variantsTrainingForChoose.filter(
            (item) => !addedTrainingNames.includes(item.label),
        );

        const { isDisabledChoseTrainingName, isTrainingVariantExist } = useMemo(() => {
            let isTrainingVariantExist = false;

            let isDisabled = false;
            daySavedTraining.forEach((item) => {
                if (item.name === defaultSelectValue) {
                    isDisabled = true;
                    isTrainingVariantExist = true;
                }
            });

            return { isDisabledChoseTrainingName: isDisabled, isTrainingVariantExist };
        }, [daySavedTraining, defaultSelectValue]);

        const disabledSaveBtn = useMemo(() => {
            const disabledSaveBtn = !isCanSaveExercises || isLoading;

            if (isTrainingVariantExist || !chosenVariantTraining) {
                return disabledSaveBtn;
            }

            const exercises = dayData[chosenVariantTraining]?.exercises || [];
            // eslint-disable-next-line no-extra-boolean-cast
            const emptyExercises = exercises ? !Boolean(exercises.length) : true;
            return disabledSaveBtn || emptyExercises;
        }, [isTrainingVariantExist, chosenVariantTraining, dayData, isCanSaveExercises, isLoading]);

        useEffect(() => {
            if (chosenVariantTraining) {
                setDefaultSelectValue(chosenVariantTraining);
            } else {
                setDefaultSelectValue(DEFAULT_TRAINING_NAME_VARIANT);
            }
        }, [chosenVariantTraining]);

        return (
            <Modal
                data-test-id='modal-create-exercise'
                className='cell-content__modal add-new-modal'
                open={isShow}
                closeIcon={<CloseOutlined data-test-id='modal-exercise-training-button-close' />}
                closable={false}
                getContainer={refEl}
                onCancel={closeCb}
                title={
                    <Row justify='start' align='middle' className='add-new-modal__head'>
                        <Button type='text' className='back-button' onClick={closeCb}>
                            <ArrowLeftOutlined />
                        </Button>

                        <Select
                            data-test-id='modal-create-exercise-select'
                            value={defaultSelectValue as TVariantChosenItem}
                            disabled={isDisabledChoseTrainingName}
                            onChange={changeTrainingVariantCb}
                            options={variantsTrainingForChoose}
                        />
                    </Row>
                }
                footer={
                    <>
                        <Button
                            type='default'
                            className='add-training'
                            disabled={!chosenVariantTraining}
                            onClick={showAddExercisesCb}
                        >
                            Добавить упражнения
                        </Button>

                        <Button
                            type='default'
                            className={classNames('save-btn', {
                                ['is-loading']: isLoading,
                            })}
                            loading={isLoading}
                            onClick={saveExercisesCb}
                            disabled={disabledSaveBtn}
                        >
                            Сохранить
                        </Button>
                    </>
                }
            >
                {
                    // eslint-disable-next-line no-extra-boolean-cast
                    !Boolean(items.length) ? (
                        <EmptyIcon />
                    ) : (
                        <CalendarTrainingList
                            items={items}
                            editButtonCb={showEditExerciseCb}
                            needButtonEdit
                            className='training__list'
                        />
                    )
                }
            </Modal>
        );
    },
);
