import { useEffect } from 'react';
import { useLazyGetTrainingsListQuery } from '@services/index';
import { Modal } from 'antd';
import { PageContent, PageHeader, PageLayout } from '@components/index';
import { CalendarTraining } from './calendar-trainings/calendar-trainings';
import { ROUTES_LINKS } from '@constants/index';

import './calendar-page.scss';
import { CloseOutlined } from '@ant-design/icons';

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
    const [
        getTrainingVariants,
        {
            isError: isVariantsError,
            currentData: trainingVariants = [],
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
                    <span data-test-id='modal-error-user-training-title'>
                        При открытии данных
                        <br /> произошла ошибка
                    </span>
                ),
                content: (
                    <span data-test-id='modal-error-user-training-subtitle'>
                        Попробуйте ещё раз.
                    </span>
                ),
                closeIcon: <CloseOutlined data-test-id='modal-error-user-training-button-close' />,
                okText: 'Обновить',
                onOk: repeatGetVariantsList,
                className: 'modal-page modal-variants',
                okButtonProps: {
                    className: 'right-btn',
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    'data-test-id': 'modal-error-user-training-button',
                },
            });
        }
    }, [isVariantsError, getTrainingVariants]);

    return (
        <PageLayout className='calendar-page' isLoading={isTrainingVariantsLoading}>
            <PageHeader className='calendar-page__header' routes={routes} showSettingsButton />

            <PageContent className='calendar-page__content'>
                <CalendarTraining trainingVariants={trainingVariants} />
            </PageContent>
        </PageLayout>
    );
};
