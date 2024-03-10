import { TTrainingVariants } from '@app_types/catalogs';
import { TCellTrainingsData, TVariantChosenItem } from './types';
import { Dayjs } from 'dayjs';
import { createContext } from 'react';

export type TCellDayContext = {
    dayData: TCellTrainingsData;
    date: Dayjs;
    trainingVariants: TTrainingVariants;
    isFutureDay: boolean;
    isEdit: boolean;
    chosenVariantTraining: TVariantChosenItem;
    changeTrainingVariantCb: (variant: TVariantChosenItem) => void;
};

export const CellDayContext = createContext<TCellDayContext | null>(null);
