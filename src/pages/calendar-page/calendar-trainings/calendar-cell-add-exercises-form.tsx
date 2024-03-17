import { memo, useCallback, useContext } from 'react';
import { Checkbox, Form, Input, InputNumber, Row } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CellDayContext } from './calendar-cell-context';
import {
    TCellDayContext,
    TCellNewExercisesFormProps,
    TExerciseInfo,
    TExerciseNewInfo,
} from './types';

export const CellAddNewExercises: React.FC<TCellNewExercisesFormProps> = memo(
    ({
        changeExercisesInfoCB,
        keyItem,
        name = '',
        weight = 0,
        approaches = 1,
        replays = 1,
        isChecked = false,
        isFinished = false,
    }) => {
        const { isEdit } = useContext(CellDayContext) as TCellDayContext;

        const updateData = useCallback(
            (key: keyof TExerciseInfo, val: unknown) => {
                if (isFinished) return;
                const itemData: TExerciseNewInfo = {
                    name: name,
                    approaches: approaches || 1,
                    replays: replays || 1,
                    weight: weight || 0,
                    isChecked: isChecked,
                };

                itemData[key] = val as never;
                changeExercisesInfoCB(keyItem, itemData);
            },
            [
                keyItem,
                name,
                approaches,
                replays,
                weight,
                isChecked,
                changeExercisesInfoCB,
                isFinished,
            ],
        );

        const changeName: React.ChangeEventHandler<HTMLInputElement> = useCallback(
            (event) => {
                const newValue = event.target.value || '';
                updateData('name', newValue);
            },
            [updateData],
        );

        const changeChecked = useCallback(
            (event: CheckboxChangeEvent) => {
                updateData('isChecked', event.target.checked);
            },
            [updateData],
        );

        const changeApproaches = useCallback(
            (newApproach: number | null) => {
                const newValue = newApproach || 1;
                updateData('approaches', +newValue);
            },
            [updateData],
        );

        const changeWeight = useCallback(
            (newWeight: number | null) => {
                const newValue = newWeight || 0;
                updateData('weight', +newValue);
            },
            [updateData],
        );

        const changeReplays = useCallback(
            (newReplays: number | null) => {
                const newValue = newReplays || 1;
                updateData('replays', +newValue);
            },
            [updateData],
        );

        const innerInput =
            !isFinished && isEdit ? (
                <Checkbox
                    onChange={changeChecked}
                    checked={isChecked}
                    data-test-id={`modal-drawer-right-checkbox-exercise${keyItem}`}
                />
            ) : null;

        return (
            <Row align='stretch' className='exercise-fields' justify='space-between'>
                <Input
                    disabled={isFinished}
                    data-test-id={`modal-drawer-right-input-exercise${keyItem}`}
                    addonAfter={innerInput}
                    placeholder='Упражнение'
                    value={name}
                    onChange={changeName}
                    className='exercise-fields__name'
                />

                <Form.Item colon={false} label='Подходы' className='exercise-fields__approaches'>
                    <InputNumber
                        disabled={isFinished}
                        data-test-id={`modal-drawer-right-input-approach${keyItem}`}
                        addonBefore='+'
                        value={approaches}
                        step={1}
                        min={1}
                        onChange={changeApproaches}
                        name='approaches'
                    />
                </Form.Item>

                <Form.Item colon={false} label='Вес, кг' className='exercise-fields__weight'>
                    <InputNumber
                        disabled={isFinished}
                        data-test-id={`modal-drawer-right-input-weight${keyItem}`}
                        value={weight}
                        step={1}
                        min={0}
                        onChange={changeWeight}
                        name='weight'
                    />
                </Form.Item>

                <span className='multiply'>x</span>

                <Form.Item colon={false} label='Количество' className='exercise-fields__replays'>
                    <InputNumber
                        disabled={isFinished}
                        data-test-id={`modal-drawer-right-input-quantity${keyItem}`}
                        value={replays}
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
