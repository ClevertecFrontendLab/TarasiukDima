import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES_LINKS } from '@constants/index';
import classNames from 'classnames';

import LogoBig from './logo-big.svg?react';
import LogoSized from './logo-sized.svg?react';
import LogoSmall from './logo-small.svg?react';

import './logo.scss';

type TLogoProps = {
    variantIcon?: 'small' | 'big' | 'sized';
    className?: string;
};

export const Logo: React.FC<TLogoProps> = memo(({ variantIcon = 'big', className = '' }) => {
    let LogoIcon;

    switch (variantIcon) {
        case 'big':
            LogoIcon = <LogoBig />;
            break;

        case 'small':
            LogoIcon = <LogoSmall />;
            break;

        default:
            LogoIcon = <LogoSized />;
            break;
    }

    return (
        <Link
            to={ROUTES_LINKS.home}
            className={classNames('logo', {
                [className]: className,
                small: variantIcon === 'small',
            })}
            aria-label='Логотип фирмы Cleverfit.'
        >
            {LogoIcon}
        </Link>
    );
});
