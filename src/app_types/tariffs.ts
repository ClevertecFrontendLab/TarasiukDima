export type TTariffOptions =  {
        tariffId: string;
        expired: string;
};

export type TTariffItemPeriod = {
    text: string;
    cost: number;
    days: number;
};

export type TTariffItem = {
    _id: string;
    name: string;
    periods: TTariffItemPeriod[];
};
