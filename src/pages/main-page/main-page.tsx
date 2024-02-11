import { Layout } from 'antd';

import { Sidebar } from '@components/index';
import HomeContent from './home-content';

import './main-page.scss';

export const MainPage: React.FC = () => {
    return (
        <Layout style={{ minHeight: '100vh' }} hasSider className='home'>
            <Sidebar />

            <HomeContent />
        </Layout>
    );
};
