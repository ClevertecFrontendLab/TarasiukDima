import { TTariffItem, TTariffOptions } from 'src/app-types/index';

export type TSettingsPageTariffsProps = {
    items: TTariffItem[];
    tariff: TTariffOptions | null;
};

export type TSettingsContext = {
    items: TTariffItem[];
    tariff: TTariffOptions | null;
    buyPlaneCb: (tariffId: string, days: number) => void;
};
