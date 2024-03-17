import { memo, useContext } from 'react';
import { useGetCurrentDayInfo } from '@hooks/index';
import { CellDayContext } from './calendar-cell-context';
import { Button, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Paragraph from 'antd/lib/typography/Paragraph';
import { EmptyIcon } from './empty';
import { CalendarTrainingList } from './calendar-trainings-list';
import { DATE_FORMAT_TO_VIEW } from '@constants/index';
import { TCalendarTrainingListItem, TCellDayContext, TCellDayModalProps } from './types';

export const CellDayModal: React.FC<TCellDayModalProps> = memo(
    ({
        isShow,
        isEmptyDay,
        refEl,
        addedTrainingNames,
        closeCb,
        addNewTrainingCb,
        editTrainingCb,
    }) => {
        const { getDateNeededFormat } = useGetCurrentDayInfo();
        const { date, dayData, isFutureDay, trainingVariants } = useContext(
            CellDayContext,
        ) as TCellDayContext;

        const addNewDisabled =
            !isFutureDay || trainingVariants.length === addedTrainingNames.length;

        const items: TCalendarTrainingListItem[] = [];

        let index = 0;
        for (const key in dayData) {
            items.push({
                name: key,
                index,
                isFinished: dayData[key].isImplementation,
            });
            index++;
        }

        return (
            <Modal
                data-test-id='modal-create-training'
                className='cell-content__modal training-modal'
                open={isShow}
                closable
                closeIcon={<CloseOutlined data-test-id='modal-create-training-button-close' />}
                getContainer={refEl}
                onCancel={closeCb}
                title={`Тренировки на ${getDateNeededFormat(date, DATE_FORMAT_TO_VIEW)}}`}
                footer={
                    <Button
                        type='primary'
                        disabled={addNewDisabled}
                        onClick={addNewTrainingCb}
                        className='btn add-training'
                    >
                        {isEmptyDay ? 'Создать тренировку' : 'Добавить тренировку'}
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
                        items={items}
                        editButtonCb={editTrainingCb}
                        needButtonEdit
                        className='training__list training__info_list'
                    />
                )}
            </Modal>
        );
    },
);
