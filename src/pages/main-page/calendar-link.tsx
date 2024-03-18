import { useCallback } from 'react';
import { useGetPersonalTrainings } from '@hooks/index';
import { Button } from 'antd';
import { NAVIGATION_IDS } from '@constants/index';
import CalendarIcon from '@public/img/calendar.svg?react';

export const CalendarLink = () => {
    const { getPersonalTrainings } = useGetPersonalTrainings();

    const calendarHandler = useCallback(() => {
        getPersonalTrainings();
    }, [getPersonalTrainings]);

    return (
        <Button
            className='card-link'
            onClick={calendarHandler}
            type='link'
            data-test-id={NAVIGATION_IDS.sidebarCalendarBtn}
        >
            <CalendarIcon />
            <span className='card-link__name'>Календарь</span>
        </Button>
    );
};
