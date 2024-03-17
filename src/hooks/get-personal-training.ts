import { useEffect, useState } from 'react';
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

    const [ needLoader, setNeedLoader] = useState(false);

    const [
        getPersonalTrainingsTrigger,
        { isError, isSuccess, data, isLoading },
    ] = useLazyGetTrainingQuery();

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
        if (isSuccess && data) {
            dispatch(changePersonalTrainingList(data));
            dispatch(changeShowLoader(false));
            navigate(ROUTES_LINKS.calendar);
        }
    }, [isSuccess, data, dispatch, navigate]);

    const getPersonalTrainings = (withLoader=false) => {
        setNeedLoader(withLoader);
        getPersonalTrainingsTrigger(null);
    };

    return { getPersonalTrainings };
};
