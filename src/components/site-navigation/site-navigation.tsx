import { memo, useCallback } from 'react';
import { Location } from 'react-router-dom';
import { HeartFilled, TrophyFilled } from '@ant-design/icons';
import { ROUTES_LINKS } from '@constants/index';
import { useAppSelector, useGetPersonalTrainings } from '@hooks/index';
import CalendarIcon from '@public/img/calendar.svg?react';
import ProfileIcon from '@public/img/profile.svg?react';
import { Menu, MenuProps } from 'antd';
import classNames from 'classnames';

import { SiteNavigationLink } from './site-navigation-link';

import './site-navigation.scss';

type TSiteNavigationProps = {
    inlineCollapsed?: boolean;
    className?: string;
};

const links: MenuProps['items'] = [
    {
        label: 'Календарь',
        icon: <CalendarIcon />,
        key: ROUTES_LINKS.calendar,
    },
    {
        label: <SiteNavigationLink link={ROUTES_LINKS.training} title='Тренировки' />,
        icon: <HeartFilled />,
        key: ROUTES_LINKS.training,
    },
    {
        label: <SiteNavigationLink link={ROUTES_LINKS.progress} title='Достижения' />,
        icon: <TrophyFilled />,
        key: ROUTES_LINKS.progress,
    },
    {
        label: <SiteNavigationLink link={ROUTES_LINKS.profile} title='Профиль' />,
        icon: <ProfileIcon />,
        key: ROUTES_LINKS.profile,
    },
];

export const SiteNavigation: React.FC<TSiteNavigationProps> = memo(
    ({ inlineCollapsed = true, className = '' }) => {
        const { location } = useAppSelector((state) => state.router);
        const { getPersonalTrainings } = useGetPersonalTrainings();

        const menuClick = useCallback(
            (menuInfo: { key: string }) => {
                if (menuInfo.key === ROUTES_LINKS.calendar) {
                    getPersonalTrainings(true);
                }
            },
            [getPersonalTrainings],
        );

        return (
            <Menu
                inlineCollapsed={inlineCollapsed}
                mode='inline'
                items={links}
                onClick={menuClick}
                selectedKeys={[(location as Location).pathname]}
                className={classNames('navigation', {
                    [className]: className,
                })}
            />
        );
    },
);
