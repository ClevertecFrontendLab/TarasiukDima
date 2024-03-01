import classNames from 'classnames';
import { Rate, RateProps } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';

import './rating.scss';

type TRatingProps = RateProps & {
    isClickable?: boolean;
    rating?: number;
    className?: string;
};

export const Rating: React.FC<TRatingProps> = ({
    className = '',
    isClickable = false,
    rating = 0,
    ...lastProps
}) => (
    <Rate
        className={classNames('rating', {
            [className]: className,
        })}
        count={5}
        defaultValue={rating}
        character={({ index }) => {
            const curIndex = index ? index : 0;
            return curIndex < rating ? (
                <StarFilled color='#faad14' />
            ) : (
                <StarOutlined color='#faad14' />
            );
        }}
        disabled={!isClickable}
        {...lastProps}
    />
);
