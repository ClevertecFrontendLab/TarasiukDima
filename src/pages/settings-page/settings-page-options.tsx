import { Fragment, memo, useCallback, useContext, useMemo } from 'react';
import { SETTINGS_IDS } from '@constants/index';
import { useAppSelector } from '@hooks/index';
import { useUpdateUserInfoMutation } from '@services/index';
import { Col } from 'antd';

import { SettingsContext } from './settings-page-context';
import { SettingsPageOptionsItem } from './settings-page-options-item';
import { TSettingsContext } from './types';

export const SettingsPageOptions = memo(() => {
    const { userData } = useAppSelector((state) => state.user);
    const { tariff } = useContext(SettingsContext) as TSettingsContext;
    const [updateUserData, { isLoading: isLoadingUpdateUserData }] = useUpdateUserInfoMutation();

    const teamTrainingCb = useCallback(
        (checked: boolean) => {
            updateUserData({
                readyForJointTraining: checked,
            });
        },
        [updateUserData],
    );

    const notificationsCb = useCallback(
        (checked: boolean) => {
            updateUserData({
                sendNotification: checked,
            });
        },
        [updateUserData],
    );

    const themeSwitchCb = useCallback((checked: boolean) => {
        console.log(`themeSwitchCb ${checked}`);
    }, []);

    const options = useMemo(() => {
        const readyForJointTraining = userData?.readyForJointTraining ?? false;
        const sendNotification = userData?.sendNotification ?? false;

        return [
            {
                title: 'Открыт для совместных тренировок',
                tooltip: (
                    <Fragment>
                        включеная функция <br />
                        позволит участвовать <br />в совместных тренировках
                    </Fragment>
                ),
                checked: readyForJointTraining,
                disabled: false || isLoadingUpdateUserData,
                clickCb: teamTrainingCb,
                dataTestSwitch: SETTINGS_IDS.switchTraining,
                dataTestIcon: SETTINGS_IDS.iconTraining,
            },
            {
                title: 'Уведомления',
                tooltip: (
                    <Fragment>
                        включеная функция <br />
                        позволит получать <br />
                        уведомления об активностях
                    </Fragment>
                ),
                checked: sendNotification,
                disabled: false || isLoadingUpdateUserData,
                clickCb: notificationsCb,
                dataTestSwitch: SETTINGS_IDS.switchNotifications,
                dataTestIcon: SETTINGS_IDS.iconNotifications,
            },
            {
                title: 'Тёмная тема',
                tooltip: (
                    <Fragment>
                        темная тема <br />
                        доступна для <br />
                        PRO tariff
                    </Fragment>
                ),
                checked: false,
                disabled: !tariff || isLoadingUpdateUserData,
                clickCb: themeSwitchCb,
                dataTestSwitch: SETTINGS_IDS.switchTheme,
                dataTestIcon: SETTINGS_IDS.iconTheme,
            },
        ];
    }, [teamTrainingCb, notificationsCb, themeSwitchCb, tariff, userData, isLoadingUpdateUserData]);

    return (
        <Col className='settings-block'>
            {options.map((item) => (
                <SettingsPageOptionsItem key={item.title} {...item} />
            ))}
        </Col>
    );
});
