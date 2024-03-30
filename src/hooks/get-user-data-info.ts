import { useCallback, useLayoutEffect } from 'react';
import { changeUserData } from '@redux/index';
import { useLazyGetUserInfoQuery } from '@services/index';

import { useAppDispatch } from '.';

export const useGetUserDataInfo = () => {
    const dispatch = useAppDispatch();

    const [
        getUserData,
        {
            isSuccess: isGetUserInfoSuccess,
            isLoading: isLoadingGetUserData,
            data: userNewInfo = null,
        },
    ] = useLazyGetUserInfoQuery();

    const getUserInfo = useCallback(() => {
        getUserData(null);
    }, [getUserData]);

    useLayoutEffect(() => {
        if (isGetUserInfoSuccess) {
            dispatch(changeUserData(userNewInfo));
        }
    }, [dispatch, isGetUserInfoSuccess, userNewInfo]);

    return { getUserInfo, isGetUserInfoSuccess, isLoadingGetUserData, userNewInfo };
};
