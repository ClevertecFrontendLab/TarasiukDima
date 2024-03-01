import { FC } from 'react';
import classNames from 'classnames';
import { Layout, Space } from 'antd';
import { Spinner } from '@components/index';
import { TClsAndChildProps } from '@app_types/common';

import './user-layout.scss';

type TUserLayoutProps = TClsAndChildProps & {
    showSpinner?: boolean;
};

export const UserLayout: FC<TUserLayoutProps> = ({
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
