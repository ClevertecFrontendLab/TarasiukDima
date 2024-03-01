import classNames from 'classnames';
import { Layout, Spin } from 'antd';
import { Sidebar } from '@components/index';
import Paragraph from 'antd/lib/typography/Paragraph';
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

        {isLoading && (
            <Paragraph className='spin-wrapper'>
                <Spin size='large' />
            </Paragraph>
        )}
    </Layout>
);
