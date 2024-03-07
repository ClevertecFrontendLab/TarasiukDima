export type TTrainingParameters = {
    repeat: boolean;
    period: number;
    jointTraining: boolean;
    participants: string[];
};

export type TTrainingExercise = {
    _id: string;
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
    userId?: string;
    parameters?: TTrainingParameters;
};

export type TTraining = TTrainingBody & {
    id: string;
};
