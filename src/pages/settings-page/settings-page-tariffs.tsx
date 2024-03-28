import { FC, memo, useCallback, useState } from 'react';
import { TSettingsPageTariffsProps } from './types';
import { SettingsPageTariffsList } from './settings-page-tariffs-list';
import { SettingsPageTariffsCompare } from './settings-page-tariffs-compare';

export const SettingsPageTariffs: FC<TSettingsPageTariffsProps> = memo(({ items, tariff }) => {
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
                items={items}
                tariff={tariff}
                activateTariffCb={activateTariffCb}
                clickMoreCb={clickMoreCb}
            />

            <SettingsPageTariffsCompare
                items={items}
                isShow={isShowCompareTariffs}
                tariff={tariff}
                closeCompareCb={closeCompareCb}
            />
        </>
    );
});
