export type TFeedback = {
    id: string;
    fullName: string | null;
    imageSrc: string | null;
    message: string | null;
    rating: number;
    createdAt: string;
};

export type TFeedbackCreateBody = {
    message: string;
    rating: number;
};
