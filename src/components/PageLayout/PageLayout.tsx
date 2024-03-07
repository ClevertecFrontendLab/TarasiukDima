import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeShowTrainingListError } from '@redux/index';
import { useAppSelector } from '@hooks/index';
import classNames from 'classnames';
import { ResultStatusType } from 'antd/lib/result';
import { ROUTES_LINKS, STATUS_CODES } from '@constants/index';
import { Button, Layout, Result } from 'antd';
import { ModalPage, Sidebar, Spinner } from '@components/index';
import { TClsAndChildProps } from '@app_types/index';

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
            hasSider
            className={classNames('page', {
                [className]: className,
            })}
        >
            <Sidebar />

            <Layout className='page-layout'>{children}</Layout>

            {(isLoading || isShowLoader) && <Spinner className='page-spinner' />}

            {isShowTrainingListError && (
                <ModalPage variant='error' open={isShowTrainingListError}>
                    <Result
                        status={STATUS_CODES.serverError as ResultStatusType}
                        title='Что-то пошло не так'
                        subTitle='Произошла ошибка, попробуйте ещё раз.'
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
