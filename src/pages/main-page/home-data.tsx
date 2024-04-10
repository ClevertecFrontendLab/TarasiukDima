import { Link } from 'react-router-dom';
import { HeartFilled } from '@ant-design/icons';
import { NAVIGATION_IDS, ROUTES_LINKS } from '@constants/index';
import CalendarIcon from '@public/img/calendar.svg?react';
import ProfileIcon from '@public/img/profile.svg?react';

import { LinkWithLoadPersonalData } from './link-with-load-personal-data';

export const listData = [
    'планировать свои тренировки на календаре, выбирая тип и уровень нагрузки;',
    'отслеживать свои достижения в разделе статистики, сравнивая свои результаты с нормами и рекордами;',
    'создавать свой профиль, где ты можешь загружать свои фото, видео и отзывы о тренировках;',
    'выполнять расписанные тренировки для разных частей тела, следуя подробным инструкциям и советам профессиональных тренеров.',
];

export const cardsData = [
    {
        title: 'Расписать тренировки',
        link: (
            <LinkWithLoadPersonalData
                goodLoadRoute={ROUTES_LINKS.trainings}
                testId={NAVIGATION_IDS.menuButtonTraining}
            >
                <HeartFilled /> Тренировки
            </LinkWithLoadPersonalData>
        ),
    },
    {
        title: 'Назначить календарь',
        link: (
            <LinkWithLoadPersonalData
                goodLoadRoute={ROUTES_LINKS.calendar}
                testId={NAVIGATION_IDS.sidebarCalendarBtn}
            >
                <CalendarIcon />
                <span className='card-link__name'>Календарь</span>
            </LinkWithLoadPersonalData>
        ),
    },
    {
        title: 'Заполнить профиль',
        link: (
            <Link
                className='card-link'
                to={ROUTES_LINKS.profile}
                data-test-id={NAVIGATION_IDS.profileLinkOnHomePage}
            >
                <ProfileIcon /> Профиль
            </Link>
        ),
    },
];
