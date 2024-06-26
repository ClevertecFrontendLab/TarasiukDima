import { Fragment, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ModalPage, Sidebar, Spinner } from '@components/index';
import { MODALS_STYLE, ROUTES_LINKS, STATUS_CODES, TRAININGS_IDS } from '@constants/index';
import { useAppSelector } from '@hooks/index';
import { changeShowTrainingListError } from '@redux/index';
import { Button, Layout, Result } from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import classNames from 'classnames';
import { TClsAndChildProps } from 'src/app-types/index';

import './page-layout.scss';

type TPageLayoutProps = TClsAndChildProps & {
    isLoading?: boolean;
};

export const PageLayout: React.FC<TPageLayoutProps> = ({
    children,
    className = '',
    isLoading = false,
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isShowTrainingListError, isShowLoader } = useAppSelector((state) => state.app);

    const redirectHomePage = useCallback(() => {
        dispatch(changeShowTrainingListError(false));
        navigate(ROUTES_LINKS.home);
    }, [navigate, dispatch]);

    return (
        <Layout
            style={{ minHeight: '100vh' }}
            hasSider={true}
            className={classNames('page', {
                [className]: className,
            })}
        >
            <Sidebar />

            <Layout className='page-layout'>{children}</Layout>

            {(isLoading || isShowLoader) && <Spinner className='page-spinner' />}

            {isShowTrainingListError && (
                <ModalPage
                    className='calendar-error-modal'
                    variant='error'
                    open={isShowTrainingListError}
                    dataTestId={TRAININGS_IDS.modalTrainingError}
                    maskStyle={MODALS_STYLE.maskStyleBig}
                >
                    <Result
                        status={STATUS_CODES.serverError as ResultStatusType}
                        title='Что-то пошло не так'
                        subTitle={
                            <Fragment>
                                <span>Произошла ошибка,</span> <span>попробуйте ещё раз.</span>
                            </Fragment>
                        }
                        extra={
                            <Button
                                type='primary'
                                className='cbp button-page'
                                onClick={redirectHomePage}
                            >
                                Назад
                            </Button>
                        }
                    />
                </ModalPage>
            )}
        </Layout>
    );
};
