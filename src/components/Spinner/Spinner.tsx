import { memo } from 'react';
import { Row, Spin } from 'antd';
import classNames from 'classnames';

import './spinner.scss';

type TSpinnerProps = {
    className?: string;
};

export const Spinner: React.FC<TSpinnerProps> = memo(({ className = '' }) => (
    <Row
        className={classNames('spinner', {
            [className]: className,
        })}
        data-test-id='loader'
    >
        <Spin size='large' />
    </Row>
));
