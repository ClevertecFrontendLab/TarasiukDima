import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES_LINKS } from '@constants/index';
import {
    changePersonalTrainingList,
    changeShowLoader,
    changeShowTrainingListError,
} from '@redux/index';
import { useLazyGetTrainingQuery } from '@services/index';

export const useGetPersonalTrainings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [needLoader, setNeedLoader] = useState(false);

    const [getPersonalTrainingsTrigger, { isError, isSuccess, currentData, isLoading }] =
        useLazyGetTrainingQuery();

    useEffect(() => {
        if (needLoader && isLoading) {
            dispatch(changeShowLoader(true));
        }
    }, [isLoading, dispatch, needLoader]);

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

    const getPersonalTrainings = (withLoader = false) => {
        setNeedLoader(withLoader);
        getPersonalTrainingsTrigger(null);
    };

    return { getPersonalTrainings };
};
