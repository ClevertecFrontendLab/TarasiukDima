import { useCallback, useEffect, useState } from 'react';
import { PageContent, PageHeader, PageLayout } from '@components/index';
import { PROFILE_IDS } from '@constants/index';
import { MODALS_STYLE } from '@constants/modals';
import { useAppSelector, useGetUserDataInfo } from '@hooks/index';
import { useUpdateUserInfoMutation } from '@services/index';
import { Alert, Modal } from 'antd';
import { TUserInfoUpdateBody } from 'src/app-types/index';

import { ProfilePageUserContent } from './profile-page-user-content';

import './profile-page.scss';

export const ProfilePage = () => {
    const { userData } = useAppSelector((state) => state.user);
    const { getUserInfo } = useGetUserDataInfo();
    const [
        updateUserData,
        {
            isError: isErrorUpdateUserInfo,
            isLoading: isLoadingUpdateUserInfo,
            isSuccess: isSuccessUpdateUserInfo,
        },
    ] = useUpdateUserInfoMutation();

    const [isShowErrorSaveNewInfo, setIsShowErrorSaveNewInfo] = useState<boolean>(false);

    useEffect(() => {
        if (!userData) {
            getUserInfo();
        }
    }, [userData, getUserInfo]);

    useEffect(() => {
        if (isShowErrorSaveNewInfo) {
            const closeErrorModal = () => {
                setIsShowErrorSaveNewInfo(false);
            };

            Modal.error({
                centered: true,
                closable: false,
                okText: 'Закрыть',
                className: 'modal-page',
                maskStyle: MODALS_STYLE.maskStyleSmall,
                okButtonProps: {
                    className: 'right-btn',
                },

                open: isShowErrorSaveNewInfo,
                title: <span>При сохранении данных произошла ошибка </span>,
                content: <span>Придётся попробовать ещё раз</span>,
                onCancel: closeErrorModal,
                onOk: closeErrorModal,
            });
        }
    }, [isShowErrorSaveNewInfo]);

    useEffect(() => {
        if (isErrorUpdateUserInfo) {
            setIsShowErrorSaveNewInfo(true);
        }
    }, [isErrorUpdateUserInfo]);

    const updateUserInfo = useCallback(
        (newData: TUserInfoUpdateBody) => {
            updateUserData(newData);
        },
        [updateUserData],
    );

    return (
        <PageLayout className='profile-page'>
            <PageHeader
                className='profile-page__header'
                routes={null}
                showSettingsButton={true}
                title='Профиль'
            />

            <PageContent>
                <div className='common-page-content'>
                    <ProfilePageUserContent
                        isUpdatingUserInfo={isLoadingUpdateUserInfo}
                        updateUserInfoCb={updateUserInfo}
                    />

                    {isSuccessUpdateUserInfo && (
                        <Alert
                            data-test-id={PROFILE_IDS.formAlert}
                            className='profile-alert'
                            message='Данные профиля успешно обновлены'
                            type='success'
                            showIcon={true}
                            closable={true}
                        />
                    )}
                </div>
            </PageContent>
        </PageLayout>
    );
};
