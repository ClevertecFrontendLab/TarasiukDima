/* eslint-disable import/no-extraneous-dependencies */
import { FC } from 'react';
import { DATE_FORMAT_TO_VIEW } from '@constants/index';
import DateIcon from '@public/img/dateIcon.svg?react';
import { ConfigProvider } from 'antd';
import generatePicker from 'antd/es/date-picker/generatePicker';
import locale from 'antd/es/locale/ru_RU';
import { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

type TAppDatePickerProps = {
    name: string;
    placeholder?: string;
    value: Dayjs | null;
    onChange: (value: Dayjs | null) => void;
    dataTestId?: string;
    style?: React.CSSProperties;
    className?: string;
    disabledDate?: (date: Dayjs) => boolean;
};
export const AppDatePicker: FC<TAppDatePickerProps> = ({
    name,
    placeholder = '',
    value,
    onChange,
    dataTestId = '',
    className = '',
    style,
    disabledDate,
}) => (
    <ConfigProvider locale={locale}>
        <DatePicker
            disabledDate={disabledDate}
            name={name}
            className={className}
            placeholder={placeholder}
            value={value}
            format={DATE_FORMAT_TO_VIEW}
            suffixIcon={<DateIcon />}
            onChange={onChange}
            style={style}
            data-test-id={dataTestId}
        />
    </ConfigProvider>
);
