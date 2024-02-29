import { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { Layout, Spin } from 'antd';
import { Sidebar } from '@components/index';
import Paragraph from 'antd/lib/typography/Paragraph';

import './page-layout.scss';

interface IPageLayoutProps {
    children: ReactNode;
    className?: string;
    isLoading?: boolean;
}

export const PageLayout: FC<IPageLayoutProps> = ({
    children,
    className = '',
    isLoading = false,
}) => {
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

            {isLoading && (
                <Paragraph className='spin-wrapper'>
                    <Spin size='large' />
                </Paragraph>
            )}
        </Layout>
    );
};
