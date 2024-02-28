import { FC } from 'react';
import classNames from 'classnames';
import { Content } from 'antd/lib/layout/layout';
import { IClsAndChildProps } from '@app_types/index';

export const PageContent: FC<IClsAndChildProps> = ({ children, className = '' }) => {
    return (
        <Content
            className={classNames('page-layout__content', {
                [className]: className,
            })}
        >
            {children}
        </Content>
    );
};
