import { memo, useCallback, useMemo } from 'react';
import { Location } from 'react-router-dom';
import { HeartFilled, TrophyFilled } from '@ant-design/icons';
import { MY_TRAININGS_IDS, ROUTES_LINKS } from '@constants/index';
import { useAppSelector, useGetPersonalTrainings } from '@hooks/index';
import CalendarIcon from '@public/img/calendar.svg?react';
import ProfileIcon from '@public/img/profile.svg?react';
import { Menu, MenuProps } from 'antd';
import classNames from 'classnames';

import { TrainingInvitesBadge } from '..';

import { SiteNavigationLink } from './site-navigation-link';

import './site-navigation.scss';

type TSiteNavigationProps = {
    inlineCollapsed?: boolean;
    className?: string;
};

export const SiteNavigation: React.FC<TSiteNavigationProps> = memo(
    ({ inlineCollapsed = true, className = '' }) => {
        const { location } = useAppSelector((state) => state.router);
        const { getPersonalTrainings } = useGetPersonalTrainings();

        const calendarCb = useCallback(() => {
            getPersonalTrainings(true, ROUTES_LINKS.calendar);
        }, [getPersonalTrainings]);

        const trainingCb = useCallback(() => {
            getPersonalTrainings(true, ROUTES_LINKS.trainings);
        }, [getPersonalTrainings]);

        const links: MenuProps['items'] = useMemo(
            () => [
                {
                    label: 'Календарь',
                    icon: <CalendarIcon />,
                    key: ROUTES_LINKS.calendar,
                    onClick: calendarCb,
                },
                {
                    label: 'Тренировки',
                    icon: (
                        <TrainingInvitesBadge
                            className='anticon'
                            dataTestId={MY_TRAININGS_IDS.badgeItem}
                            size='small'
                        >
                            <HeartFilled />
                        </TrainingInvitesBadge>
                    ),
                    key: ROUTES_LINKS.trainings,
                    onClick: trainingCb,
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
            ],
            [calendarCb, trainingCb],
        );

        return (
            <Menu
                inlineCollapsed={inlineCollapsed}
                mode='inline'
                items={links}
                selectedKeys={[(location as Location).pathname]}
                className={classNames('navigation', {
                    [className]: className,
                })}
            />
        );
    },
);
