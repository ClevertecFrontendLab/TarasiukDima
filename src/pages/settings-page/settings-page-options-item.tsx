import { FC, ReactNode, memo, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useIsMobile } from '@hooks/index';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Row, Switch, Tooltip } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import { MAX_WIDTH_FOR_MOBILE_PX } from '@constants/index';

type TSettingsPageOptionsItemProps = {
    title: string;
    tooltip: ReactNode;
    checked: boolean;
    disabled: boolean;
    clickCb: (checked: boolean) => void;
    dataTestSwitch?: string;
    dataTestIcon?: string;
};

export const SettingsPageOptionsItem: FC<TSettingsPageOptionsItemProps> = memo(
    ({ title, tooltip, checked, disabled, clickCb, dataTestSwitch = '', dataTestIcon = '' }) => {
        const isMobile = useIsMobile(MAX_WIDTH_FOR_MOBILE_PX);

        const [selectedItem, setSelectedItem] = useState<boolean>(checked);

        useEffect(() => {
            setSelectedItem(checked)
        }, [checked])

        const onChange = useCallback(
            (checked: boolean) => {
                setSelectedItem(checked);
                clickCb(checked);
            },
            [clickCb],
        );

        return (
            <Row
                className={classNames('settings-block__option', {
                    disabled: disabled,
                })}
                align='middle'
            >
                <Paragraph className='settings-block__option_title'>{title}</Paragraph>

                <Tooltip
                    className='settings-block__option_tooltip'
                    placement='bottomLeft'
                    title={tooltip}
                    color='#000000'
                    arrowPointAtCenter
                >
                    <ExclamationCircleOutlined data-test-id={dataTestIcon} />
                </Tooltip>

                <Switch
                    size={isMobile ? 'small' : 'default'}
                    data-test-id={dataTestSwitch}
                    className='settings-block__option_switch'
                    disabled={disabled}
                    checked={selectedItem}
                    onChange={onChange}
                />
            </Row>
        );
    },
);
