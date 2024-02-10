import { Link } from 'react-router-dom';
import { CalendarTwoTone, ContactsOutlined, CalendarOutlined } from '@ant-design/icons';
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
                <CalendarOutlined /> Тренировки
            </Link>
        ),
    },
    {
        title: 'Назначить календарь',
        link: (
            <Link to={ROUTES_LINKS.calendar}>
                <CalendarTwoTone color='#061178' /> Календарь
            </Link>
        ),
    },

    {
        title: 'Заполнить профиль',
        link: (
            <Link to={ROUTES_LINKS.profile}>
                <ContactsOutlined /> Профиль
            </Link>
        ),
    },
];
