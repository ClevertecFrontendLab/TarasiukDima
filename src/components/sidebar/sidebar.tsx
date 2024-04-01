import { memo, useCallback } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Logo, SiteNavigation } from '@components/index';
import { NAVIGATION_IDS, TOKEN_AUTH_LOCALSTORAGE } from '@constants/index';
import { useAppDispatch, useAppSelector } from '@hooks/index';
import ExitIcon from '@public/img/exit.svg?react';
import { changeShowSidebar, setToken } from '@redux/index';
import { removeLocalStorageItem } from '@utils/index';
import { Button, Col } from 'antd';
import Sider from 'antd/lib/layout/Sider';

import './sidebar.scss';

export const Sidebar = memo(() => {
    const { isShowSidebar } = useAppSelector((state) => state.app);
    const dispatch = useAppDispatch();

    const toggleSidebar = useCallback(() => {
        dispatch(changeShowSidebar());
    }, [dispatch]);

    const logoutUser = useCallback(() => {
        dispatch(setToken(''));
        removeLocalStorageItem(TOKEN_AUTH_LOCALSTORAGE);
    }, [dispatch]);

    return (
        <Sider
            collapsible={true}
            collapsed={isShowSidebar}
            theme='light'
            collapsedWidth={64}
            width={208}
            className='sider'
            trigger={null}
        >
            <button
                type='button'
                onClick={toggleSidebar}
                className='trigger big'
                data-test-id={NAVIGATION_IDS.sidebarTriggerScreen}
            >
                {isShowSidebar ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>

            <button
                type='button'
                onClick={toggleSidebar}
                className='trigger mobile'
                data-test-id={NAVIGATION_IDS.sidebarTriggerMobile}
            >
                {isShowSidebar ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>

            <Col className='sider__inner'>
                <Logo variantIcon={isShowSidebar ? 'small' : 'big'} className='sider__logo' />

                <SiteNavigation inlineCollapsed={isShowSidebar} />

                <Button className='exit' onClick={logoutUser}>
                    <ExitIcon />

                    {isShowSidebar ? '' : 'Выход'}
                </Button>
            </Col>
        </Sider>
    );
});
