import { ReactNode, memo } from 'react';
import classNames from 'classnames';
import { Button, Row } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { SettingOutlined } from '@ant-design/icons';
import { Breadcrumbs } from '@components/index';
import { TBreadcrumbsProps } from '@components/Breadcrumbs';
import Title from 'antd/lib/typography/Title';
import { SETTINGS_IDS } from '@constants/index';
import { TClsAndChildProps } from '@app_types/index';

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
                        <Button
                            className='page-layout__header_settings'
                            type='link'
                            data-test-id={SETTINGS_IDS.headerBtn}
                        >
                            <SettingOutlined /> Настройки
                        </Button>
                    )}
                </Row>
            )}
            {children}
        </Header>
    ),
);
