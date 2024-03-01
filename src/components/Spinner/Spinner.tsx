import { Spin } from 'antd';
import classNames from 'classnames';

import './spinner.scss';

type TSpinnerProps = {
    className?: string;
};

export const Spinner: React.FC<TSpinnerProps> = ({ className = '' }) => {
    return (
        <div
            className={classNames('spinner', {
                [className]: className,
            })}
            data-test-id='loader'
        >
            <div className='overflow' />
            <Spin size='large' />
        </div>
    );
};
