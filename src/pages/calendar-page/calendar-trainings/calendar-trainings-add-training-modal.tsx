import { memo, useContext, useEffect, useState } from 'react';
import { CellDayContext, TCellDayContext } from './calendar-cell-context';
import { Button, Modal, Row, Select } from 'antd';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { EmptyIcon } from './empty';
import { DEFAULT_TRAINING_NAME_VARIANT } from '@constants/index';
import { CalendarTrainingList, TCalendarTrainingListItem } from './calendar-trainings-list';
import { TSimpleFn } from '@app_types/index';
import { TVariantChosenItem } from './types';

type TCellAddTrainingModalProps = {
    isShow: boolean;
    isLoading: boolean;
    isCanSaveExercises: boolean;
    refEl: HTMLElement;

    closeCb: TSimpleFn;
    saveExercisesCb: TSimpleFn;
    showAddExercisesCb: TSimpleFn;
};

export const CellAddTrainingModal: React.FC<TCellAddTrainingModalProps> = memo(
    ({
        isShow,
        isLoading,
        isCanSaveExercises,
        refEl,

        closeCb,
        saveExercisesCb,
        showAddExercisesCb,
    }) => {
        const {
            dayData,
            trainingVariants,
            chosenVariantTraining,
            changeTrainingVariantCb,
            isFutureDay,
        } = useContext(CellDayContext) as TCellDayContext;
        const addedTrainingNames = Object.keys(dayData);

        const [defaultSelectValue, setDefaultSelectValue] = useState(
            chosenVariantTraining ? chosenVariantTraining : DEFAULT_TRAINING_NAME_VARIANT,
        );

        const items: TCalendarTrainingListItem[] = [];
        if (chosenVariantTraining && dayData[chosenVariantTraining]) {
            const trainingDay = dayData[chosenVariantTraining];
            const disabled = isFutureDay ? false : trainingDay.isImplementation ? true : false;

            trainingDay.exercises.forEach((exerciseItem, index) => {
                items.push({
                    name: exerciseItem.name,
                    disabled: disabled,
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
                            className='save-btn'
                            onClick={saveExercisesCb}
                            disabled={isCanSaveExercises || isLoading}
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
                            editButtonCb={showAddExercisesCb}
                            needButtonEdit
                            className='training__list'
                        />
                    )
                }
            </Modal>
        );
    },
);
