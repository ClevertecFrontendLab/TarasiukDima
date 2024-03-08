import { useEffect } from 'react';
import { useAppSelector } from '@hooks/typed-react-redux-hooks';
import { useLazyGetTrainingsListQuery } from '@services/index';
import { Modal } from 'antd';
import { PageContent, PageHeader, PageLayout } from '@components/index';
import { CalendarTraining } from './calendar-trainings';
import { ROUTES_LINKS } from '@constants/index';

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
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    // const [isTrainingVariantsError, setIsTrainingVariantsError] = useState(true);
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

    console.log('personalTraining', personalTraining);
    console.log('trainingVariants', trainingVariants);

    return (
        <PageLayout className='calendar-page' isLoading={isTrainingVariantsLoading}>
            <PageHeader className='calendar-header' routes={routes} showSettingsButton />

            <PageContent className='calendar-content'>
                <CalendarTraining />
            </PageContent>
        </PageLayout>
    );
};
