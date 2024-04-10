import { Fragment, memo } from 'react';
import { Empty } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';

type TSpinnerProps = {
    text?: string;
    classNameText?: string;
};

export const EmptyIcon: React.FC<TSpinnerProps> = memo(({ text = '', classNameText = '' }) => (
    <Fragment>
        {text && <Paragraph className={classNameText}>Нет активных тренировок</Paragraph>}
        <Empty
            image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
            imageStyle={{
                height: 60,
            }}
            description={null}
        />
    </Fragment>
));
