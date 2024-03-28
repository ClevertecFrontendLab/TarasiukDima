import { FC, ReactNode, memo, useCallback, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Row, Switch, Tooltip } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import classNames from 'classnames';

type TSettingsPageOptionsItemProps = {
    title: string;
    tooltip: ReactNode;
    checked: boolean;
    disabled: boolean;
    clickCb: (checked: boolean) => void;
};
export const SettingsPageOptionsItem: FC<TSettingsPageOptionsItemProps> = memo(
    ({ title, tooltip, checked, disabled, clickCb }) => {
        const [selectedItem, setSelectedItem] = useState<boolean>(checked);

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
                    placement='bottomLeft'
                    title={tooltip}
                    color='#000000'
                    arrowPointAtCenter
                    className='settings-block__option_tooltip'
                >
                    <ExclamationCircleOutlined />
                </Tooltip>

                <Switch
                    className='settings-block__option_switch'
                    disabled={disabled}
                    checked={selectedItem}
                    onChange={onChange}
                />
            </Row>
        );
    },
);
