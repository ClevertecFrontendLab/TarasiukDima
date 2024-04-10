import { TTrainingExerciseItem } from '@app-types/index';

export const getEmptyTrainingStateItem = (): TTrainingExerciseItem => ({
    name: '',
    replays: 1,
    weight: 0,
    approaches: 1,
    isImplementation: false,
    isChecked: false,
});

type TDayText = {
    [key: number]: string;
};

export const getTrainingPeriodText = (day?: number): string => {
    const dayText: TDayText = {
        0: '',
        1: 'Через 1 день',
        2: 'Через 2 дня',
        3: 'Через 3 дня',
        4: 'Через 4 дня',
        5: 'Через 5 дней',
        6: 'Через 6 дней',
        7: '1 раз в неделю',
    };

    return day ? dayText[day] ?? '' : '';
};
