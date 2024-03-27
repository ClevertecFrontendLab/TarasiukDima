import { TExerciseNewInfo } from '@pages/calendar-page/calendar-trainings/types';

export type TPreviousLocations = {
    location: { pathname: string };
};

export const getClearLastRoutePath = (previousLocations: TPreviousLocations[]) => {
    if (!previousLocations.length) return '';

    return previousLocations[previousLocations.length - 1].location?.pathname;
};

export const getTrainingBadgeStatusColor = (key: string): string => {
    switch (key) {
        case 'legs':
        case 'Ноги':
            return 'red';
        case 'chest':
        case 'Грудь':
            return 'green';
        case 'strength':
        case 'Силовая':
            return 'yellow';
        case 'hands':
        case 'Руки':
            return 'cyan';
        case 'back':
        case 'Спина':
            return 'orange';
        default:
            return 'blue';
    }
};

export const isTwoSameExercisesArrays = (arr1: TExerciseNewInfo[], arr2: TExerciseNewInfo[]) => {
    if (arr1.length !== arr2.length || (arr1 && !arr2) || (!arr1 && arr2)) return false;

    const keysForCheck = ['approaches', 'name', 'replays', 'weight'];
    for (let index = 0; index < arr1.length; index++) {
        const item1 = arr1[index];
        const item2 = arr2[index];

        for (let indKey = 0; indKey < keysForCheck.length; indKey++) {
            const key = keysForCheck[indKey] as keyof TExerciseNewInfo;
            if (item1[key] !== item2[key]) {
                return false;
            }
        }
    }

    return true;
};

export const checkIsLessFileSize = (size: number, maxSize: number) => {
    return size / 1024 / 1024 < maxSize;
};
