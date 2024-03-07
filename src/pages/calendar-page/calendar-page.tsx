import { useEffect } from 'react';
import { useAppSelector } from '@hooks/typed-react-redux-hooks';
import { useLazyGetTrainingsListQuery } from '@services/index';
import { Calendar, ConfigProvider, Modal } from 'antd';
import { PageContent, PageHeader, PageLayout } from '@components/index';
import { ROUTES_LINKS } from '@constants/index';
import type { CalendarMode } from 'antd/es/calendar/generateCalendar';
import locale from 'antd/es/locale/ru_RU';
import type { Moment } from 'moment';

import './calendar-page.scss';

const routes = [
    {
        path: ROUTES_LINKS.home,
        breadcrumbName: 'Главная',
    },
    {
        path: ROUTES_LINKS.calendar,
        breadcrumbName: 'Календарь',
    },
];

export const CalendarPage = () => {
    const { personalTraining } = useAppSelector((state) => state.app);

    const [
        getTrainingVariants,
        {
            isError: isVariantsError,
            currentData: trainingVariants,
            isLoading: isTrainingVariantsLoading,
        },
    ] = useLazyGetTrainingsListQuery();

    useEffect(() => {
        getTrainingVariants(null);
    }, [getTrainingVariants]);

    useEffect(() => {
        if (isVariantsError) {
            const repeatGetVariantsList = () => {
                getTrainingVariants(null);
            };

            Modal.error({
                centered: true,
                closable: true,
                title: (
                    <>
                        При открытии данных
                        <br /> произошла ошибка
                    </>
                ),
                content: 'Попробуйте ещё раз.',
                okText: 'Обновить',
                onOk: repeatGetVariantsList,
                className: 'modal-variants',
                okButtonProps: {
                    className: 'right-btn',
                },
            });
        }
    }, [isVariantsError, getTrainingVariants]);
    const onPanelChange = (value: Moment, mode: CalendarMode) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    };

    const onSelect = (value: Moment) => {
        console.log(value.format('YYYY-MM-DD'));
    };

    return (
        <PageLayout className='calendar-page' isLoading={isTrainingVariantsLoading}>
            <PageHeader className='calendar-header' routes={routes} showSettingsButton />

            <PageContent className='calendar-content'>
                <ConfigProvider locale={locale}>
                    <Calendar onPanelChange={onPanelChange} onSelect={onSelect} />
                </ConfigProvider>
            </PageContent>
        </PageLayout>
    );
};
