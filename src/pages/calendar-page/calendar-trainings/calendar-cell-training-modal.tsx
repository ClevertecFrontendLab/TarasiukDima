import { memo, useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useGetSavedTraining } from '@hooks/index';
import { DEFAULT_TRAINING_NAME_VARIANT, TRAININGS_IDS } from '@constants/index';
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

        closeCb,
        saveExercisesCb,
        showAddExercisesCb,
        showEditExerciseCb,
    }) => {
        const {
            dayChangedInfo,
            dayFullInfo,
            curDay,
            trainingVariants,
            chosenVariantTraining,
            changeTrainingVariantCb,
        } = useContext(CellDayContext) as TCellDayContext;
        const { getSavedTrainingByDay } = useGetSavedTraining();

        const [defaultSelectValue, setDefaultSelectValue] = useState(
            chosenVariantTraining ?? DEFAULT_TRAINING_NAME_VARIANT,
        );

        const savedTrainings = getSavedTrainingByDay(curDay);
        const addedTrainingNames = Object.keys(dayFullInfo);

        const trainingItems = useMemo(() => {
            const items: TCalendarTrainingListItem[] = [];
            if (
                chosenVariantTraining &&
                (dayChangedInfo[chosenVariantTraining] || dayFullInfo[chosenVariantTraining])
            ) {
                const trainingDay =
                    dayChangedInfo[chosenVariantTraining] ?? dayFullInfo[chosenVariantTraining];
                trainingDay.exercises.forEach((exerciseItem, index) => {
                    items.push({
                        name: exerciseItem.name,
                        index,
                    });
                });
            }

            return items;
        }, [chosenVariantTraining, dayChangedInfo, dayFullInfo]);

        const variantsTrainingForChoose = useMemo(() => {
            return trainingVariants
                .map((item) => {
                    return {
                        value: item.name,
                        label: item.name,
                    };
                })
                .filter((item) => !addedTrainingNames.includes(item.label));
        }, [addedTrainingNames, trainingVariants]);

        const { isDisabledChoseTrainingName, isTrainingVariantExist } = useMemo(() => {
            let isTrainingVariantExist = false;

            let isDisabled = false;
            savedTrainings.forEach((item) => {
                if (item.name === defaultSelectValue) {
                    isDisabled = true;
                    isTrainingVariantExist = true;
                }
            });

            return { isDisabledChoseTrainingName: isDisabled, isTrainingVariantExist };
        }, [savedTrainings, defaultSelectValue]);

        const isCanSaveExercises =
            dayChangedInfo[chosenVariantTraining as string]?.isChanged || false;

        const disabledSaveBtn = useMemo(() => {
            const disabledSaveBtn = !isCanSaveExercises || isLoading;

            if (isTrainingVariantExist || !chosenVariantTraining) {
                return disabledSaveBtn;
            }

            const exercises = dayChangedInfo[chosenVariantTraining]?.exercises || [];
            // eslint-disable-next-line no-extra-boolean-cast
            const emptyExercises = exercises ? !Boolean(exercises.length) : true;
            return disabledSaveBtn || emptyExercises;
        }, [
            isTrainingVariantExist,
            chosenVariantTraining,
            dayChangedInfo,
            isCanSaveExercises,
            isLoading,
        ]);

        useEffect(() => {
            if (chosenVariantTraining) {
                setDefaultSelectValue(chosenVariantTraining);
            } else {
                setDefaultSelectValue(DEFAULT_TRAINING_NAME_VARIANT);
            }
        }, [chosenVariantTraining]);

        return (
            <Modal
                data-test-id={TRAININGS_IDS.modalCreate}
                className='cell-content__modal add-new-modal'
                open={isShow}
                closeIcon={<CloseOutlined data-test-id={TRAININGS_IDS.modalCreateCloseBtn} />}
                closable={false}
                getContainer={refEl}
                onCancel={closeCb}
                title={
                    <Row justify='start' align='middle' className='add-new-modal__head'>
                        <Button type='text' className='back-button' onClick={closeCb}>
                            <ArrowLeftOutlined />
                        </Button>

                        <Select
                            data-test-id={TRAININGS_IDS.modalCreateSelect}
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
                    !Boolean(trainingItems.length) ? (
                        <EmptyIcon />
                    ) : (
                        <CalendarTrainingList
                            items={trainingItems}
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
