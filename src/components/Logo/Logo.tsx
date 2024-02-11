import { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { ROUTES_LINKS } from '@constants/index';
import LogoBig from './LogoBig.svg?react';
import LogoSmall from './LogoSmall.svg?react';

import './logo.scss';

interface ILogoProps {
    variantIcon?: 'small' | 'big';
    className?: string;
}

const Logo: FC<ILogoProps> = memo(({ variantIcon = 'big', className = '' }) => {
    return (
        <Link
            to={ROUTES_LINKS.home}
            className={classNames('logo', {
                [className]: className,
                small: variantIcon === 'small',
            })}
            aria-label='Логотип фирмы Cleverfit.'
        >
            {variantIcon === 'big' ? <LogoBig /> : <LogoSmall />}
        </Link>
    );
});

export default Logo;
