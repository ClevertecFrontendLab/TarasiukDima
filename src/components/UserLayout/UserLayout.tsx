import { FC, ReactNode } from 'react';
import { Layout, Space } from 'antd';

import './user-layout.scss';

const UserLayout: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <Layout className='user-layout'>
            <Space align='center' direction="vertical" className='user-layout__wrapper'>{children}</Space>
        </Layout>
    );
};

export default UserLayout;
