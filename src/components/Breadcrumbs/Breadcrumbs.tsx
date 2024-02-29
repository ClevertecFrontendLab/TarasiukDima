import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';

import './breadcrumbs.scss';

export interface IBreadcrumbsProps {
    routes: Array<Route>;
}

export const Breadcrumbs: React.FC<IBreadcrumbsProps> = ({ routes }) => {
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
};

const itemRender = (route: Route, _: unknown, routes: Array<Route>) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? (
        <span>{route.breadcrumbName}</span>
    ) : (
        <Link to={route.path}>{route.breadcrumbName}</Link>
    );
};
