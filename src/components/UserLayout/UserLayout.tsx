import { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { Layout, Space } from 'antd';
import { Spinner } from '@components/index';

import './user-layout.scss';

interface IUserLayoutProps {
    children: ReactNode;
    className?: string;
    showSpinner?: boolean;
}

export const UserLayout: FC<IUserLayoutProps> = ({
    children,
    className = '',
    showSpinner = false,
}) => {
    return (
        <Layout className='user-layout'>
            <Space align='center' direction='vertical' className='user-layout__wrapper'>
                <div
                    className={classNames('user-layout__content', {
                        [className]: className,
                        blur: showSpinner,
                    })}
                >
                    {children}
                </div>
            </Space>

            {showSpinner && <Spinner />}
        </Layout>
    );
};
