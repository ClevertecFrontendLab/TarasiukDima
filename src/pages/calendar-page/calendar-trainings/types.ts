import {
    TClsAndChildProps,
    TExerciseNewInfo,
    TSimpleFn,
    TTrainingDayData,
    TTrainingEditButtonCb,
    TTrainingExerciseItem,
    TTrainingNameChosenIVariant,
    TTrainingVariants,
} from '@app-types/index';

export type TCalendarTrainingVariants = {
    trainingVariants: TTrainingVariants;
    showErrorModalCb: TSimpleFn;
};

type TCellModalsData = {
    dayChangedInfo: TTrainingDayData;
    dayFullInfo: TTrainingDayData;
    curDay: string;
    trainingDayToShow: string;
    trainingVariants: TTrainingVariants;
    isFutureDay: boolean;
    isEdit: boolean;
    chosenVariantTraining: TTrainingNameChosenIVariant;
    trainingDaySavedData: TTrainingDayData;
};

export type TCellDayContext = TCellModalsData & {
    isFinishedItem: boolean;
    changeTrainingVariantCb: (variant: TTrainingNameChosenIVariant) => void;
};

export type TCellModals = TCellModalsData & {
    curRef: React.MutableRefObject<HTMLDivElement | null> | null;
    isShow: boolean;

    isUpdateTrainingError: boolean;
    isUpdateTrainingSuccess: boolean;
    isUpdateTrainingLoading: boolean;
    isAddTrainingError: boolean;
    isAddTrainingSuccess: boolean;
    isAddTrainingLoading: boolean;

    showModalErrorCb: TSimpleFn;
    saveTrainingExercises: TSimpleFn;
    closeModalCb: () => void;
    changeIsEditTraining: (isEdit: boolean) => void;
    changeChosenNameTrainingCb: (variant: TTrainingNameChosenIVariant) => void;
    updateChangedTrainingInfoExercises: (exercises: TTrainingExerciseItem[]) => void;
    editTrainingButtonCB: (variant: TTrainingNameChosenIVariant) => void;
};

export type TCalendarCellContent = TClsAndChildProps & {
    addRefItemCB: (date: string, cell: React.MutableRefObject<HTMLDivElement | null>) => void;
    date: string;
};

export type TCellTrainingModalProps = {
    refEl: HTMLElement;
    isShow: boolean;
    isLoading: boolean;

    closeCb: TSimpleFn;
    saveExercisesCb: TSimpleFn;
    showAddExercisesCb: TSimpleFn;
    showEditExerciseCb: TSimpleFn;
};

export type TCellDayModalProps = {
    isShow: boolean;
    refEl: HTMLElement;

    closeCb: TSimpleFn;
    editTrainingCb: TTrainingEditButtonCb;
    addNewTrainingCb: TSimpleFn;
};

export type TCellAddNewExercisesProps = {
    isShow: boolean;
    isEditExercises: boolean;
    closeAddExercises: TSimpleFn;
    updateChangedTrainingInfoExercises: (exercises: TTrainingExerciseItem[]) => void;
};

export type TCellNewExercisesFormProps = {
    name?: string;
    weight?: number;
    approaches?: number;
    replays?: number;
    keyItem: number;
    testIdIndex: number;
    isChecked?: boolean;
    isFinished?: boolean;

    changeExercisesInfoCB: (ind: number, excInfo: TExerciseNewInfo) => void;
};
