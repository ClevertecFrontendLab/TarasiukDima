import { FC, memo, useContext, useEffect, useMemo, useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
    TSimpleFn,
    TTrainingListViewItem,
    TTrainingNameChosenIVariant,
    TTrainingVariants,
} from '@app-types/index';
import { EmptyIcon } from '@components/epmty-icon';
import { TrainingList } from '@components/index';
import { DEFAULT_TRAINING_NAME_VARIANT, TRAININGS_IDS } from '@constants/index';
import { Button, Modal, Row, Select } from 'antd';

import { TrainingsContext } from '../trainings-context';
import { TTrainingsContent } from '../types';

type TTrainingDayModalProps = {
    refEl: HTMLElement;
    isShow: boolean;
    trainingVariants: TTrainingVariants;

    closeCb: TSimpleFn;
    showAddExercisesCb: TSimpleFn;
};

export const TrainingDayModal: FC<TTrainingDayModalProps> = memo(
    ({
        refEl,
        trainingVariants,
        isShow,

        closeCb,
        showAddExercisesCb,
    }) => {
        const { chosenVariantTraining, trainingDayChangedInfo, trainingDayFullInfo } = useContext(
            TrainingsContext,
        ) as TTrainingsContent;

        const [defaultSelectValue, setDefaultSelectValue] = useState(
            chosenVariantTraining ?? DEFAULT_TRAINING_NAME_VARIANT,
        );

        const trainingItems = useMemo(() => {
            const items: TTrainingListViewItem[] = [];

            if (
                chosenVariantTraining &&
                (trainingDayChangedInfo[chosenVariantTraining] ||
                    trainingDayFullInfo[chosenVariantTraining])
            ) {
                const trainingDay =
                    trainingDayChangedInfo[chosenVariantTraining] ??
                    trainingDayFullInfo[chosenVariantTraining];

                trainingDay.exercises.forEach((exerciseItem, index) => {
                    items.push({
                        name: exerciseItem.name,
                        index,
                    });
                });
            }

            return items;
        }, [chosenVariantTraining, trainingDayChangedInfo, trainingDayFullInfo]);

        const variantsTrainingForChoose = useMemo(() => {
            const addedTrainingNames = Object.keys(trainingDayFullInfo);

            return trainingVariants
                .map((item) => ({
                    value: item.name,
                    label: item.name,
                }))
                .filter((item) => !addedTrainingNames.includes(item.label));
        }, [trainingDayFullInfo, trainingVariants]);

        useEffect(() => {
            if (chosenVariantTraining) {
                setDefaultSelectValue(chosenVariantTraining);
            } else {
                setDefaultSelectValue(DEFAULT_TRAINING_NAME_VARIANT);
            }
        }, [chosenVariantTraining]);

        return (
            <Modal
                transitionName=''
                maskTransitionName=''
                maskStyle={{
                    backgroundColor: 'transparent',
                }}
                destroyOnClose={true}
                data-test-id={TRAININGS_IDS.modalCreate}
                className='cell-content__modal add-new-modal'
                open={isShow}
                closable={false}
                getContainer={refEl}
                centered={false}
                onCancel={closeCb}
                title={
                    <Row
                        justify='start'
                        align='middle'
                        className='add-new-modal__head'
                        id='select-wrapper'
                    >
                        <Button
                            type='text'
                            className='back-button'
                            onClick={closeCb}
                            data-test-id={TRAININGS_IDS.modalCreateCloseBtn}
                        >
                            <ArrowLeftOutlined />
                        </Button>

                        <Select
                            data-test-id={TRAININGS_IDS.modalCreateSelect}
                            value={defaultSelectValue as TTrainingNameChosenIVariant}
                            disabled={true}
                            options={variantsTrainingForChoose}
                            getPopupContainer={() =>
                                document.getElementById('select-wrapper') as HTMLDivElement
                            }
                        />
                    </Row>
                }
                footer={
                    <Button type='default' className='add-training' onClick={showAddExercisesCb}>
                        Добавить упражнения
                    </Button>
                }
            >
                {
                    // eslint-disable-next-line no-extra-boolean-cast, no-negated-condition
                    !Boolean(trainingItems.length) ? (
                        <EmptyIcon />
                    ) : (
                        <TrainingList
                            items={trainingItems}
                            needButtonEdit={true}
                            className='training__list'
                        />
                    )
                }
            </Modal>
        );
    },
);
