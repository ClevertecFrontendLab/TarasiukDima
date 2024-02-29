export const sortArrayByDate = <T, K extends keyof T>(items: T[], key: K): T[] => {
    const sortedItems = [...items].sort((a: T, b: T) => {
        const date1 = Date.parse(a[key] as string);
        const date2 = Date.parse(b[key] as string);

        if (date1 < date2) {
            return 1;
        }

        return -1;
    });

    return sortedItems;
};
