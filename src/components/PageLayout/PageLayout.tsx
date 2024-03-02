import classNames from 'classnames';
import { Layout } from 'antd';
import { Sidebar, Spinner } from '@components/index';
import { TClsAndChildProps } from '@app_types/index';

import './page-layout.scss';

type TPageLayoutProps = TClsAndChildProps & {
    isLoading?: boolean;
};

export const PageLayout: React.FC<TPageLayoutProps> = ({
    children,
    className = '',
    isLoading = false,
}) => (
    <Layout
        style={{ minHeight: '100vh' }}
        hasSider
        className={classNames('page', {
            [className]: className,
        })}
    >
        <Sidebar />

        <Layout className='page-layout'>{children}</Layout>

        {isLoading && <Spinner className='page-spinner' />}
    </Layout>
);
