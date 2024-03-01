import { FC } from 'react';
import classNames from 'classnames';
import { Header } from 'antd/lib/layout/layout';
import { Breadcrumbs } from '@components/index';
import { TClsAndChildProps } from '@app_types/index';
import { TBreadcrumbsProps } from '@components/Breadcrumbs';

type TPageHeaderProps = TClsAndChildProps & TBreadcrumbsProps;

export const PageHeader: FC<TPageHeaderProps> = ({ children, className = '', routes }) => {
    return (
        <Header
            className={classNames('page-layout__header', {
                [className]: className,
            })}
        >
            <Breadcrumbs routes={routes} />

            {children}
        </Header>
    );
};
