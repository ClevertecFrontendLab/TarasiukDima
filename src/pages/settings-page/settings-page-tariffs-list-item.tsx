import { FC, memo } from 'react';
import classNames from 'classnames';
import { Button, Card, Row } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import { TClsAndChildProps, TSimpleFn } from '@app_types/index';

type TTariffCartItemProps = TClsAndChildProps & {
    name: string;
    imgSrc?: string;
    clickMoreCb: TSimpleFn;
};

export const SettingsPageTariffsListItem: FC<TTariffCartItemProps> = memo(
    ({
        name,
        children,
        imgSrc = 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        clickMoreCb,
        className = '',
    }) => {
        return (
            <Card
                bordered={false}
                className={classNames('tariffs-plans__item', {
                    [className]: className,
                })}
                title={
                    <Row align='middle' justify='space-between'>
                        <Paragraph style={{ margin: 0 }}>{name} tariff</Paragraph>

                        <Button onClick={clickMoreCb} type='link' className='more-btn'>
                            Подробнее
                        </Button>
                    </Row>
                }
                cover={<img alt={name} src={imgSrc} />}
            >
                {children}
            </Card>
        );
    },
);
