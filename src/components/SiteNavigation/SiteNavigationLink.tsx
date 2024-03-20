import { memo } from 'react';
import { Link } from 'react-router-dom';

type TMenuLink = {
    link: string;
    title: string;
};

export const SiteNavigationLink: React.FC<TMenuLink> = memo(({ link, title }) => (
    <Link to={link} className='menu-link'>
        {title}
    </Link>
));
