import { memo, useCallback, useState } from 'react';
import { Form, Input, InputNumber, Row } from 'antd';
import { TTrainingExercise } from '@app_types/training';

type TCellAddNewExercisesProps = {
    keyItem: number;
    changeExercisesInfoCB: (ind: number, excInfo: TTrainingExercise) => void;
};

export const CellAddNewExercises: React.FC<TCellAddNewExercisesProps> = memo(
    ({ changeExercisesInfoCB, keyItem }) => {
        const [nameExercise, setNameExercise] = useState('');
        const [approaches, setApproaches] = useState(1);
        const [replays, setReplays] = useState(1);
        const [weight, setWeight] = useState(0);

        const changeNameExercise: React.ChangeEventHandler<HTMLInputElement> = useCallback(
            (event) => {
                const newValue = event.target.value || '';
                setNameExercise(newValue);
                changeExercisesInfoCB(keyItem, {
                    name: newValue,
                    approaches: approaches || 1,
                    replays: replays || 1,
                    weight: weight || 0,
                    isImplementation: false,
                });
            },
            [approaches, changeExercisesInfoCB, keyItem, weight, replays],
        );

        const changeWeight = useCallback(
            (event: number | null) => {
                const newValue = event || 0;
                setWeight(+newValue);
                changeExercisesInfoCB(keyItem, {
                    name: nameExercise,
                    approaches: approaches || 1,
                    replays: replays || 1,
                    weight: +newValue,
                    isImplementation: false,
                });
            },
            [approaches, changeExercisesInfoCB, keyItem, nameExercise, replays],
        );

        const changeApproaches = useCallback(
            (event: number | null) => {
                const newValue = event || 1;
                console.log('event', event);
                setApproaches(+newValue);
                changeExercisesInfoCB(keyItem, {
                    name: nameExercise,
                    approaches: +newValue,
                    replays: replays || 1,
                    weight: weight || 0,
                    isImplementation: false,
                });
            },
            [weight, changeExercisesInfoCB, keyItem, nameExercise, replays],
        );

        const changeReplays = useCallback(
            (event: number | null) => {
                const newValue = event || 1;
                setReplays(+newValue);
                changeExercisesInfoCB(keyItem, {
                    name: nameExercise,
                    approaches: approaches || 1,
                    replays: +newValue,
                    weight: weight || 0,
                    isImplementation: false,
                });
            },
            [approaches, changeExercisesInfoCB, keyItem, nameExercise, weight],
        );

        return (
            <Row align='stretch' className='exercise-fields' justify='space-between'>
                <Input
                    placeholder='Упражнение'
                    onChange={changeNameExercise}
                    className='exercise-fields__name'
                />

                <Form.Item colon={false} label='Подходы' className='exercise-fields__approaches'>
                    <InputNumber
                        addonBefore='+'
                        defaultValue={1}
                        step={1}
                        min={1}
                        onChange={changeApproaches}
                        name='approaches'
                    />
                </Form.Item>

                <Form.Item colon={false} label='Вес, кг' className='exercise-fields__weight'>
                    <InputNumber
                        defaultValue={0}
                        step={1}
                        min={0}
                        onChange={changeWeight}
                        name='weight'
                    />
                </Form.Item>

                <span className='multiply'>x</span>

                <Form.Item colon={false} label='Количество' className='exercise-fields__replays'>
                    <InputNumber
                        defaultValue={1}
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
