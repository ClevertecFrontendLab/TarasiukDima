import { memo } from 'react';
import classNames from 'classnames';
import { Content } from 'antd/lib/layout/layout';
import { TClsAndChildProps } from '@app_types/index';

export const PageContent: React.FC<TClsAndChildProps> = memo(({ children, className = '' }) => (
    <Content
        className={classNames('page-layout__content', {
            [className]: className,
        })}
    >
        {children}
    </Content>
));
