import { memo } from 'react';
import { Content } from 'antd/lib/layout/layout';
import classNames from 'classnames';
import { TClsAndChildProps } from 'src/app-types/index';

export const PageContent: React.FC<TClsAndChildProps> = memo(({ children, className = '' }) => (
    <Content
        className={classNames('page-layout__content', {
            [className]: className,
        })}
    >
        {children}
    </Content>
));
