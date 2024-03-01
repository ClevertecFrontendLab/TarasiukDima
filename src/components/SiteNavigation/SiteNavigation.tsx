import { FC, useCallback } from 'react';
import classNames from 'classnames';
import { Menu, MenuProps } from 'antd';
import { ROUTES_LINKS } from '@constants/index';
import { HeartFilled, TrophyFilled } from '@ant-design/icons';
import CalendarIcon from '@public/img/calendar.svg?react';
import ProfileIcon from '@public/img/profile.svg?react';

import './site-navigation.scss';

const items: MenuProps['items'] = [
    {
        label: 'Календарь',
        icon: <CalendarIcon />,
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
        icon: <ProfileIcon />,
        key: '4' + ROUTES_LINKS.profile,
    },
];

type TSiteNavigationProps = {
    inlineCollapsed?: boolean;
    className?: string;
};
export const SiteNavigation: FC<TSiteNavigationProps> = ({
    inlineCollapsed = true,
    className = '',
}) => {
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
