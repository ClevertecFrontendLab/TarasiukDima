import { Fragment, memo, useCallback, useState } from 'react';

import { SettingsPageTariffsCompare } from './settings-page-tariffs-compare';
import { SettingsPageTariffsList } from './settings-page-tariffs-list';

export const SettingsPageTariffs = memo(() => {
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
        <Fragment>
            <SettingsPageTariffsList
                activateTariffCb={activateTariffCb}
                clickMoreCb={clickMoreCb}
            />

            <SettingsPageTariffsCompare
                isShow={isShowCompareTariffs}
                closeCompareCb={closeCompareCb}
            />
        </Fragment>
    );
});
