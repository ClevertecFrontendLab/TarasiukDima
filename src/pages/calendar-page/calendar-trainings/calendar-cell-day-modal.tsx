import { memo, useContext, useMemo } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { TTrainingListViewItem } from '@app-types/index';
import { EmptyIcon, TrainingList } from '@components/index';
import { TRAININGS_IDS } from '@constants/index';
import { useIsMobile } from '@hooks/index';
import { Button, Modal } from 'antd';

import { CellDayContext } from './calendar-cell-context';
import { TCellDayContext, TCellDayModalProps } from './types';

export const CellDayModal: React.FC<TCellDayModalProps> = memo(
    ({ isShow, refEl, closeCb, addNewTrainingCb, editTrainingCb }) => {
        const isMobile = useIsMobile();
        const { trainingDayToShow, dayFullInfo, isFutureDay, trainingVariants } = useContext(
            CellDayContext,
        ) as TCellDayContext;

        const addedTrainingNames = Object.keys(dayFullInfo);
        // eslint-disable-next-line no-extra-boolean-cast
        const isEmptyDay = !Boolean(addedTrainingNames.length);
        const addNewDisabled =
            !isFutureDay || trainingVariants.length === addedTrainingNames.length;
        const trainingItems: TTrainingListViewItem[] = useMemo(() => {
            const items: TTrainingListViewItem[] = [];

            Object.keys(dayFullInfo).forEach((key, index) => {
                items.push({
                    name: key,
                    index,
                    isFinished: dayFullInfo[key].isImplementation,
                });
            });

            return items;
        }, [dayFullInfo]);

        return (
            <Modal
                destroyOnClose={true}
                data-test-id={TRAININGS_IDS.modalTraining}
                className='cell-content__modal day-modal'
                open={isShow}
                closable={true}
                closeIcon={<CloseOutlined data-test-id={TRAININGS_IDS.modalTrainingCloseBtn} />}
                getContainer={isMobile ? false : refEl}
                centered={!!isMobile}
                onCancel={closeCb}
                title={`Тренировки на ${trainingDayToShow}`}
                maskStyle={{
                    backgroundColor: 'transparent',
                }}
                footer={
                    <Button
                        type='primary'
                        disabled={addNewDisabled}
                        onClick={addNewTrainingCb}
                        className='btn add-training'
                    >
                        Создать тренировку
                        {/* {isEmptyDay ? 'Создать тренировку' : 'Добавить тренировку'} */}
                    </Button>
                }
            >
                {isEmptyDay ? (
                    <EmptyIcon classNameText='modal-no-text' text='Нет активных тренировок' />
                ) : (
                    <TrainingList
                        items={trainingItems}
                        editButtonCb={editTrainingCb}
                        needButtonEdit={true}
                        className='training__list training__info_list'
                    />
                )}
            </Modal>
        );
    },
);
