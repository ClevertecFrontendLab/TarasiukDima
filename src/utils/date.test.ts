import { sortArrayByDate, getCorrectDateForShow } from './date';

describe('sortArrayByDate', () => {
    const mockItems = [
        {
            date: '2024-03-04T12:55:12.250Z',
        },
        {
            date: '2024-03-03T12:55:12.250Z',
        },
        {
            date: '2024-03-02T12:55:12.250Z',
        },
    ];
    const dateKey = 'date';

    test('get sorted array', () => {
        expect(sortArrayByDate(mockItems, dateKey)).toEqual(mockItems);
    });

    test('sorted array', () => {
        expect(sortArrayByDate([mockItems[1], mockItems[2], mockItems[0]], dateKey)).toEqual(
            mockItems,
        );
    });

    test('sorted array', () => {
        expect(sortArrayByDate([mockItems[2], mockItems[0], mockItems[1]], dateKey)).toEqual(
            mockItems,
        );
    });
});

describe('getCorrectDateForShow', () => {
    test('with empty stamp', () => {
        expect(getCorrectDateForShow('')).toBe('');
    });

    test('with date stamp', () => {
        expect(getCorrectDateForShow('2024-03-02')).toBe('02.03.2024');
    });

    test('with date stamp', () => {
        expect(getCorrectDateForShow('2024-03-02T12:55:12.250Z')).toBe('02.03.2024');
    });
});
