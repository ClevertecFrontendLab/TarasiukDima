import { FC, memo, useCallback, useMemo } from 'react';
import { Col } from 'antd';
import { SettingsPageOptionsItem } from './settings-page-options-item';
import { TTariffOptions } from '@app_types/index';

type TSettingsPageOptionsProps = {
    tariff: TTariffOptions | null;
};
export const SettingsPageOptions: FC<TSettingsPageOptionsProps> = memo(({ tariff }) => {
    const teamTrainingCb = useCallback((checked: boolean) => {
        console.log(`teamTrainingCb ${checked}`);
    }, []);

    const notificationsCb = useCallback((checked: boolean) => {
        console.log(`notificationsCb ${checked}`);
    }, []);

    const themeSwitchCb = useCallback((checked: boolean) => {
        console.log(`themeSwitchCb ${checked}`);
    }, []);

    const options = useMemo(
        () => [
            {
                title: 'Открыт для совместных тренировок',
                tooltip: (
                    <>
                        включенная функция <br />
                        позволит участвовать <br />в совместных тренировках
                    </>
                ),
                checked: false,
                disabled: false,
                clickCb: teamTrainingCb,
            },
            {
                title: 'Уведомления',
                tooltip: (
                    <>
                        включенная функция
                        <br />
                        позволит получать
                        <br />
                        уведомления об активностях
                    </>
                ),
                checked: false,
                disabled: false,
                clickCb: notificationsCb,
            },
            {
                title: 'Тёмная тема',
                tooltip: (
                    <>
                        темная тема <br />
                        доступна для <br />
                        PRO tariff
                    </>
                ),
                checked: false,
                disabled: !tariff,
                clickCb: themeSwitchCb,
            },
        ],
        [teamTrainingCb, notificationsCb, themeSwitchCb, tariff],
    );

    return (
        <Col className='settings-block'>
            {options.map((item) => (
                <SettingsPageOptionsItem key={item.title} {...item} />
            ))}
        </Col>
    );
});
