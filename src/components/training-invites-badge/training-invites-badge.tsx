import { memo } from 'react';
import { TClsAndChildProps } from '@app-types/common';
import { useAppSelector } from '@hooks/index';
import { Badge } from 'antd';

type TSpinnerProps = TClsAndChildProps & {
    size?: 'default' | 'small';
    dataTestId?: string;
};

export const TrainingInvitesBadge: React.FC<TSpinnerProps> = memo(
    ({ children, size = 'default', className = '', dataTestId = '' }) => {
        const invites = useAppSelector((state) => state.user.invites);
        const count = invites.length;

        if (!count) return children;

        return (
            <Badge data-test-id={dataTestId} className={className} count={count} size={size}>
                {children}
            </Badge>
        );
    },
);
