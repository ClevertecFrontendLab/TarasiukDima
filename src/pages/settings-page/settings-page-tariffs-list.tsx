import { FC, memo, useContext, useMemo } from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { DATE_SHORT_FORMAT_TO_VIEW, SETTINGS_IDS } from '@constants/index';
import { useDayInfo } from '@hooks/index';
import FreeImg from '@public/img/free.jpg';
import ProImg from '@public/img/pro.jpg';
import { Button, Row } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import { TSimpleFn } from 'src/app-types/index';

import { SettingsContext } from './settings-page-context';
import { SettingsPageTariffsListItem } from './settings-page-tariffs-list-item';
import { TSettingsContext } from './types';

type TSettingsPageTariffsListProps = {
    clickMoreCb: TSimpleFn;
    activateTariffCb: TSimpleFn;
};

export const SettingsPageTariffsList: FC<TSettingsPageTariffsListProps> = memo(
    ({ clickMoreCb, activateTariffCb }) => {
        const { getDateNeededFormat } = useDayInfo();

        const { items, tariff } = useContext(SettingsContext) as TSettingsContext;

        const tariffsItems = useMemo(
            () => [
                {
                    _id: 'free',
                    name: 'Free',
                    periods: [],
                    imgSrc: FreeImg,
                    children: (
                        <Paragraph className='tariffs-plans__item_text'>
                            активен <CheckOutlined />
                        </Paragraph>
                    ),
                    dataTestCard: '',
                },
                ...items.map((item) => {
                    const childrenContent =
                        tariff && item._id === tariff?.tariffId ? (
                            <Paragraph className='tariffs-plans__item_text'>
                                активен
                                <span className='text-date'>
                                    до{' '}
                                    {getDateNeededFormat(tariff.expired, DATE_SHORT_FORMAT_TO_VIEW)}
                                </span>
                            </Paragraph>
                        ) : (
                            <Button
                                type='primary'
                                className='button-page'
                                onClick={activateTariffCb}
                                data-test-id={SETTINGS_IDS.proCardActivate}
                            >
                                Активировать
                            </Button>
                        );

                    const imgUrl = item.name === 'Pro' ? ProImg : '';

                    return {
                        ...item,
                        dataTestCard: SETTINGS_IDS.proCard,
                        imgSrc: imgUrl,
                        children: childrenContent,
                    };
                }),
            ],
            [items, tariff, activateTariffCb, getDateNeededFormat],
        );

        return (
            <Row className='tariffs-plans'>
                {tariffsItems.map(({ _id, name, children, imgSrc, dataTestCard }) => (
                    <SettingsPageTariffsListItem
                        key={_id}
                        name={name}
                        clickMoreCb={clickMoreCb}
                        imgSrc={imgSrc}
                        dataTestId={dataTestCard}
                    >
                        {children}
                    </SettingsPageTariffsListItem>
                ))}
            </Row>
        );
    },
);
