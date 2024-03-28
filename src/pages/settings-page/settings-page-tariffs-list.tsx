import { FC, memo, useMemo } from 'react';
import { useGetCurrentDayInfo } from '@hooks/index';
import { Button, Row } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import Paragraph from 'antd/lib/typography/Paragraph';
import { SettingsPageTariffsListItem } from './settings-page-tariffs-list-item';
import FreeImg from '@public/img/free.jpg';
import ProImg from '@public/img/pro.jpg';
import { TSimpleFn } from '@app_types/index';
import { TSettingsPageTariffsProps } from './types';

type TSettingsPageTariffsListProps = TSettingsPageTariffsProps & {
    clickMoreCb: TSimpleFn;
    activateTariffCb: TSimpleFn;
};

export const SettingsPageTariffsList: FC<TSettingsPageTariffsListProps> = memo(
    ({ items, tariff, clickMoreCb, activateTariffCb }) => {
        const { getDateNeededFormat } = useGetCurrentDayInfo();

        const tariffsItems = useMemo(() => {
            return [
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
                },
                ...items.map((item) => {
                    const childrenContent =
                        tariff && item._id === tariff?.tariffId ? (
                            <Paragraph className='tariffs-plans__item_text'>
                                активен
                                <span className='text-date'>
                                    до {getDateNeededFormat(tariff.expired, 'DD.MM')}
                                </span>
                            </Paragraph>
                        ) : (
                            <Button
                                type='primary'
                                className='button-page'
                                onClick={activateTariffCb}
                            >
                                Активировать
                            </Button>
                        );

                    const imgUrl = item.name === 'Pro' ? ProImg : '';

                    return {
                        ...item,
                        imgSrc: imgUrl,
                        children: childrenContent,
                    };
                }),
            ];
        }, [items, tariff, activateTariffCb, getDateNeededFormat]);

        return (
            <Row className='tariffs-plans'>
                {tariffsItems.map(({ _id, name, children, imgSrc }) => (
                    <SettingsPageTariffsListItem
                        key={_id}
                        name={name}
                        clickMoreCb={clickMoreCb}
                        imgSrc={imgSrc}
                    >
                        {children}
                    </SettingsPageTariffsListItem>
                ))}
            </Row>
        );
    },
);
