import { memo, useContext, useMemo } from 'react';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Button, Drawer, Row } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import { CellAddNewExercises } from './calendar-trainings-add-exercises-form';
import { getTrainingBadgeStatusColor } from '@utils/index';
import { DATE_FORMAT_TO_VIEW } from '@constants/index';
import { TSimpleFn } from '@app_types/index';
import { TUpdateTrainingExercisesCB } from './types';
import { CellDayContext, TCellDayContext } from './calendar-cell-context';

type TCellAddNewExercisesProps = {
    isShow: boolean;
    trainingName: string;
    countExercisesForm: number;

    changeExercisesInfoCB: TUpdateTrainingExercisesCB;
    closeAddExercises: TSimpleFn;
    addNewExerciseCb: TSimpleFn;
    removeHandlerCB: TSimpleFn;
};

export const CellAddExercisesModal: React.FC<TCellAddNewExercisesProps> = memo(
    ({
        isShow,
        trainingName,
        countExercisesForm,

        changeExercisesInfoCB,
        closeAddExercises,
        addNewExerciseCb,
        removeHandlerCB,
    }) => {
        const { isEdit, dayData, chosenVariantTraining, date } = useContext(
            CellDayContext,
        ) as TCellDayContext;

        const { disableRemove, chosenExercises } = useMemo(() => {
            const chosenExercises =
                chosenVariantTraining &&
                dayData[chosenVariantTraining] &&
                dayData[chosenVariantTraining].exercises
                    ? dayData[chosenVariantTraining].exercises
                    : [];

            let disableRemove = true;
            chosenExercises.forEach((item) => {
                if (item.isChecked) {
                    disableRemove = false;
                }
            });
            return { disableRemove, chosenExercises };
        }, [chosenVariantTraining, dayData]);

        return (
            <Drawer
                data-test-id='modal-drawer-right'
                closeIcon={<CloseOutlined data-test-id='modal-drawer-right-button-close' />}
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

                {chosenExercises.length
                    ? chosenExercises.map(
                          ({ name, approaches, weight, replays }, keyItem: number) => (
                              <CellAddNewExercises
                                  key={keyItem}
                                  keyItem={keyItem}
                                  changeExercisesInfoCB={changeExercisesInfoCB}
                                  name={name}
                                  weight={weight}
                                  approaches={approaches}
                                  replays={replays}
                              />
                          ),
                      )
                    : Array.from({ length: countExercisesForm }).map((_, keyItem: number) => (
                          <CellAddNewExercises
                              key={keyItem}
                              keyItem={keyItem}
                              changeExercisesInfoCB={changeExercisesInfoCB}
                          />
                      ))}

                <Row className='buttons-wrapper'>
                    <Button type='text' className='add-more' onClick={addNewExerciseCb}>
                        <PlusOutlined />
                        <span>Добавить ещё</span>
                    </Button>

                    {isEdit && (
                        <Button
                            type='text'
                            className='remove'
                            disabled={disableRemove}
                            onClick={removeHandlerCB}
                        >
                            <MinusOutlined />
                            <span>Удалить</span>
                        </Button>
                    )}
                </Row>
            </Drawer>
        );
    },
);
