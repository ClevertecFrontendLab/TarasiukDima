import { memo, useContext, useMemo } from 'react';
import { useGetCurrentDayInfo, useIsMobile } from '@hooks/index';
import { CellDayContext } from './calendar-cell-context';
import { Button, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Paragraph from 'antd/lib/typography/Paragraph';
import { EmptyIcon } from './empty';
import { CalendarTrainingList } from './calendar-trainings-list';
import { DATE_FORMAT_TO_VIEW, TRAININGS_IDS } from '@constants/index';
import { TCalendarTrainingListItem, TCellDayContext, TCellDayModalProps } from './types';

export const CellDayModal: React.FC<TCellDayModalProps> = memo(
    ({ isShow, refEl, closeCb, addNewTrainingCb, editTrainingCb }) => {
        const isMobile = useIsMobile();
        const { getDateNeededFormat } = useGetCurrentDayInfo();
        const { date, dayFullInfo, isFutureDay, trainingVariants } = useContext(
            CellDayContext,
        ) as TCellDayContext;

        const addedTrainingNames = Object.keys(dayFullInfo);
        // eslint-disable-next-line no-extra-boolean-cast
        const isEmptyDay = !Boolean(addedTrainingNames.length);
        const addNewDisabled =
            !isFutureDay || trainingVariants.length === addedTrainingNames.length;
        const trainingItems: TCalendarTrainingListItem[] = useMemo(() => {
            const items = [];
            let index = 0;
            for (const key in dayFullInfo) {
                items.push({
                    name: key,
                    index,
                    isFinished: dayFullInfo[key].isImplementation,
                });
                index++;
            }

            return items;
        }, [dayFullInfo]);

        return (
            <Modal
                // transitionName=''
                // maskTransitionName=''
                destroyOnClose
                data-test-id={TRAININGS_IDS.modalTraining}
                className='cell-content__modal day-modal'
                open={isShow}
                closable
                closeIcon={<CloseOutlined data-test-id={TRAININGS_IDS.modalTrainingCloseBtn} />}
                getContainer={isMobile ? false : refEl}
                centered={isMobile ? true : false}
                onCancel={closeCb}
                title={`Тренировки на ${getDateNeededFormat(date, DATE_FORMAT_TO_VIEW)}`}
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
                    <>
                        <Paragraph className='modal-no-text'>Нет активных тренировок</Paragraph>
                        <EmptyIcon />
                    </>
                ) : (
                    <CalendarTrainingList
                        items={trainingItems}
                        editButtonCb={editTrainingCb}
                        needButtonEdit
                        className='training__list training__info_list'
                    />
                )}
            </Modal>
        );
    },
);
