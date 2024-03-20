import { memo } from 'react';
import { Empty } from 'antd';

export const EmptyIcon = memo(() => (
    <Empty
        image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
        imageStyle={{
            height: 60,
        }}
        description={null}
    />
));
