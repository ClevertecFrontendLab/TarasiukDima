import { FC, ReactNode, useCallback } from 'react';
import { useGetPersonalTrainings } from '@hooks/index';
import { Button } from 'antd';

type TLinkWithLoadPersonalDataProps = {
    goodLoadRoute: string;
    children: ReactNode;
    testId?: string;
};
export const LinkWithLoadPersonalData: FC<TLinkWithLoadPersonalDataProps> = ({
    goodLoadRoute,
    children,
    testId = '',
}) => {
    const { getPersonalTrainings } = useGetPersonalTrainings(goodLoadRoute);

    const calendarHandler = useCallback(() => {
        getPersonalTrainings();
    }, [getPersonalTrainings]);

    return (
        <Button className='card-link' onClick={calendarHandler} type='link' data-test-id={testId}>
            {children}
        </Button>
    );
};
