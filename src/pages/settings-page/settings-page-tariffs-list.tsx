import { FC, memo, useContext, useMemo } from 'react';
import { useGetCurrentDayInfo } from '@hooks/index';
import { Button, Row } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import Paragraph from 'antd/lib/typography/Paragraph';
import { SettingsPageTariffsListItem } from './settings-page-tariffs-list-item';
import FreeImg from '@public/img/free.jpg';
import ProImg from '@public/img/pro.jpg';
import { TSimpleFn } from '@app_types/index';
import { TSettingsContext } from './types';
import { DATE_SHORT_FORMAT_TO_VIEW, SETTINGS_IDS } from '@constants/index';
import { SettingsContext } from './settings-page-context';

type TSettingsPageTariffsListProps = {
    clickMoreCb: TSimpleFn;
    activateTariffCb: TSimpleFn;
};

export const SettingsPageTariffsList: FC<TSettingsPageTariffsListProps> = memo(
    ({ clickMoreCb, activateTariffCb }) => {
        const { getDateNeededFormat } = useGetCurrentDayInfo();

        const { items, tariff } = useContext(SettingsContext) as TSettingsContext;

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
            ];
        }, [items, tariff, activateTariffCb, getDateNeededFormat]);

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
