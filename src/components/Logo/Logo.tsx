import { memo } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import LogoBig from './LogoBig.svg?react';
import LogoSmall from './LogoSmall.svg?react';
import LogoSized from './LogoSized.svg?react';
import { ROUTES_LINKS } from '@constants/index';

import './logo.scss';

type TLogoProps = {
    variantIcon?: 'small' | 'big' | 'sized';
    className?: string;
};

export const Logo: React.FC<TLogoProps> = memo(({ variantIcon = 'big', className = '' }) => (
    <Link
        to={ROUTES_LINKS.home}
        className={classNames('logo', {
            [className]: className,
            small: variantIcon === 'small',
        })}
        aria-label='Логотип фирмы Cleverfit.'
    >
        {variantIcon === 'big' ? (
            <LogoBig />
        ) : variantIcon === 'small' ? (
            <LogoSmall />
        ) : (
            <LogoSized />
        )}
    </Link>
));
