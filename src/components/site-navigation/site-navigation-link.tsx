import { memo } from 'react';
import { Link } from 'react-router-dom';

type TMenuLink = {
    link: string;
    title: string;
    dataTestId?: string;
};

export const SiteNavigationLink: React.FC<TMenuLink> = memo(({ link, title , dataTestId=''}) => (
    <Link to={link} className='menu-link' data-test-id={dataTestId}>
        {title}
    </Link>
));
