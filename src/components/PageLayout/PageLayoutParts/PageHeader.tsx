import { FC } from 'react';
import classNames from 'classnames';
import { Header } from 'antd/lib/layout/layout';
import { Breadcrumbs } from '@components/index';
import { TClsAndChildProps } from '@app_types/index';
import { IBreadcrumbsProps } from '@components/Breadcrumbs/Breadcrumbs';

interface IPageHeaderProps extends TClsAndChildProps, IBreadcrumbsProps {}

export const PageHeader: FC<IPageHeaderProps> = ({ children, className = '', routes }) => {
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
