import { memo, useContext } from 'react';
import { CellDayContext, TCellDayContext } from './calendar-cell-context';
import { Button, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Paragraph from 'antd/lib/typography/Paragraph';
import { EmptyIcon } from './empty';
import { CalendarTrainingList, TCalendarTrainingListItem } from './calendar-trainings-list';
import { TTrainingEditButtonCb } from './types';
import { TSimpleFn } from '@app_types/index';

type TCellTrainingDayModalProps = {
    isShow: boolean;
    isEmptyDay: boolean;
    addNewDisabled: boolean;
    refEl: HTMLElement;
    date: string;

    closeCb: TSimpleFn;
    editTrainingCb: TTrainingEditButtonCb;
    addNewTrainingCb: TSimpleFn;
};

export const CellTrainingDayModal: React.FC<TCellTrainingDayModalProps> = memo(
    ({
        isShow,
        isEmptyDay,
        addNewDisabled,
        refEl,
        closeCb,
        date,
        addNewTrainingCb,
        editTrainingCb,
    }) => {
        const { dayData, isFutureDay } = useContext(CellDayContext) as TCellDayContext;

        const items: TCalendarTrainingListItem[] = [];
        let index = 0;
        for (const key in dayData) {
            const disabled = isFutureDay ? false : dayData[key].isImplementation ? true : false;

            items.push({
                name: key,
                disabled: disabled,
                index,
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
                title={`Тренировки на ${date}`}
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
