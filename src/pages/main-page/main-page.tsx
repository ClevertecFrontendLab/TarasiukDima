import { Layout } from 'antd';
import { useAppSelector } from '@hooks/typed-react-redux-hooks';
import { Navigate } from 'react-router-dom';

import { Sidebar } from '@components/index';
import HomeContent from './home-content';
import { ROUTES_LINKS } from '@constants/index';

import './main-page.scss';

export const MainPage: React.FC = () => {
    const { isAuth } = useAppSelector((state) => state.user);

    if (!isAuth) {
        return <Navigate to={ROUTES_LINKS.auth} replace={true} />;
    }

    return (
        <Layout style={{ minHeight: '100vh' }} hasSider className='home'>
            <Sidebar />

            <HomeContent />
        </Layout>
    );
};
