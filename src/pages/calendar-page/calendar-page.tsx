import { useEffect } from 'react';
import { useLazyGetTrainingsListQuery } from '@services/index';
import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { PageContent, PageHeader, PageLayout } from '@components/index';
import { CalendarTraining } from './calendar-trainings/calendar-trainings';
import { MODALS_STYLE, ROUTES_LINKS, TRAININGS_IDS } from '@constants/index';

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
                closeIcon: <CloseOutlined data-test-id={TRAININGS_IDS.modalErrorUserCloseBtn} />,
                title: (
                    <span data-test-id={TRAININGS_IDS.modalErrorUserTitle}>
                        При открытии данных
                        <br /> произошла ошибка
                    </span>
                ),
                content: (
                    <span data-test-id={TRAININGS_IDS.modalErrorUserSubTitle}>
                        Попробуйте ещё раз.
                    </span>
                ),
                okText: 'Обновить',
                onOk: repeatGetVariantsList,
                className: 'modal-page modal-variants',
                maskStyle: MODALS_STYLE.maskStyleSmall,
                okButtonProps: {
                    className: 'right-btn',
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    'data-test-id': TRAININGS_IDS.modalErrorUserBtn,
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
