import { Spinner } from '@components/index';
import { Layout, Space } from 'antd';
import classNames from 'classnames';
import { TClsAndChildProps } from 'src/app-types/common';

import './user-layout.scss';

type TUserLayoutProps = TClsAndChildProps & {
    showSpinner?: boolean;
};

export const UserLayout: React.FC<TUserLayoutProps> = ({
    children,
    className = '',
    showSpinner = false,
}) => (
    <Layout className='user-layout'>
        <Space align='center' direction='vertical' className='user-layout__wrapper'>
            <div
                className={classNames('user-layout__content', {
                    [className]: className,
                    blur: showSpinner,
                })}
            >
                {children}
            </div>
        </Space>

        {showSpinner && <Spinner />}
    </Layout>
);
