import { Dayjs } from 'dayjs';
import {
    TClsAndChildProps,
    TSimpleFn,
    TTraining,
    TTrainingExercise,
    TTrainingRequired,
    TTrainingVariants,
} from '@app_types/index';

export type TTrainingEditButtonCb = (trainingName: string, isFinished?: boolean) => void;

export type TCalendarTrainingVariants = {
    trainingVariants: TTrainingVariants;
};

export type TCellDayContext = {
    dayData: TTrainingDayData;
    date: Dayjs;
    trainingVariants: TTrainingVariants;
    isFutureDay: boolean;
    isEdit: boolean;
    isFinishedItem: boolean;
    chosenVariantTraining: TVariantChosenItem;
    changeTrainingVariantCb: (variant: TVariantChosenItem) => void;
};

export type TCellModals = {
    curRef: React.MutableRefObject<HTMLDivElement | null>;
    curDay: string;
    trainingVariants: TTrainingVariants;
    isFutureDay: boolean;
    dayChangedInfo: TTrainingDayData;

    closeModalCb: () => void;
    setChangedPersonalTraining: TChangedTrainingCb;
};

export type TCalendarCellContent = TClsAndChildProps & {
    addRefItemCB: (date: string, cell: React.MutableRefObject<HTMLDivElement | null>) => void;
    date: string;
};

export type TCalendarTrainingListItem = {
    name: string;
    index: number;
    isFinished?: boolean;
};

export type TCalendarTrainingListProps = {
    items: TCalendarTrainingListItem[];
    className?: string;
    needButtonEdit?: boolean;
    editButtonCb?: TTrainingEditButtonCb;
};

export type TCellTrainingModalProps = {
    refEl: HTMLElement;
    isShow: boolean;
    isLoading: boolean;
    isCanSaveExercises: boolean;
    daySavedTraining: TTraining[];

    closeCb: TSimpleFn;
    saveExercisesCb: TSimpleFn;
    showAddExercisesCb: TSimpleFn;
    showEditExerciseCb: TSimpleFn;
};

export type TCellDayModalProps = {
    isShow: boolean;
    isEmptyDay: boolean;
    refEl: HTMLElement;
    addedTrainingNames: string[];

    closeCb: TSimpleFn;
    editTrainingCb: TTrainingEditButtonCb;
    addNewTrainingCb: TSimpleFn;
};

export type TCellAddNewExercisesProps = {
    isShow: boolean;
    isEditExercises: boolean;
    closeAddExercises: TSimpleFn;
    setChangedPersonalTraining: TChangedTrainingCb;
    curDay: string;
};

export type TCellNewExercisesFormProps = {
    name?: string;
    weight?: number;
    approaches?: number;
    replays?: number;
    keyItem: number;
    isChecked?: boolean;
    isFinished?: boolean;

    changeExercisesInfoCB: (ind: number, excInfo: TExerciseNewInfo) => void;
};

export type TTrainingExerciseItem = TTrainingExercise & {
    isChecked?: boolean;
};
export type TExerciseNewInfo = Omit<TTrainingExerciseItem, 'isImplementation'>;

export type TExerciseInfo = Omit<TTrainingExercise, 'isImplementation'> & {
    isChecked: boolean;
};

export type TChangedTrainingState = {
    [key: string]: {
        [key: string]: TTraining;
    };
};

export type TTrainingDayData = {
    [key: string]: TTraining;
};

export type TChangedTrainingCb = React.Dispatch<React.SetStateAction<TChangedTrainingState>>;

export type TVariantChosenItem = keyof TTrainingRequired | null;
