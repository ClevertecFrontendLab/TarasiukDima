import { useMemo } from 'react';
import { TCalendarTrainingsLogic } from '@app-types/index';
import { PageContent, PageHeader, PageLayout } from '@components/index';
import { ROUTES_LINKS } from '@constants/index';
import { useGetChangedTrainingsState, useGetTrainingsNames } from '@hooks/index';
import { Tabs } from 'antd';
import type { Tab } from 'rc-tabs/lib/interface';

import { MyTrainings } from './my-trainings/my-trainings';
import { JoinTrainings } from './join-trainings';
import { Marathons } from './marathons';
import { TrainingsContext } from './trainings-context';

import './trainings-page.scss';

const routes = [
    {
        path: ROUTES_LINKS.home,
        breadcrumbName: 'Главная',
    },
    {
        path: ROUTES_LINKS.trainings,
        breadcrumbName: 'Тренировки',
    },
];

export const TrainingsPage = () => {
    const { isTrainingVariantsLoading, trainingVariants, showErrorTrainingsNamesModalCb } =
        useGetTrainingsNames();

    const {
        changedPersonalTraining,
        savedTrainingData,
        isFutureDay,
        isEdit,
        changeIsEditTraining,
        selectedDay,
        changeSelectCurrentDay,
        saveTrainingExercises,
        trainingsDataForShow,

        trainingDayFullInfo,
        trainingDayChangedInfo,
        trainingDaySavedData,
        chosenVariantTraining,
        changeChosenNameTrainingCb,
        trainingDayToShow,
        updateChangedTrainingInfoExercises,
        editTrainingButtonCB,
        updateChangedTrainingParameters,

        isUpdateTrainingError,
        isUpdateTrainingSuccess,
        isUpdateTrainingLoading,
        isAddTrainingError,
        isAddTrainingSuccess,
        isAddTrainingLoading,
        saveChangedTrainingLastState,
    } = useGetChangedTrainingsState(trainingVariants);

    const tabsContent: Tab[] = useMemo(
        () => [
            {
                label: 'Мои тренировки',
                key: '1',
                children: (
                    <MyTrainings
                        trainingVariants={trainingVariants}
                        showErrorTrainingsNamesModalCb={showErrorTrainingsNamesModalCb}
                    />
                ),
            },
            {
                label: 'Совместные тренировки',
                key: '2',
                children: <JoinTrainings />,
            },
            {
                label: 'Марафоны',
                key: '3',
                children: <Marathons />,
            },
        ],
        [trainingVariants, showErrorTrainingsNamesModalCb],
    );

    const trainingsContextValue = useMemo(
        (): TCalendarTrainingsLogic => ({
            changedPersonalTraining,
            savedTrainingData,
            isFutureDay,
            isEdit,
            changeIsEditTraining,
            selectedDay,
            changeSelectCurrentDay,
            saveTrainingExercises,
            trainingsDataForShow,
            trainingDayFullInfo,
            trainingDayChangedInfo,
            trainingDaySavedData,
            chosenVariantTraining,
            changeChosenNameTrainingCb,
            trainingDayToShow,
            updateChangedTrainingInfoExercises,
            editTrainingButtonCB,
            isUpdateTrainingError,
            isUpdateTrainingSuccess,
            isUpdateTrainingLoading,
            isAddTrainingError,
            isAddTrainingSuccess,
            isAddTrainingLoading,
            updateChangedTrainingParameters,
            saveChangedTrainingLastState,
        }),
        [
            isFutureDay,
            isEdit,
            changeIsEditTraining,
            updateChangedTrainingParameters,
            selectedDay,
            changeSelectCurrentDay,
            saveTrainingExercises,
            trainingsDataForShow,
            trainingDayFullInfo,
            trainingDayChangedInfo,
            trainingDaySavedData,
            chosenVariantTraining,
            changeChosenNameTrainingCb,
            trainingDayToShow,
            updateChangedTrainingInfoExercises,
            editTrainingButtonCB,
            isUpdateTrainingError,
            isUpdateTrainingSuccess,
            isUpdateTrainingLoading,
            isAddTrainingError,
            isAddTrainingSuccess,
            isAddTrainingLoading,
            changedPersonalTraining,
            savedTrainingData,
            saveChangedTrainingLastState,
        ],
    );

    return (
        <PageLayout className='trainings-page' isLoading={isTrainingVariantsLoading}>
            <PageHeader
                className='trainings-page__header'
                routes={routes}
                showSettingsButton={true}
                title={null}
            />

            <PageContent>
                <div className='common-page-content'>
                    <TrainingsContext.Provider value={trainingsContextValue}>
                        <Tabs
                            defaultActiveKey='1'
                            size='large'
                            items={tabsContent}
                            className='trainings-page__tabs'
                        />
                    </TrainingsContext.Provider>
                </div>
            </PageContent>
        </PageLayout>
    );
};
