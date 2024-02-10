import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/typed-react-redux-hooks';
import { changeShowSidebar } from '@redux/app-reducer';
import { Button } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons';

import { Logo, SiteNavigation } from '@components/index';
import { ROUTES_LINKS } from '@constants/index';

import './sidebar.scss';

const Sidebar = () => {
    const { isShowSidebar } = useAppSelector((state) => state.app);
    const dispatch = useAppDispatch();

    const toggleSidebar = useCallback(() => {
        dispatch(changeShowSidebar());
    }, [dispatch]);

    return (
        <Sider
            collapsible
            collapsed={isShowSidebar}
            theme='light'
            collapsedWidth={64}
            width={208}
            className='sider'
            trigger={null}
        >
            <button
                onClick={toggleSidebar}
                className='trigger'
                data-test-id='sider-switch-mobile sider-switch'
            >
                {isShowSidebar ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>

            <Logo variantIcon={isShowSidebar ? 'small' : 'big'} className='sider__logo' />

            <SiteNavigation inlineCollapsed={isShowSidebar} />

            <Button href={ROUTES_LINKS.logout} className='exit'>
                <LogoutOutlined />

                {isShowSidebar ? '' : 'Выход'}
            </Button>
        </Sider>
    );
};

export default Sidebar;
