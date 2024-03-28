import { TTariffItem, TTariffOptions } from '@app_types/index';

export type TSettingsPageTariffsProps = {
    items: TTariffItem[];
    tariff: TTariffOptions | null;
};
