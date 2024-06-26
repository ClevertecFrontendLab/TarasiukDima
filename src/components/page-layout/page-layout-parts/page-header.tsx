import { memo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SettingOutlined } from '@ant-design/icons';
import { TBreadcrumbsProps } from '@components/breadcrumbs';
import { Breadcrumbs } from '@components/index';
import { ROUTES_LINKS, SETTINGS_IDS } from '@constants/index';
import { Row } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import classNames from 'classnames';
import { TClsAndChildProps } from 'src/app-types/index';

type TPageHeaderProps = TClsAndChildProps &
    TBreadcrumbsProps & {
        showSettingsButton?: boolean;
        title?: ReactNode;
    };

export const PageHeader: React.FC<TPageHeaderProps> = memo(
    ({ children, className = '', routes, showSettingsButton = false, title }) => (
        <Header
            className={classNames('page-layout__header', {
                [className]: className,
            })}
        >
            <Breadcrumbs routes={routes} />

            {(title || showSettingsButton) && (
                <Row className='page-layout__header_row' justify='space-between' align='top'>
                    {title && <Title className='page-layout__header_title'>{title}</Title>}

                    {showSettingsButton && (
                        <Link
                            to={ROUTES_LINKS.settings}
                            className='page-layout__header_settings'
                            data-test-id={SETTINGS_IDS.headerBtn}
                        >
                            <SettingOutlined /> <span className='button-text'>Настройки</span>
                        </Link>
                    )}
                </Row>
            )}
            {children}
        </Header>
    ),
);
