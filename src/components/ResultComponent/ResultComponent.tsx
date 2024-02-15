import { ReactNode } from 'react';
import { Result } from 'antd';
import UserLayout from '@components/UserLayout';
import { ResultStatusType } from 'antd/lib/result';

import './result.scss';

interface IResultComponentProps {
    status?: ResultStatusType;
    title?: ReactNode;
    subTitle?: ReactNode;
    extra?: ReactNode;
}

export const ResultComponent: React.FC<IResultComponentProps> = ({
    status = '500',
    title = '500',
    subTitle = '',
    extra = '',
}) => {
    return (
        <UserLayout className='result-content'>
            <Result status={status} title={title} subTitle={subTitle} extra={extra} />
        </UserLayout>
    );
};
