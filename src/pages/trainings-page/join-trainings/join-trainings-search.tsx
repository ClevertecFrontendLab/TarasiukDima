import { FC, memo } from 'react';
import { TSimpleFn } from '@app-types/index';
import { TTrainingSearchUserVariant } from './join-trainings';

export const JoinTrainingsSearch: FC<{
    closeSearchCb: TSimpleFn;
    chosenSearchVariant: TTrainingSearchUserVariant;
}> = memo(({ closeSearchCb, chosenSearchVariant }) => <Card.Meta />);
