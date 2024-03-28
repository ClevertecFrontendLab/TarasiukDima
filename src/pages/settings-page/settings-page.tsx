import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@hooks/index';
import { useGetTariffsListQuery } from '@services/index';
import { PageContent, PageHeader, PageLayout } from '@components/index';
import { Button } from 'antd';
import Title from 'antd/lib/typography/Title';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { SETTINGS_IDS } from '@constants/index';
import { SettingsPageTariffs } from './settings-page-tariffs';
import { SettingsPageReviews } from './settings-page-reviews';
import { SettingsPageOptions } from './settings-page-options';

import './settings-page.scss';

export const SettingsPage = () => {
    const navigate = useNavigate();
    const { userData } = useAppSelector((state) => state.user);

    const currentTariff = userData?.tariff ?? null;

    const { data: tariffsListInfo = [], isLoading: isLoadingGetTariffsList } =
        useGetTariffsListQuery(null);

    const backCb = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return (
        <PageLayout className='settings-page' isLoading={isLoadingGetTariffsList}>
            <PageHeader routes={null}>
                <Button
                    onClick={backCb}
                    className='settings-page__header-button'
                    date-test-id={SETTINGS_IDS.headerBack}
                    icon={<ArrowLeftOutlined />}
                >
                    Настройки
                </Button>
            </PageHeader>

            <PageContent>
                <div className='common-page-content'>
                    <Title level={1} className='settings-page__content_title'>
                        Мой тариф
                    </Title>

                    <SettingsPageTariffs tariff={currentTariff} items={tariffsListInfo} />
                    <SettingsPageOptions tariff={currentTariff} />
                    <SettingsPageReviews />
                </div>
            </PageContent>
        </PageLayout>
    );
};
