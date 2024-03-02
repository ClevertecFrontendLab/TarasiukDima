import { Link } from 'react-router-dom';
import { HeartFilled } from '@ant-design/icons';
import CalendarIcon from '@public/img/calendar.svg?react';
import ProfileIcon from '@public/img/profile.svg?react';
import { ROUTES_LINKS } from '@constants/index';

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
            <Link to={ROUTES_LINKS.training}>
                <HeartFilled /> Тренировки
            </Link>
        ),
    },
    {
        title: 'Назначить календарь',
        link: (
            <Link to={ROUTES_LINKS.calendar}>
                <CalendarIcon /> Календарь
            </Link>
        ),
    },

    {
        title: 'Заполнить профиль',
        link: (
            <Link to={ROUTES_LINKS.profile}>
                <ProfileIcon /> Профиль
            </Link>
        ),
    },
];
