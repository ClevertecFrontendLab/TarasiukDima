import { memo, useContext } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Badge, Button, Drawer, Row } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import { CellAddNewExercises } from './calendar-trainings-add-exercises-form';
import { getTrainingBadgeStatusColor } from '@utils/index';
import { DATE_FORMAT_TO_VIEW } from '@constants/index';
import { TSimpleFn } from '@app_types/index';
import { TUpdateTrainingExercisesCB } from './types';
import { CellDayContext, TCellDayContext } from './calendar-trainings-cell';

type TCellAddNewExercisesProps = {
    isShow: boolean;
    trainingName: string;
    countExercisesForm: number;

    changeExercisesInfoCB: TUpdateTrainingExercisesCB;
    closeAddExercises: TSimpleFn;
    addNewExerciseCb: TSimpleFn;
};

export const CellAddExercisesModal: React.FC<TCellAddNewExercisesProps> = memo(
    ({
        isShow,
        trainingName,
        countExercisesForm,

        changeExercisesInfoCB,
        closeAddExercises,
        addNewExerciseCb,
    }) => {
        const { isEdit, dayData, date } = useContext(CellDayContext) as TCellDayContext;

        return (
            <Drawer
                className='exercises-modal'
                title={
                    <>
                        <PlusOutlined />
                        <span className='exercises-title'>Добавление упражнений</span>
                    </>
                }
                placement='right'
                onClose={closeAddExercises}
                open={isShow}
            >
                <Row className='exercises-modal__var-info' justify='space-between' align='middle'>
                    <Badge
                        className='exercises-modal__var-info_badge'
                        color={getTrainingBadgeStatusColor(trainingName)}
                        text={trainingName}
                    />
                    <Paragraph className='exercises-modal__var-info_date'>
                        {date.format(DATE_FORMAT_TO_VIEW)}
                    </Paragraph>
                </Row>

                {Array.from({ length: countExercisesForm }).map((_, keyItem: number) => (
                    <CellAddNewExercises
                        key={keyItem}
                        keyItem={keyItem}
                        changeExercisesInfoCB={changeExercisesInfoCB}
                    />
                ))}

                <Button type='text' className='add-more' onClick={addNewExerciseCb}>
                    <PlusOutlined />
                    <span>Добавить ещё</span>
                </Button>
            </Drawer>
        );
    },
);
