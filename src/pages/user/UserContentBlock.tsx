import { Logo, UserLayout } from '@components/index';

import './auth.scss';
import { ReactNode } from 'react';

export const UserContentBlock: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <UserLayout>
            <div className='content-block'>{children}</div>
        </UserLayout>
    );
};
