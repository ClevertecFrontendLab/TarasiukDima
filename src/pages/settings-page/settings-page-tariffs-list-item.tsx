import { FC, memo } from 'react';
import { Button, Card, Row } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import classNames from 'classnames';
import { TClsAndChildProps, TSimpleFn } from 'src/app-types/index';

type TTariffCartItemProps = TClsAndChildProps & {
    name: string;
    imgSrc?: string;
    clickMoreCb: TSimpleFn;
    dataTestId?: string;
};

export const SettingsPageTariffsListItem: FC<TTariffCartItemProps> = memo(
    ({
        name,
        children,
        imgSrc = 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        clickMoreCb,
        className = '',
        dataTestId = '',
    }) => (
        <Card
            bordered={false}
            className={classNames('tariffs-plans__item', {
                [className]: className,
            })}
            data-test-id={dataTestId}
            title={
                <Row align='middle' justify='space-between'>
                    <Paragraph style={{ margin: 0 }}>
                        <span className='tariffs-plans__item_name'>{name}</span> tariff
                    </Paragraph>

                    <Button onClick={clickMoreCb} type='link' className='more-btn'>
                        Подробнее
                    </Button>
                </Row>
            }
            cover={<img alt={name} src={imgSrc} />}
        >
            {children}
        </Card>
    ),
);
