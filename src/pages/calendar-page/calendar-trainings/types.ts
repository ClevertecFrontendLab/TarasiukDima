import { Dayjs } from 'dayjs';
import {
    TSimpleFn,
    TTraining,
    TTrainingExercise,
    TTrainingRequired,
    TTrainingVariants,
} from '@app_types/index';

export type TCalendarTrainingVariants = {
    trainingVariants: TTrainingVariants;
};

export type TCalendarVariantsDayInfo = TCalendarTrainingVariants & {
    date: Dayjs;
};
export type TCalendarCellContentProps = TCalendarVariantsDayInfo & {
    dayInfo?: TCellTrainingsData;
    isFutureDay: boolean;
    isSelectedDay: boolean;
};

export type TVariantChosenItem = keyof TTrainingRequired | null;

export type TCellTrainingsData = {
    [key: string]: TTraining & {
        isChanged: boolean;
        isNew: boolean;
        needRemove: boolean;
    };
};

export type TCellAddNewModalProps = TCalendarVariantsDayInfo & {
    containerRef: HTMLDivElement;
    dayData: TCellTrainingsData;
    isShowModal: boolean;
    isEdit: boolean;
    closeModalCb: TSimpleFn;
    changeChosenVariant: (variant: TVariantChosenItem) => void;
    updateExercisesInfo: TUpdateTrainingExercisesCB;
    chosenVariantTraining: TVariantChosenItem;
    saveExercises: TSimpleFn;
};

export type TTrainingEditButtonCb = (trainingName: string) => void;
export type TUpdateTrainingExercisesCB = (ind: number, excInfo: TTrainingExercise) => void;
