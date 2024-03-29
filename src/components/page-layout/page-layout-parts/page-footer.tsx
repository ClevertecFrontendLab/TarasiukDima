import { memo } from 'react';
import { Footer } from 'antd/lib/layout/layout';
import classNames from 'classnames';
import { TClsAndChildProps } from 'src/app-types/index';

export const PageFooter: React.FC<TClsAndChildProps> = memo(({ children, className = '' }) => (
    <Footer
        className={classNames('page-layout__footer', {
            [className]: className,
        })}
    >
        {children}
    </Footer>
));
