import { FC, useCallback } from 'react';
import { Menu, MenuProps } from 'antd';
import classNames from 'classnames';
import { CalendarOutlined, ContactsOutlined, HeartFilled, TrophyFilled } from '@ant-design/icons';

import { ROUTES_LINKS } from '@constants/index';

import './site-navigation.scss';

const items: MenuProps['items'] = [
    {
        label: 'Календарь',
        icon: <CalendarOutlined />,
        key: '1' + ROUTES_LINKS.calendar,
    },
    {
        label: 'Тренировки',
        icon: <HeartFilled />,
        key: '2' + ROUTES_LINKS.training,
    },
    {
        label: 'Достижения',
        icon: <TrophyFilled />,
        key: '3' + ROUTES_LINKS.progress,
    },
    {
        label: 'Профиль',
        icon: <ContactsOutlined />,
        key: '4' + ROUTES_LINKS.profile,
    },
];

interface ISiteNavigationProps {
    inlineCollapsed?: boolean;
    className?: string;
}
const SiteNavigation: FC<ISiteNavigationProps> = ({ inlineCollapsed = true, className = '' }) => {
    const menuItemClick = useCallback(() => {
        console.log('menu click');
    }, []);

    return (
        <Menu
            inlineCollapsed={inlineCollapsed}
            mode='inline'
            onClick={menuItemClick}
            selectedKeys={['calendar']}
            items={items}
            className={classNames('navigation', {
                [className]: className,
            })}
        />
    );
};

export default SiteNavigation;
