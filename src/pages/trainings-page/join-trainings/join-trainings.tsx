import { Fragment, useCallback, useEffect, useState } from 'react';
import { Spinner } from '@components/spinner';
import { useAppDispatch } from '@hooks/typed-react-redux-hooks';
import { changeInvites } from '@redux/user-slice';
import { useGetInvitesListQuery, useGetTrainingPalsQuery } from '@services/index';

import { JoinTrainingsCard } from './join-trainings-card';
import { JoinTrainingsInvites } from './join-trainings-invites/join-trainings-invites';
import { JoinTrainingsPartners } from './join-trainings-partners';
import { JoinTrainingsSearch } from './join-trainings-search';

export type TTrainingSearchUserVariant = 'rand' | 'favorite' | null;

export const JoinTrainings = () => {
    const dispatch = useAppDispatch();
    const [chosenSearchVariant, setChosenSearchVariant] =
        useState<TTrainingSearchUserVariant>(null);
    const [isShowSearchWindow, setIsShowSearchWindow] = useState(false);

    const {
        isLoading: isGetInvitesLoading,
        isError: isGetInvitesError,
        isSuccess: isGetInvitesSuccess,
        data: invitesData = [],
    } = useGetInvitesListQuery(null);

    const {
        isLoading: isGetPalsLoading,
        // isError: isGetPalsError,
        // isSuccess: isGetPalsSuccess,
        data: trainingPals = [],
    } = useGetTrainingPalsQuery(null);

    useEffect(() => {
        if (isGetInvitesError) {
            dispatch(changeInvites([]));
        }
    }, [isGetInvitesError, dispatch]);

    useEffect(() => {
        if (isGetInvitesSuccess) {
            dispatch(changeInvites(invitesData));
        }
    }, [isGetInvitesSuccess, invitesData, dispatch]);

    const randomTrainingSearchCb = useCallback(() => {
        setChosenSearchVariant('rand');
        setIsShowSearchWindow(true);
    }, []);

    const favoriteTrainingSearchCb = useCallback(() => {
        setChosenSearchVariant('favorite');
        setIsShowSearchWindow(true);
    }, []);

    const closeSearchWindowCb = useCallback(() => {
        setChosenSearchVariant(null);
        setIsShowSearchWindow(false);
    }, []);

    return (
        <div className='join-trainings'>
            {isGetPalsLoading || isGetInvitesLoading ? (
                <Spinner />
            ) : isShowSearchWindow ? (
                <JoinTrainingsSearch
                    closeSearchCb={closeSearchWindowCb}
                    chosenSearchVariant={chosenSearchVariant}
                />
            ) : (
                <Fragment>
                    <JoinTrainingsInvites invites={invitesData} />

                    <JoinTrainingsCard
                        randomTrainingSearchCb={randomTrainingSearchCb}
                        favoriteTrainingSearchCb={favoriteTrainingSearchCb}
                    />

                    <JoinTrainingsPartners partners={trainingPals} />
                </Fragment>
            )}
        </div>
    );
};
