import { ConfigProvider } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generateCalendar from 'antd/es/calendar/generateCalendar';
import locale from 'antd/es/locale/ru_RU';
import localeRu from 'dayjs/locale/ru';

dayjs.locale('ru', localeRu);
const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig);

export const CalendarTraining = () => {
    const onPanelChange = (date: Dayjs) => {
        console.log('onPanelChange', date.format('YYYY-MM-DD'));
    };

    const onSelect = (date: Dayjs) => {
        console.log('onSelect', date.format('YYYY-MM-DD'));
    };

    return (
        <ConfigProvider locale={locale}>
            <Calendar fullscreen={true} onSelect={onSelect} onChange={onPanelChange} />
        </ConfigProvider>
    );
};
