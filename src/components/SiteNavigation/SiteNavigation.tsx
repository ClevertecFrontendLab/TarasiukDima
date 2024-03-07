import { memo, useCallback, useState } from 'react';
import { useAppSelector, useGetPersonalTrainings } from '@hooks/index';
import classNames from 'classnames';
import { Menu, MenuProps } from 'antd';
import { ROUTES_LINKS } from '@constants/index';
import { HeartFilled, TrophyFilled } from '@ant-design/icons';
import { SiteNavigationLink } from './SiteNavigationLink';
import CalendarIcon from '@public/img/calendar.svg?react';
import ProfileIcon from '@public/img/profile.svg?react';
import { Location } from 'react-router-dom';

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
                    getPersonalTrainings();
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
