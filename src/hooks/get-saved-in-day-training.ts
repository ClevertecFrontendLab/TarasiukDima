import { useCallback } from 'react';

import { useAppSelector, useDayInfo } from '.';

export const useGetSavedTraining = () => {
    const { personalTraining } = useAppSelector((state) => state.app);

    const { getDateNeededFormat } = useDayInfo();

    const getSavedTrainingByDay = useCallback(
        (dayForSearch: string) =>
            personalTraining.filter((item) => getDateNeededFormat(item.date) === dayForSearch),
        [getDateNeededFormat, personalTraining],
    );

    const getSavedTrainingByName = useCallback(
        (dayForSearch: string, trainingName: string) => {
            if (!trainingName) return [];

            return getSavedTrainingByDay(dayForSearch).filter((item) => item.name === trainingName);
        },
        [getSavedTrainingByDay],
    );

    return { getSavedTrainingByDay, getSavedTrainingByName };
};
