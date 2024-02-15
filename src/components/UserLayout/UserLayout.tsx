import { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { Layout, Space } from 'antd';

import './user-layout.scss';

interface IUserLayoutProps {
    children: ReactNode;
    className?: string;
}

const UserLayout: FC<IUserLayoutProps> = ({ children, className = '' }) => {
    return (
        <Layout className={'user-layout'}>
            <Space align='center' direction='vertical' className='user-layout__wrapper'>
                <div
                    className={classNames('user-layout__content', {
                        [className]: className,
                    })}
                >
                    {children}
                </div>
            </Space>
        </Layout>
    );
};

export default UserLayout;
