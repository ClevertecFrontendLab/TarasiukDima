import { FC, Fragment, memo, useCallback, useContext, useState } from 'react';
import { CheckCircleFilled, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { DATE_SHORT_FORMAT_TO_VIEW, SETTINGS_IDS } from '@constants/index';
import { useDayInfo } from '@hooks/index';
import { Alert, Button, Col, Drawer, Radio, RadioChangeEvent, Row, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Paragraph from 'antd/lib/typography/Paragraph';
import { TSimpleFn } from 'src/app-types/index';

import { SettingsContext } from './settings-page-context';
import { TSettingsContext } from './types';

type TSettingsPageTariffsCompareProps = {
    isShow: boolean;
    closeCompareCb: TSimpleFn;
};

type DataType = {
    key: string;
    name: string;
    free: boolean;
    pro: boolean;
};

export const SettingsPageTariffsCompare: FC<TSettingsPageTariffsCompareProps> = memo(
    ({ isShow, closeCompareCb }) => {
        const { items, tariff, buyPlaneCb } = useContext(SettingsContext) as TSettingsContext;

        const { getDateNeededFormat } = useDayInfo();

        const [chosenPeriodDays, setChosenPeriodDays] = useState<number | null>(null);
        const paymentPeriodDisabled = !chosenPeriodDays;
        const periods = items[0]?.periods;

        const currentTariffInfo = tariff
            ? items.filter((item) => item._id === tariff?.tariffId)[0]
            : null;

        const onChangePeriodCb = useCallback((event: RadioChangeEvent) => {
            setChosenPeriodDays(event.target.value);
        }, []);

        const getRowIcon = useCallback(
            (checked: boolean) =>
                checked ? (
                    <CheckCircleFilled className='icon-ok' />
                ) : (
                    <CloseCircleOutlined className='icon-not' />
                ),
            [],
        );

        const tariffsColumns: ColumnsType<DataType> = [
            {
                key: 'name',
                title: '',
                dataIndex: 'name',
            },
            {
                key: 'FREE',
                title: 'FREE',
                dataIndex: 'FREE',
                render: (_: string, { free }: DataType) => getRowIcon(free),
            },
            ...items.map((item) => ({
                key: item.name,
                title:
                    tariff && tariff.tariffId === item._id ? (
                        <Row className='row-title'>
                            {item.name} <CheckCircleOutlined />
                        </Row>
                    ) : (
                        item.name
                    ),
                dataIndex: item.name,
                render: (_: string, options: DataType) =>
                    getRowIcon(options[item.name.toLocaleLowerCase() as keyof DataType] as boolean),
            })),
        ];

        const tariffsRows: DataType[] = [
            {
                key: '1',
                name: 'Статистика за месяц',
                free: true,
                pro: true,
            },
            {
                key: '2',
                name: 'Статистика за всё время',
                free: false,
                pro: true,
            },
            {
                key: '3',
                name: 'Совместные тренировки',
                free: true,
                pro: true,
            },
            {
                key: '4',
                name: 'Участие в марафонах',
                free: false,
                pro: true,
            },
            {
                key: '5',
                name: 'Приложение iOS',
                free: false,
                pro: true,
            },
            {
                key: '6',
                name: 'Приложение Android',
                free: false,
                pro: true,
            },
            {
                key: '7',
                name: 'Индивидуальный Chat GPT',
                free: false,
                pro: true,
            },
        ];

        const BuyPlaneBtnCb = useCallback(() => {
            const id = items[0]._id;

            buyPlaneCb(id, chosenPeriodDays as number);
            setChosenPeriodDays(null);
            closeCompareCb();
        }, [items, buyPlaneCb, chosenPeriodDays, closeCompareCb]);

        return (
            <Drawer
                data-test-id={SETTINGS_IDS.sidePanel}
                className='drawer-site tariffs-compare'
                destroyOnClose={true}
                open={isShow}
                title='Сравнить тарифы'
                onClose={closeCompareCb}
                closable={true}
                footer={
                    !currentTariffInfo ? (
                        <Button
                            type='primary'
                            disabled={paymentPeriodDisabled}
                            className='button-page'
                            style={{ width: '100%' }}
                            onClick={BuyPlaneBtnCb}
                            data-test-id={SETTINGS_IDS.buyButton}
                        >
                            Выбрать и оплатить
                        </Button>
                    ) : null
                }
            >
                {currentTariffInfo && tariff && (
                    <Alert
                        type='info'
                        className='tariffs-compare__title'
                        message={
                            <Fragment>
                                Ваш <span>{currentTariffInfo.name}</span> tariff активен до{' '}
                                {getDateNeededFormat(tariff.expired, DATE_SHORT_FORMAT_TO_VIEW)}
                            </Fragment>
                        }
                    />
                )}

                <Table
                    className='tariffs-compare__table'
                    rowClassName='tariffs-compare__table_row'
                    size='small'
                    bordered={false}
                    pagination={false}
                    dataSource={tariffsRows}
                    columns={tariffsColumns}
                />

                {!currentTariffInfo && periods && (
                    <Col className='tariffs-compare__order'>
                        <Paragraph className='tariffs-compare__order_title'>
                            Стоимость тарифа
                        </Paragraph>

                        <Radio.Group
                            data-test-id={SETTINGS_IDS.periodsPrice}
                            className='tariffs-compare__order_periods'
                            onChange={onChangePeriodCb}
                            value={chosenPeriodDays}
                            buttonStyle='outline'
                        >
                            {periods.map(({ text, cost, days }) => (
                                <Radio
                                    value={days}
                                    key={text}
                                    className='item-radio'
                                    data-test-id={`${SETTINGS_IDS.tariffPriceCheckbox}${cost}`}
                                >
                                    <span className='item-name'>{text}</span>
                                    <span className='item-price'>
                                        {cost.toString().replace('.', ',')}$
                                    </span>
                                </Radio>
                            ))}
                        </Radio.Group>
                    </Col>
                )}
            </Drawer>
        );
    },
);
