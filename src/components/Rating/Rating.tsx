import { memo, useCallback } from 'react';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { Rate, RateProps } from 'antd';
import classNames from 'classnames';
import type { StarProps } from 'rc-rate/lib/Star';

import './rating.scss';

type TRatingProps = RateProps & {
    isClickable?: boolean;
    rating?: number;
    className?: string;
};

export const Rating: React.FC<TRatingProps> = memo(
    ({ className = '', isClickable = false, rating = 0, ...lastProps }) => {
        const characterStar = useCallback(
            ({ index }: StarProps) => {
                const curIndex = index || 0;

                return curIndex < rating ? <StarFilled /> : <StarOutlined />;
            },
            [rating],
        );

        return (
            <Rate
                className={classNames('rating', {
                    [className]: className,
                })}
                count={5}
                defaultValue={rating}
                character={characterStar}
                disabled={!isClickable}
                {...lastProps}
            />
        );
    },
);
