import { memo } from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';

import './breadcrumbs.scss';

export type TBreadcrumbsProps = {
    routes: Route[] | null;
};

export const Breadcrumbs: React.FC<TBreadcrumbsProps> = memo(({ routes }) => {
    if (!routes || !routes.length) return null;

    return (
        <Breadcrumb
            className='breadcrumbs'
            style={{
                width: '100%',
            }}
            routes={routes}
            itemRender={itemRender}
        />
    );
});

const itemRender = (route: Route, _: unknown, routes: Route[]) => {
    const last = routes.indexOf(route) === routes.length - 1;

    return last ? (
        <span>{route.breadcrumbName}</span>
    ) : (
        <Link to={route.path}>{route.breadcrumbName}</Link>
    );
};
