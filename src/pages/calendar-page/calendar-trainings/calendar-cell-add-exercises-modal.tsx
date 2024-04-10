import { memo, useCallback, useContext, useMemo } from 'react';
import { TTrainingExerciseItem } from '@app-types/index';
import { AddExercisesModal } from '@components/index';
import { getEmptyTrainingStateItem, getTrainingBadgeStatusColor } from '@utils/index';
import { Badge, Row } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';

import { CellDayContext } from './calendar-cell-context';
import { TCellAddNewExercisesProps, TCellDayContext } from './types';

export const CellExercisesModal: React.FC<TCellAddNewExercisesProps> = memo(
    ({ isShow, isEditExercises, closeAddExercises, updateChangedTrainingInfoExercises }) => {
        const {
            isFutureDay,
            isFinishedItem,
            isEdit,
            dayChangedInfo,
            dayFullInfo,
            trainingDayToShow,
            chosenVariantTraining,
        } = useContext(CellDayContext) as TCellDayContext;

        const isCantEdit = !dayFullInfo[chosenVariantTraining as string]?.isImplementation || false;

        const initialExercises = useMemo(() => {
            const dataToShow =
                dayChangedInfo[chosenVariantTraining as string] ??
                dayFullInfo[chosenVariantTraining as string];

            if (dataToShow?.exercises) {
                const newState = [...(dataToShow?.exercises || [])];

                if (!isFinishedItem && !isEditExercises) {
                    newState.push(getEmptyTrainingStateItem());
                }

                return newState;
            }

            if (!isFinishedItem) {
                return [getEmptyTrainingStateItem()];
            }

            return [];
        }, [chosenVariantTraining, dayChangedInfo, dayFullInfo, isEditExercises, isFinishedItem]);

        const closeExercisesModal = useCallback(
            (exercises: TTrainingExerciseItem[]) => {
                updateChangedTrainingInfoExercises(exercises);
                closeAddExercises();
            },
            [updateChangedTrainingInfoExercises, closeAddExercises],
        );

        return (
            <AddExercisesModal
                closeAddExercisesCb={closeExercisesModal}
                dayToView={trainingDayToShow}
                initialExercises={initialExercises}
                isEditExercises={isEdit}
                isCantEdit={isCantEdit}
                isFinishedItem={isFinishedItem}
                isFutureDay={isFutureDay}
                isShow={isShow}
                title={isEdit ? 'Редактирование' : 'Добавление упражнений'}
                startModalContent={
                    <Row
                        className='add-exercises-modal__var-info'
                        justify='space-between'
                        align='middle'
                    >
                        <Badge
                            className='add-exercises-modal__var-info_badge'
                            color={getTrainingBadgeStatusColor(chosenVariantTraining as string)}
                            text={chosenVariantTraining}
                        />
                        <Paragraph className='add-exercises-modal__var-info_date'>
                            {trainingDayToShow}
                        </Paragraph>
                    </Row>
                }
            />
        );
    },
);
