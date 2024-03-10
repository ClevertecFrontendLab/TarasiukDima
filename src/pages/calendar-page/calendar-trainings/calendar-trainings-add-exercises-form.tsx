import { memo, useCallback, useContext, useState } from 'react';
import { Checkbox, Form, Input, InputNumber, Row } from 'antd';
import { CellDayContext, TCellDayContext } from './calendar-cell-context';
import { TExerciseInfo, TUpdateTrainingExercisesCB } from './types';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

type TCellAddNewExercisesProps = {
    name?: string;
    weight?: number;
    approaches?: number;
    replays?: number;
    keyItem: number;

    changeExercisesInfoCB: TUpdateTrainingExercisesCB;
};

export const CellAddNewExercises: React.FC<TCellAddNewExercisesProps> = memo(
    ({ changeExercisesInfoCB, keyItem, name = '', weight = 0, approaches = 1, replays = 1 }) => {
        const { isEdit } = useContext(CellDayContext) as TCellDayContext;

        const [exerciseName, setExerciseName] = useState(name);
        const [exerciseChecked, setExerciseChecked] = useState(false);
        const [exerciseApproaches, setExerciseApproaches] = useState(approaches);
        const [exerciseWeight, setExerciseWeight] = useState(weight);
        const [exerciseReplays, setExerciseReplays] = useState(replays);

        const updateData = useCallback(
            (key: keyof TExerciseInfo, val: unknown) => {
                const itemData: TExerciseInfo = {
                    name: exerciseName,
                    approaches: exerciseApproaches || 1,
                    replays: exerciseReplays || 1,
                    weight: exerciseWeight || 0,

                    isChecked: exerciseChecked,
                };

                itemData[key] = val as never;

                changeExercisesInfoCB(keyItem, itemData);
            },
            [
                keyItem,
                exerciseName,
                exerciseApproaches,
                exerciseReplays,
                exerciseWeight,
                exerciseChecked,
                changeExercisesInfoCB,
            ],
        );

        const changeNameExercise: React.ChangeEventHandler<HTMLInputElement> = useCallback(
            (event) => {
                const newValue = event.target.value || '';
                setExerciseName(newValue);
                updateData('name', newValue);
            },
            [updateData],
        );

        const changeCheckedExercise = useCallback(
            (event: CheckboxChangeEvent) => {
                const newValue = event.target.checked;
                setExerciseChecked(newValue);
                updateData('isChecked', newValue);
            },
            [updateData],
        );

        const changeApproaches = useCallback(
            (newApproach: number | null) => {
                const newValue = newApproach || 1;
                setExerciseApproaches(+newValue);
                updateData('approaches', +newValue);
            },
            [updateData],
        );

        const changeWeight = useCallback(
            (newWeight: number | null) => {
                const newValue = newWeight || 0;
                setExerciseWeight(+newValue);
                updateData('weight', +newValue);
            },
            [updateData],
        );

        const changeReplays = useCallback(
            (newReplays: number | null) => {
                const newValue = newReplays || 1;
                setExerciseReplays(+newValue);
                updateData('replays', +newValue);
            },
            [updateData],
        );

        return (
            <Row align='stretch' className='exercise-fields' justify='space-between'>
                <Input
                    data-test-id={`modal-drawer-right-input-exercise${keyItem}`}
                    addonAfter={
                        isEdit ? (
                            <Checkbox
                                onChange={changeCheckedExercise}
                                checked={exerciseChecked}
                                data-test-id={`modal-drawer-right-checkbox-exercise${keyItem}`}
                            />
                        ) : null
                    }
                    placeholder='Упражнение'
                    value={exerciseName}
                    onChange={changeNameExercise}
                    className='exercise-fields__name'
                />

                <Form.Item colon={false} label='Подходы' className='exercise-fields__approaches'>
                    <InputNumber
                        data-test-id={`modal-drawer-right-input-approach${keyItem}`}
                        addonBefore='+'
                        value={exerciseApproaches}
                        step={1}
                        min={1}
                        onChange={changeApproaches}
                        name='approaches'
                    />
                </Form.Item>

                <Form.Item colon={false} label='Вес, кг' className='exercise-fields__weight'>
                    <InputNumber
                        data-test-id={`modal-drawer-right-input-weight${keyItem}`}
                        value={exerciseWeight}
                        step={1}
                        min={0}
                        onChange={changeWeight}
                        name='weight'
                    />
                </Form.Item>

                <span className='multiply'>x</span>

                <Form.Item colon={false} label='Количество' className='exercise-fields__replays'>
                    <InputNumber
                        data-test-id={`modal-drawer-right-input-quantity${keyItem}`}
                        value={exerciseReplays}
                        step={1}
                        min={1}
                        onChange={changeReplays}
                        name='replays'
                    />
                </Form.Item>
            </Row>
        );
    },
);
