import { Fragment, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { TTrainingListViewItem,TTrainingNameChosenIVariant } from '@app-types/index';
import { EmptyIcon } from '@components/epmty-icon';
import { TrainingList } from '@components/index';
import { DEFAULT_TRAINING_NAME_VARIANT, TRAININGS_IDS } from '@constants/index';
import { useIsMobile } from '@hooks/index';
import { Button, Modal, Row, Select } from 'antd';
import classNames from 'classnames';

import { CellDayContext } from './calendar-cell-context';
import { TCellDayContext, TCellTrainingModalProps } from './types';

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
            trainingVariants,
            chosenVariantTraining,
            changeTrainingVariantCb,
            trainingDaySavedData,
        } = useContext(CellDayContext) as TCellDayContext;

        const isMobile = useIsMobile();

        const [defaultSelectValue, setDefaultSelectValue] = useState(
            chosenVariantTraining ?? DEFAULT_TRAINING_NAME_VARIANT,
        );
        const [isShowSelect, setIsShowSelect] = useState(false);

        const trainingItems = useMemo(() => {
            const items: TTrainingListViewItem[] = [];

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
            const addedTrainingNames = Object.keys(dayFullInfo);

            return trainingVariants
                .map((item) => ({
                    value: item.name,
                    label: item.name,
                }))
                .filter((item) => !addedTrainingNames.includes(item.label));
        }, [dayFullInfo, trainingVariants]);

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
            const isCanSaveExercises =
                dayChangedInfo[chosenVariantTraining as string]?.isChanged || false;

            const disabledBtn = !isCanSaveExercises || isLoading;

            if (isTrainingVariantExist || !chosenVariantTraining) {
                return disabledBtn;
            }

            const exercises = dayChangedInfo[chosenVariantTraining]?.exercises || [];
            // eslint-disable-next-line no-extra-boolean-cast
            const emptyExercises = exercises ? !Boolean(exercises.length) : true;

            return disabledBtn || emptyExercises;
        }, [isTrainingVariantExist, chosenVariantTraining, dayChangedInfo, isLoading]);

        useEffect(() => {
            if (chosenVariantTraining) {
                setDefaultSelectValue(chosenVariantTraining);
            } else {
                setDefaultSelectValue(DEFAULT_TRAINING_NAME_VARIANT);
            }
        }, [chosenVariantTraining]);

        const changeVisibleSelect = useCallback(() => {
            setIsShowSelect((prev) => !prev);
        }, []);

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
                getContainer={isMobile ? false : refEl}
                centered={!!isMobile}
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
                            open={isShowSelect}
                            onChange={changeTrainingVariantCb}
                            onClick={changeVisibleSelect}
                            data-test-id={TRAININGS_IDS.modalCreateSelect}
                            value={defaultSelectValue as TTrainingNameChosenIVariant}
                            disabled={isDisabledChoseTrainingName}
                            options={variantsTrainingForChoose}
                            getPopupContainer={() =>
                                document.getElementById('select-wrapper') as HTMLDivElement
                            }
                        />
                    </Row>
                }
                footer={
                    <Fragment>
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
                                'is-loading': isLoading,
                            })}
                            loading={isLoading}
                            onClick={saveExercisesCb}
                            disabled={disabledSaveBtn}
                        >
                            Сохранить изменения
                        </Button>
                    </Fragment>
                }
            >
                {
                    // eslint-disable-next-line no-extra-boolean-cast, no-negated-condition
                    !Boolean(trainingItems.length) ? (
                        <EmptyIcon />
                    ) : (
                        <TrainingList
                            items={trainingItems}
                            editButtonCb={showEditExerciseCb}
                            needButtonEdit={true}
                            className='training__list'
                        />
                    )
                }
            </Modal>
        );
    },
);
