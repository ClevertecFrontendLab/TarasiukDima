import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/typed-react-redux-hooks';
import { changeShowSidebar } from '@redux/app-slice';
import { Button } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import ExitIcon from '@public/img/exit.svg?react';
import { Logo, SiteNavigation } from '@components/index';

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
            <button onClick={toggleSidebar} className='trigger big' data-test-id='sider-switch'>
                {isShowSidebar ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>

            <button
                onClick={toggleSidebar}
                className='trigger mobile'
                data-test-id='sider-switch-mobile'
            >
                {isShowSidebar ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>

            <Logo variantIcon={isShowSidebar ? 'small' : 'big'} className='sider__logo' />

            <SiteNavigation inlineCollapsed={isShowSidebar} />

            <Button className='exit'>
                <ExitIcon />

                {isShowSidebar ? '' : 'Выход'}
            </Button>
        </Sider>
    );
};

export default Sidebar;
