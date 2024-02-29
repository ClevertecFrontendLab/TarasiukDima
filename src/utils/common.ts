export interface IPreviousLocations {
    location: { pathname: string };
}
export const getClearLastRoutePath = (previousLocations: Array<IPreviousLocations>) => {
    if (!previousLocations.length) return '';

    return previousLocations[previousLocations.length - 1].location?.pathname.split('/').join('/');
};
