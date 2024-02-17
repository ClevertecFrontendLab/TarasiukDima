import { ReactNode } from 'react';
import { Result } from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import { UserLayout } from '@components/index';

import './result.scss';

interface IResultComponentProps {
    showSpinner?: boolean;
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
    showSpinner = false,
}) => {
    return (
        <UserLayout className='result-content' showSpinner={showSpinner}>
            <Result status={status} title={title} subTitle={subTitle} extra={extra} />
        </UserLayout>
    );
};