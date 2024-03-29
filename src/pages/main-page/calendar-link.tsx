import { useCallback } from 'react';
import { NAVIGATION_IDS } from '@constants/index';
import { useGetPersonalTrainings } from '@hooks/index';
import CalendarIcon from '@public/img/calendar.svg?react';
import { Button } from 'antd';

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
