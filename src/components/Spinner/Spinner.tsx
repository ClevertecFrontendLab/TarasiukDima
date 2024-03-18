import { memo } from 'react';
import classNames from 'classnames';
import { Row, Spin } from 'antd';
import { LOADER_ID } from '@constants/index';

import './spinner.scss';

type TSpinnerProps = {
    className?: string;
};

export const Spinner: React.FC<TSpinnerProps> = memo(({ className = '' }) => (
    <Row
        className={classNames('spinner', {
            [className]: className,
        })}
        data-test-id={LOADER_ID}
    >
        <Spin size='large' />
    </Row>
));
