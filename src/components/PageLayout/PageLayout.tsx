import { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { Layout } from 'antd';
import { Sidebar } from '@components/index';

import './page-layout.scss';

interface IPageLayoutProps {
    children: ReactNode;
    className?: string;
}

export const PageLayout: FC<IPageLayoutProps> = ({ children, className = '' }) => {
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
        </Layout>
    );
};
