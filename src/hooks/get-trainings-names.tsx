import { useCallback, useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { TTrainingVariants } from '@app-types/index';
import { MODALS_STYLE, TRAININGS_IDS } from '@constants/index';
import { useLazyGetTrainingsListQuery } from '@services/catalogs-api';
import { Modal } from 'antd';

const getCommonErrorModalOptions = (
    closeId: string,
    okText: string,
    okId: string,
    className = '',
) => ({
    transitionName: '',
    maskTransitionName: '',
    centered: true,
    closable: true,
    closeIcon: <CloseOutlined data-test-id={closeId} />,
    okText,
    className,
    maskStyle: MODALS_STYLE.maskStyleSmall,
    okButtonProps: {
        className: 'right-btn',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        'data-test-id': okId,
    },
});

export const useGetTrainingsNames = () => {
    const [training, setTraining] = useState<TTrainingVariants>([]);
    const [showErrorModalSave, setShowErrorModalSave] = useState<boolean>(false);

    const [
        getTrainingVariants,
        {
            isError: isVariantsError,
            isSuccess: isTrainingVariantsSuccess,
            data: trainingVariants = [],
            isLoading: isTrainingVariantsLoading,
        },
    ] = useLazyGetTrainingsListQuery();

    useEffect(() => {
        getTrainingVariants(null);
    }, [getTrainingVariants]);

    useEffect(() => {
        if (isTrainingVariantsSuccess) {
            setTraining(trainingVariants);
        }
    }, [isTrainingVariantsSuccess, trainingVariants]);

    useEffect(() => {
        if (isVariantsError) {
            const repeatGetVariantsList = () => {
                getTrainingVariants(null);
            };

            Modal.error({
                ...getCommonErrorModalOptions(
                    TRAININGS_IDS.modalErrorUserCloseBtn,
                    'Обновить',
                    TRAININGS_IDS.modalErrorUserBtn,
                    'modal-page modal-error-save',
                ),

                open: isVariantsError,
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
                onOk: repeatGetVariantsList,

            });
        }
    }, [isVariantsError, getTrainingVariants]);

    useEffect(() => {
        if (showErrorModalSave) {
            const closeErrorModal = () => {
                setShowErrorModalSave(false);
            };

            Modal.error({
                ...getCommonErrorModalOptions(
                    TRAININGS_IDS.modalErrorUserCloseBtn,
                    'Закрыть',
                    TRAININGS_IDS.modalErrorUserBtn,
                    'modal-page',
                ),
                open: showErrorModalSave,
                title: (
                    <span data-test-id={TRAININGS_IDS.modalErrorUserTitle}>
                        При сохранении данных произошла ошибка
                    </span>
                ),
                content: (
                    <span data-test-id={TRAININGS_IDS.modalErrorUserSubTitle}>
                        Придётся попробовать ещё раз
                    </span>
                ),
                onCancel: closeErrorModal,
                onOk: closeErrorModal,
            });
        }
    }, [showErrorModalSave]);

    const showErrorTrainingsNamesModalCb = useCallback(() => {
        setShowErrorModalSave(true);
    }, []);

    return {
        trainingVariants: training,
        getTrainingVariants,
        isVariantsError,
        isTrainingVariantsSuccess,
        isTrainingVariantsLoading,
        showErrorTrainingsNamesModalCb,
    };
};
