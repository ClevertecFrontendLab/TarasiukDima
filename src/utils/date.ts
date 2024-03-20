export const compareDates = (time1: string, time2: string): number => {
    const date1 = Date.parse(time1);
    const date2 = Date.parse(time2);

    if (date1 < date2) {
        return 1;
    }

    return -1;
};

export const updatedNeededLengthValue = (val: string | number, minLength = 2, padValue = '0') => {
    return val.toString().padStart(minLength, padValue);
};

export const sortArrayByDate = <T, K extends keyof T>(items: T[], key: K): T[] => {
    const sortedItems = items.toSorted((a: T, b: T) =>
        compareDates(a[key] as string, b[key] as string),
    );

    return sortedItems;
};

export const getCorrectDateForShow = (timeStamp: string) => {
    const dateFromStamp = new Date(timeStamp);

    if (dateFromStamp.toString() === 'Invalid Date') {
        return '';
    }

    return dateFromStamp.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });
};
