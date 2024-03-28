import {  memo, useCallback, useState } from 'react';
import { SettingsPageTariffsList } from './settings-page-tariffs-list';
import { SettingsPageTariffsCompare } from './settings-page-tariffs-compare';

export const SettingsPageTariffs= memo(() => {
    const [isShowCompareTariffs, setIsShowCompareTariffs] = useState(false);

    const clickMoreCb = useCallback(() => {
        setIsShowCompareTariffs(true);
    }, []);

    const activateTariffCb = useCallback(() => {
        setIsShowCompareTariffs(true);
    }, []);

    const closeCompareCb = useCallback(() => {
        setIsShowCompareTariffs(false);
    }, []);

    return (
        <>
            <SettingsPageTariffsList
                activateTariffCb={activateTariffCb}
                clickMoreCb={clickMoreCb}
            />

            <SettingsPageTariffsCompare
                isShow={isShowCompareTariffs}
                closeCompareCb={closeCompareCb}
            />
        </>
    );
});
