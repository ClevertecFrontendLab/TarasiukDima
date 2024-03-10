import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    changeShowLoader,
    changeShowTrainingListError,
    changePersonalTrainingList,
} from '@redux/index';
import { useLazyGetTrainingQuery } from '@services/index';
import { ROUTES_LINKS } from '@constants/index';

export const useGetPersonalTrainings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [
        getPersonalTrainingsTrigger,
        { isError, isSuccess, currentData, isLoading },
    ] = useLazyGetTrainingQuery();

    useEffect(() => {
        if (isLoading) {
            dispatch(changeShowLoader(true));
        }
    }, [isLoading, dispatch]);

    useEffect(() => {
        if (isError) {
            dispatch(changeShowTrainingListError(true));
            dispatch(changeShowLoader(false));
        }
    }, [isError, dispatch]);

    useEffect(() => {
        if (isSuccess && currentData) {
            dispatch(changePersonalTrainingList(currentData));
            dispatch(changeShowLoader(false));
            navigate(ROUTES_LINKS.calendar);
        }
    }, [isSuccess, currentData, dispatch, navigate]);

    const getPersonalTrainings = () => {
        getPersonalTrainingsTrigger(null);
    };

    return { getPersonalTrainings };
};
