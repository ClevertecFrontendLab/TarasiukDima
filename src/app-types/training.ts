/* eslint-disable import/no-extraneous-dependencies */
import { Dayjs } from 'dayjs';

import { TSimpleFn } from './common';

export type TTrainingParameters = {
    repeat: boolean;
    period: number;
    jointTraining: boolean;
    participants: string[];
};

export type TTrainingExercise = {
    _id?: string;
    name: string;
    replays: number;
    weight: number;
    approaches: number;
    isImplementation: boolean;
};

export type TTrainingRequired = {
    name: string;
    date: string;
    exercises: TTrainingExercise[];
};

export type TTrainingBody = TTrainingRequired & {
    isImplementation?: boolean;
    parameters?: TTrainingParameters;
};

export type TTraining = TTrainingBody & {
    _id?: string;
    userId?: string;
};

export type TExerciseInfo = Omit<TTrainingExercise, 'isImplementation'> & {
    isChecked: boolean;
};

export type TTrainingExerciseItem = TTrainingExercise & {
    isChecked?: boolean;
};

export type TExerciseNewInfo = Omit<TTrainingExerciseItem, 'isImplementation'>;

export type TTrainingNameChosenIVariant = keyof TTrainingRequired | null;

export type TChangedTrainingItem = TTraining & {
    isChanged?: boolean;
};

export type TTrainingDayData = {
    [key: string]: TChangedTrainingItem;
};

export type TChangedTrainingState = {
    [key: string]: TTrainingDayData;
};

export type TCalendarTrainingsLogic = {
    changedPersonalTraining: TChangedTrainingState;
    trainingsDataForShow: TChangedTrainingState;
    savedTrainingData: TChangedTrainingState;

    trainingDayFullInfo: TTrainingDayData;
    trainingDayChangedInfo: TTrainingDayData;
    trainingDaySavedData: TTrainingDayData;

    isUpdateTrainingError: boolean;
    isUpdateTrainingSuccess: boolean;
    isUpdateTrainingLoading: boolean;
    isAddTrainingError: boolean;
    isAddTrainingSuccess: boolean;
    isAddTrainingLoading: boolean;

    isFutureDay: boolean;
    isEdit: boolean;
    selectedDay: string;
    trainingDayToShow: string;
    changeIsEditTraining: (isEditNow: boolean) => void;
    changeSelectCurrentDay: (newDate: Dayjs | null, needClearVariantTrainingName?: boolean) => void;
    saveTrainingExercises: TSimpleFn;
    chosenVariantTraining: TTrainingNameChosenIVariant;
    changeChosenNameTrainingCb: (variant: TTrainingNameChosenIVariant) => void;
    updateChangedTrainingInfoExercises: (exercises: TTrainingExerciseItem[]) => void;
    updateChangedTrainingParameters: (data: Partial<TTrainingParameters>) => void;
    editTrainingButtonCB: (variant: TTrainingNameChosenIVariant) => void;
    saveChangedTrainingLastState: TSimpleFn;
};

export type TTrainingEditButtonCb = (trainingName: string, isFinished?: boolean) => void;

export type TTrainingListViewItem = {
    name: string;
    index: number;
    isFinished?: boolean;
};

export type TTrainingPalItem = {
    id: string;
    name: string;
    trainingType: string;
    imageSrc: null | string;
    avgWeightInWeek: number;
    inviteId: string;
    status: string;
};

export type TTrainingBodyAddInvite = {
    to: string;
    trainingId: string;
};

export type TTrainingInviteStatus = 'accepted' | 'pending' | 'rejected';

export type TTrainingInviteItem = {
    _id: string;
    from: {
        _id: string;
        firstName: null | string;
        lastName: null | string;
        imageSrc: null | string;
    };
    training: TTraining;
    status: TTrainingInviteStatus;
    createdAt: string;
};

export type TTrainingInviteItemAddResponse = TTrainingInviteItem & {
    to: {
        _id: string;
        firstName: null | string;
        lastName: null | string;
        imageSrc: null | string;
    };
};

export type TTrainingInviteItemAnswerBody = {
    id: string;
    status: TTrainingInviteStatus;
};

export type TTrainingUserItem = {
    id: string;
    name: string;
};


