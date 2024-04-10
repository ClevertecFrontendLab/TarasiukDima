import { PageContent, PageHeader, PageLayout } from '@components/index';
import { ROUTES_LINKS } from '@constants/index';
import { useGetTrainingsNames } from '@hooks/index';

import { CalendarTraining } from './calendar-trainings/calendar-trainings';

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
    const { isTrainingVariantsLoading, trainingVariants, showErrorTrainingsNamesModalCb } =
        useGetTrainingsNames();

    return (
        <PageLayout className='calendar-page' isLoading={isTrainingVariantsLoading}>
            <PageHeader
                className='calendar-page__header'
                routes={routes}
                showSettingsButton={true}
            />

            <PageContent className='calendar-page__content'>
                <CalendarTraining
                    trainingVariants={trainingVariants}
                    showErrorModalCb={showErrorTrainingsNamesModalCb}
                />
            </PageContent>
        </PageLayout>
    );
};
