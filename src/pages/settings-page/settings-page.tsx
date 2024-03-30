import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { ModalPage, PageContent, PageHeader, PageLayout } from '@components/index';
import { SETTINGS_IDS, TOKEN_AUTH_LOCALSTORAGE } from '@constants/index';
import { useAppDispatch, useAppSelector, useGetUserDataInfo } from '@hooks/index';
import { setToken } from '@redux/index';
import { useBuyTariffMutation, useGetTariffsListQuery } from '@services/index';
import { removeLocalStorageItem } from '@utils/index';
import { Button, Result } from 'antd';
import Title from 'antd/lib/typography/Title';

import { SettingsContext } from './settings-page-context';
import { SettingsPageOptions } from './settings-page-options';
import { SettingsPageReviews } from './settings-page-reviews';
import { SettingsPageTariffs } from './settings-page-tariffs';
import { TSettingsContext } from './types';

import './settings-page.scss';

export const SettingsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { userData } = useAppSelector((state) => state.user);
    const { getUserInfo } = useGetUserDataInfo();

    useEffect(() => {
        if (!userData) {
            getUserInfo();
        }
    }, [userData, getUserInfo]);

    const [isShowSuccessChangeTariffModal, setIsShowSuccessChangeTariffModal] = useState(false);

    const { data: tariffsListInfo = [], isLoading: isLoadingGetTariffsList } =
        useGetTariffsListQuery(null);
    const [buyUserPlane, { isLoading: isLoadingBuyUserPlane, isSuccess: isSuccessBuyUserPlane }] =
        useBuyTariffMutation();

    useEffect(() => {
        if (isSuccessBuyUserPlane) {
            setIsShowSuccessChangeTariffModal(true);
        }
    }, [isSuccessBuyUserPlane]);

    const closeSuccessModalCb = useCallback(() => {
        setIsShowSuccessChangeTariffModal(false);
        dispatch(setToken(''));
        removeLocalStorageItem(TOKEN_AUTH_LOCALSTORAGE);
    }, [dispatch]);

    const backCb = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const buyTariffPlaneCb = useCallback(
        (tariffId: string, days: number) => {
            buyUserPlane({
                tariffId,
                days,
            });
        },
        [buyUserPlane],
    );

    const settingsContextValue: TSettingsContext = useMemo(
        () => ({
            items: tariffsListInfo,
            tariff: userData?.tariff ?? null,
            buyPlaneCb: buyTariffPlaneCb,
        }),
        [tariffsListInfo, userData, buyTariffPlaneCb],
    );

    return (
        <PageLayout
            className='settings-page'
            isLoading={isLoadingGetTariffsList || isLoadingBuyUserPlane}
        >
            <PageHeader routes={null}>
                <Button
                    onClick={backCb}
                    className='settings-page__header-button'
                    data-test-id={SETTINGS_IDS.headerBack}
                    icon={<ArrowLeftOutlined />}
                >
                    <span className='btn-text'>Настройки</span>
                </Button>
            </PageHeader>

            <PageContent>
                <div className='common-page-content'>
                    <Title level={1} className='settings-page__content_title'>
                        Мой тариф
                    </Title>

                    <SettingsContext.Provider value={settingsContextValue}>
                        <SettingsPageTariffs />
                        <SettingsPageOptions />
                        <SettingsPageReviews />
                    </SettingsContext.Provider>
                </div>
            </PageContent>

            <ModalPage
                variant='content'
                className='settings-ok-modal'
                open={isShowSuccessChangeTariffModal}
                closable={true}
                onCancel={closeSuccessModalCb}
                centered={true}
                data-test-id={SETTINGS_IDS.successModal}
            >
                <Result
                    status='success'
                    title='Чек для оплаты у вас на почте'
                    subTitle={
                        <Fragment>
                            Мы отправили инструкцию для оплаты вам на e-mail {userData?.email ?? ''}
                            . После подтверждения оплаты войдите в приложение заново.
                        </Fragment>
                    }
                    extra='Не пришло письмо? Проверьте папку Спам.'
                />
            </ModalPage>
        </PageLayout>
    );
};
