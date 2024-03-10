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
