import { ROUTES_LINKS } from '@constants/index';

import {
    checkIsLessFileSize,
    getClearLastRoutePath,
    getTrainingBadgeStatusColor,
    isTwoSameExercisesArrays,
} from './common';

describe('getClearLastRoutePath', () => {
    test('with empty Router', () => {
        expect(getClearLastRoutePath([])).toBe('');
    });

    test('with one location', () => {
        expect(
            getClearLastRoutePath([
                {
                    location: {
                        pathname: ROUTES_LINKS.auth,
                    },
                },
            ]),
        ).toBe(ROUTES_LINKS.auth);
    });

    test('with several locations', () => {
        expect(
            getClearLastRoutePath([
                {
                    location: {
                        pathname: ROUTES_LINKS.registration,
                    },
                },
                {
                    location: {
                        pathname: ROUTES_LINKS.auth,
                    },
                },
                {
                    location: {
                        pathname: ROUTES_LINKS.changePassword,
                    },
                },
            ]),
        ).toBe(ROUTES_LINKS.changePassword);
    });
});

describe('getTrainingBadgeStatusColor', () => {
    test('get red color', () => {
        expect(getTrainingBadgeStatusColor('legs')).toBe('red');
        expect(getTrainingBadgeStatusColor('Ноги')).toBe('red');
    });

    test('get green color', () => {
        expect(getTrainingBadgeStatusColor('chest')).toBe('green');
        expect(getTrainingBadgeStatusColor('Грудь')).toBe('green');
    });

    test('get yellow color', () => {
        expect(getTrainingBadgeStatusColor('strength')).toBe('yellow');
        expect(getTrainingBadgeStatusColor('Силовая')).toBe('yellow');
    });

    test('get cyan color', () => {
        expect(getTrainingBadgeStatusColor('hands')).toBe('cyan');
        expect(getTrainingBadgeStatusColor('Руки')).toBe('cyan');
    });

    test('get orange color', () => {
        expect(getTrainingBadgeStatusColor('back')).toBe('orange');
        expect(getTrainingBadgeStatusColor('Спина')).toBe('orange');
    });

    test('get default blue color', () => {
        expect(getTrainingBadgeStatusColor('1322')).toBe('blue');
        expect(getTrainingBadgeStatusColor('test')).toBe('blue');
    });
});

describe('isTwoSameExercisesArrays', () => {
    const commonPartArrays = {
        name: 'exercise',
        approaches: 1,
        replays: 2,
        weight: 3,
    };

    test('is same arrays', () => {
        expect(isTwoSameExercisesArrays([commonPartArrays], [commonPartArrays])).toBeTruthy();
        expect(isTwoSameExercisesArrays([], [])).toBeTruthy();
        expect(
            isTwoSameExercisesArrays(
                [commonPartArrays, commonPartArrays],
                [commonPartArrays, commonPartArrays],
            ),
        ).toBeTruthy();
    });

    test('is one empty item', () => {
        expect(isTwoSameExercisesArrays([commonPartArrays], [])).toBeFalsy();
        expect(isTwoSameExercisesArrays([], [commonPartArrays])).toBeFalsy();
    });

    test('is different arrays', () => {
        expect(
            isTwoSameExercisesArrays([commonPartArrays], [{ ...commonPartArrays, approaches: 2 }]),
        ).toBeFalsy();
        expect(
            isTwoSameExercisesArrays([{ ...commonPartArrays, replays: 1 }], [commonPartArrays]),
        ).toBeFalsy();
    });
});

describe('checkIsLessFileSize', () => {
    const oneMb = 1024 * 1024;

    test('is less size', () => {
        expect(checkIsLessFileSize(oneMb * 1.5, 2)).toBeTruthy();
        expect(checkIsLessFileSize(oneMb * 2, 2.1)).toBeTruthy();
        expect(checkIsLessFileSize(oneMb * 4, 5)).toBeTruthy();
    });

    test('is equals size return false', () => {
        expect(checkIsLessFileSize(oneMb * 2, 2)).toBeFalsy();
        expect(checkIsLessFileSize(oneMb * 3, 3)).toBeFalsy();
        expect(checkIsLessFileSize(oneMb * 4, 4)).toBeFalsy();
    });

    test('is more size', () => {
        expect(checkIsLessFileSize(oneMb * 3, 2)).toBeFalsy();
        expect(checkIsLessFileSize(oneMb * 4, 3)).toBeFalsy();
        expect(checkIsLessFileSize(oneMb * 5, 4)).toBeFalsy();
    });
});
