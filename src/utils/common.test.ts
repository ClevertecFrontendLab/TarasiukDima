import { ROUTES_LINKS } from '../constants/index';

import { getClearLastRoutePath, getTrainingBadgeStatusColor } from './common';

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
