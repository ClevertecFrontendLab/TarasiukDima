import { ReactNode, memo, useCallback } from 'react';
import classNames from 'classnames';
import { Button, Row } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { SettingOutlined } from '@ant-design/icons';
import { Breadcrumbs } from '@components/index';
import { TClsAndChildProps } from '@app_types/index';
import { TBreadcrumbsProps } from '@components/Breadcrumbs';
import Title from 'antd/lib/typography/Title';
import { ROUTES_LINKS, SETTINGS_IDS } from '@constants/index';
import { Link } from 'react-router-dom';

type TPageHeaderProps = TClsAndChildProps &
    TBreadcrumbsProps & {
        showSettingsButton?: boolean;
        title?: ReactNode;
    };

export const PageHeader: React.FC<TPageHeaderProps> = memo(
    ({ children, className = '', routes, showSettingsButton = false, title }) => {
        const backPageCb = useCallback(() => {}, []);
        const isSettingsPage = false;
        return (
            <Header
                className={classNames('page-layout__header', {
                    [className]: className,
                })}
            >
                <Breadcrumbs routes={routes} />

                {(title || showSettingsButton) && (
                    <Row className='page-layout__header_row' justify='space-between' align='top'>
                        {title && <Title className='page-layout__header_title'>{title}</Title>}

                        {showSettingsButton &&
                            (isSettingsPage ? (
                                <Button
                                    className='page-layout__header_settings'
                                    type='link'
                                    onClick={backPageCb}
                                    data-test-id={SETTINGS_IDS.headerBack}
                                >
                                    <SettingOutlined /> Настройки
                                </Button>
                            ) : (
                                <Link
                                    to={ROUTES_LINKS.settings}
                                    className='page-layout__header_settings'
                                    data-test-id={SETTINGS_IDS.headerBtn}
                                >
                                    <SettingOutlined /> Настройки
                                </Link>
                            ))}
                    </Row>
                )}
                {children}
            </Header>
        );
    },
);
