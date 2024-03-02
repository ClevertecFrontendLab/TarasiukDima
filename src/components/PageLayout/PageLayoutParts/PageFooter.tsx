import { memo } from 'react';
import classNames from 'classnames';
import { Footer } from 'antd/lib/layout/layout';
import { TClsAndChildProps } from '@app_types/index';

export const PageFooter: React.FC<TClsAndChildProps> = memo(({ children, className = '' }) => (
    <Footer
        className={classNames('page-layout__footer', {
            [className]: className,
        })}
    >
        {children}
    </Footer>
));
