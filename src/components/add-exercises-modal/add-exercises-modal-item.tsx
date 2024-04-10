import { memo, useCallback } from 'react';
import { TExerciseInfo, TExerciseNewInfo } from '@app-types/index';
import { TRAININGS_IDS } from '@constants/index';
import { Checkbox, Form, Input, InputNumber, Row } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

type TAddExercisesItemProps = {
    name?: string;
    weight?: number;
    approaches?: number;
    replays?: number;
    keyItem: number;
    testIdIndex: number;
    isChecked?: boolean;
    isFinished?: boolean;
    isEdit?: boolean;

    changeExercisesInfoCB: (ind: number, excInfo: TExerciseNewInfo) => void;
};

export const AddExercisesModalItem: React.FC<TAddExercisesItemProps> = memo(
    ({
        changeExercisesInfoCB,
        keyItem,
        testIdIndex,
        name = '',
        weight = 0,
        approaches = 1,
        replays = 1,
        isChecked = false,
        isFinished = false,
        isEdit = false,
    }) => {
        const updateData = useCallback(
            (key: keyof TExerciseInfo, val: unknown) => {
                if (isFinished) return;
                const itemData: TExerciseNewInfo = {
                    name,
                    approaches: approaches || 1,
                    replays: replays || 1,
                    weight: weight || 0,
                    isChecked,
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
                    data-test-id={TRAININGS_IDS.modalExerciseCheckbox + testIdIndex}
                />
            ) : null;

        return (
            <Row align='stretch' className='add-exercises-modal__fields' justify='space-between'>
                <Input
                    disabled={isFinished}
                    data-test-id={TRAININGS_IDS.modalExerciseNameInput + testIdIndex}
                    addonAfter={innerInput}
                    placeholder='Упражнение'
                    value={name}
                    onChange={changeName}
                    className='add-exercises-modal__fields_name'
                />

                <Form.Item
                    colon={false}
                    label='Подходы'
                    className='add-exercises-modal__fields_approaches'
                >
                    <InputNumber
                        disabled={isFinished}
                        data-test-id={TRAININGS_IDS.modalExerciseApproachInput + testIdIndex}
                        addonBefore='+'
                        value={approaches}
                        step={1}
                        min={1}
                        onChange={changeApproaches}
                        name='approaches'
                    />
                </Form.Item>

                <Form.Item
                    colon={false}
                    label='Вес, кг'
                    className='add-exercises-modal__fields_weight'
                >
                    <InputNumber
                        disabled={isFinished}
                        data-test-id={TRAININGS_IDS.modalExerciseWeightInput + testIdIndex}
                        value={weight}
                        step={1}
                        min={0}
                        onChange={changeWeight}
                        name='weight'
                    />
                </Form.Item>

                <span className='multiply'>x</span>

                <Form.Item
                    colon={false}
                    label='Количество'
                    className='add-exercises-modal__fields_replays'
                >
                    <InputNumber
                        disabled={isFinished}
                        data-test-id={TRAININGS_IDS.modalExerciseQuantityInput + testIdIndex}
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
