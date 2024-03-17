import { Dayjs } from 'dayjs';
import {
    TClsAndChildProps,
    TSimpleFn,
    TTraining,
    TTrainingBody,
    TTrainingExercise,
    TTrainingRequired,
    TTrainingVariants,
} from '@app_types/index';

export type TCellDayContext = {
    dayData: TTrainingDayData;
    date: Dayjs;
    trainingVariants: TTrainingVariants;
    isFutureDay: boolean;
    isEdit: boolean;
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

    changeExercisesInfoCB: (ind: number, excInfo: TExerciseNewInfo) => void;
};

export type TTrainingExerciseItem = TTrainingExercise & {
    isChecked?: boolean;
};
export type TExerciseNewInfo = Omit<TTrainingExerciseItem, 'isImplementation'>;


export type TCalendarTrainingListItem = {
    name: string;
    disabled: boolean;
    index: number;
};
export type TChangedTrainingState = {
    [key: string]: {
        [key: string]: TTrainingBody;
    };
};

export type TTrainingDayData = {
    [key: string]: TTrainingBody;
};

export type TChangedTrainingCb = React.Dispatch<React.SetStateAction<TChangedTrainingState>>;

/////////////////////////////////////////////////
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

export type TTrainingCellDataExercise = TTrainingExercise & {
    isChecked: boolean;
};

export type TCellTrainingsDataValue = Omit<TTraining, 'exercises'> & {
    isChanged: boolean;
    isNew: boolean;
    exercises: TTrainingCellDataExercise[];
};

export type TCellTrainingsData = {
    [key: string]: TCellTrainingsDataValue;
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

export type TUpdateTrainingExercisesCB = (ind: number, excInfo: TExerciseInfo) => void;

export type TExerciseInfo = Omit<TTrainingExercise, 'isImplementation'> & {
    isChecked: boolean;
};
export type TChangePersonalTrainingCb = (key: string, keyTraining: string, newTrainingData: TTraining) => void;
