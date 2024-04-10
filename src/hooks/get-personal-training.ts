import { useCallback, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    changePersonalTrainingList,
    changeShowLoader,
    changeShowTrainingListError,
} from '@redux/index';
import { useLazyGetTrainingQuery } from '@services/index';

export const useGetPersonalTrainings = (navigateOnSuccessLoadPage: string | null = null) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [needLoader, setNeedLoader] = useState(false);
    const [routeOnSuccessRedirect, setRouteOnSuccessRedirect] = useState(navigateOnSuccessLoadPage);

    const [getPersonalTrainingsTrigger, { isError, isSuccess, data, isLoading }] =
        useLazyGetTrainingQuery();

    useLayoutEffect(() => {
        if (needLoader && isLoading) {
            dispatch(changeShowLoader(true));
        }
    }, [isLoading, dispatch, needLoader]);

    useLayoutEffect(() => {
        if (isError) {
            dispatch(changeShowTrainingListError(true));
            dispatch(changeShowLoader(false));
        }
    }, [isError, dispatch]);

    useLayoutEffect(() => {
        if (isSuccess && data) {
            dispatch(changePersonalTrainingList(data));
            dispatch(changeShowLoader(false));

            if (routeOnSuccessRedirect) {
                navigate(routeOnSuccessRedirect);
            }
        }
    }, [isSuccess, routeOnSuccessRedirect, data, dispatch, navigate]);

    const getPersonalTrainings = useCallback(
        (withLoader = false, routeOnSuccess = '') => {
            if (routeOnSuccess) {
                setRouteOnSuccessRedirect(routeOnSuccess);
            }

            setNeedLoader(withLoader);
            getPersonalTrainingsTrigger(null);
        },
        [getPersonalTrainingsTrigger],
    );

    const changePageOnSuccessGetTrainings = useCallback((newPage: string) => {
        setRouteOnSuccessRedirect(newPage);
    }, []);

    return { getPersonalTrainings, changePageOnSuccessGetTrainings };
};
