import { ReactNode } from 'react';
import { Result } from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import { UserLayout } from '@components/index';

import './result.scss';

type TResultComponentProps = {
    showSpinner?: boolean;
    status?: ResultStatusType;
    title?: ReactNode;
    subTitle?: ReactNode;
    extra?: ReactNode;
};

export const ResultComponent: React.FC<TResultComponentProps> = ({
    status = '500',
    title = '500',
    subTitle = '',
    extra = '',
    showSpinner = false,
}) => (
    <UserLayout className='result-content' showSpinner={showSpinner}>
        <Result status={status} title={title} subTitle={subTitle} extra={extra} />
    </UserLayout>
);
