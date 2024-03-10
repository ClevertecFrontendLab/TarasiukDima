import {
    sortArrayByDate,
    getCorrectDateForShow,
    compareDates,
    getTimeInNeededFormat,
    updatedNeededLengthValue,
} from './date';

describe('compareDates', () => {
    const day1 = '2024-03-04T12:55:12.250Z';
    const day2 = '2024-03-03T12:55:12.250Z';

    test('get first day elder return -1', () => {
        expect(compareDates(day1, day2)).toEqual(-1);
    });

    test('get first day earlier return 1', () => {
        expect(compareDates(day2, day1)).toEqual(1);
    });

    test('get days equals', () => {
        expect(compareDates(day1, day1)).toEqual(-1);
    });
});

describe('updatedNeededLengthValue', () => {
    test('get value less needed length', () => {
        expect(updatedNeededLengthValue(2, 3, '*')).toEqual('**2');
    });

    test('get value(number) without args', () => {
        expect(updatedNeededLengthValue(2)).toEqual('02');
    });

    test('get value(string) without args', () => {
        expect(updatedNeededLengthValue('2')).toEqual('02');
    });

    test('get value equal needed length', () => {
        const value = 222;
        expect(updatedNeededLengthValue(value, 3, '*')).toEqual(value.toString());
    });

    test('get value more needed length', () => {
        const value = 222;
        expect(updatedNeededLengthValue(value, 1, '*')).toEqual(value.toString());
    });
});

describe('getTimeInNeededFormat', () => {
    const format = 'YY-MM-DD';
    const day = '2';
    const month = '2';
    const year = '2024';

    test('get format full', () => {
        expect(getTimeInNeededFormat({ format, year, month, day })).toEqual(
            `${year}-0${month}-0${day}`,
        );
    });

    test('get part format', () => {
        expect(getTimeInNeededFormat({ format: 'Y-M', year, month })).toEqual(`${year}-0${month}`);
    });

    test('get part format lower', () => {
        expect(getTimeInNeededFormat({ format: 'yYy-mM-dD', year, month, day })).toEqual(
            `${year}-0${month}-0${day}`,
        );
    });

    test('get year', () => {
        expect(getTimeInNeededFormat({ format: 'Y', year })).toEqual(`${year}`);
    });

    test('get month', () => {
        expect(getTimeInNeededFormat({ format: 'M', month })).toEqual(`0${month}`);
    });

    test('get day', () => {
        expect(getTimeInNeededFormat({ format: 'D', day })).toEqual(`0${day}`);
    });
});

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
