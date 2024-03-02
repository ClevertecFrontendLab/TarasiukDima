export type TPreviousLocations = {
    location: { pathname: string };
};

export const getClearLastRoutePath = (previousLocations: TPreviousLocations[]) => {
    if (!previousLocations.length) return '';

    return previousLocations[previousLocations.length - 1].location?.pathname;
};
