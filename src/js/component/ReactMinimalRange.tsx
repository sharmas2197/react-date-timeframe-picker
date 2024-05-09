import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { cx, isValidDate } from './utils';
import LOCALE from './locale';
import Calendar from './Calendar';
import './react-calendar-range-picker.css';
const DEFAULT_LACALE = 'en-us';
interface IObjectKeysAny {
  [key: string]: any;
}
export interface CalendarPickerProps {
  show?: boolean;
  locale?: string;
  allowPageClickToClose?: boolean;
  defaultDate?: string;
  style?: React.CSSProperties;
  defaultTimes?: Array<string>;
  enableTimeSelection?: boolean;
  markedDates?: Array<string>;
  supportDateRange?: Array<string>;
  duration?: number;
  onClose?: () => void;
  onYearPicked?: (res: object) => void;
  onMonthPicked?: (res: object) => void;
  onDatePicked?: (res: object) => void;
  onResetDate?: (res: object) => void;
  onResetDefaultDate?: (res: object) => void;
  handleChooseHourPick?: (res: Array<string>) => void;
  handleChooseMinutePick?: (res: Array<string>) => void;
}
export const CalendarPicker: React.FC<CalendarPickerProps> = memo(
  ({
    show = false,
    locale = DEFAULT_LACALE,
    allowPageClickToClose = true,
    defaultDate = '',
    style = {},
    defaultTimes = ['', ''],
    enableTimeSelection = false,
    markedDates = [],
    supportDateRange = [],
    duration = 0,
    onClose = () => {},
    onYearPicked = () => {},
    onMonthPicked = () => {},
    onDatePicked = () => {},
    onResetDate = () => {},
    onResetDefaultDate = () => {},
    handleChooseHourPick = () => {},
    handleChooseMinutePick = () => {},
  }) => {
    const [internalShow, setInternalShow] = useState(show);
    const handleOnClose = useCallback(() => {
      setInternalShow(false);
      onClose && onClose();
    }, []);
    const handleOnYearPicked = useCallback(yearObj => {
      onYearPicked && onYearPicked(yearObj);
    }, []);
    const handleOnMonthPicked = useCallback(monthObj => {
      onMonthPicked && onMonthPicked(monthObj);
    }, []);
    const handleOnDatePicked = useCallback(dateObj => {
      onDatePicked && onDatePicked(dateObj);
    }, []);
    const handleOnResetDate = useCallback(dateObj => {
      onResetDate && onResetDate(dateObj);
    }, []);
    const handleOnResetDefaultDate = useCallback(dateObj => {
      onResetDefaultDate && onResetDefaultDate(dateObj);
    }, []);
    useEffect(() => {
      setInternalShow(show);
    }, [show]);
    const $elWrapper = useRef(null);
    useEffect(() => {
      if (typeof window !== 'undefined') {
        window.addEventListener('mousedown', pageClick);
        window.addEventListener('touchstart', pageClick);
        return () => {
          window.removeEventListener('mousedown', pageClick);
          window.removeEventListener('touchstart', pageClick);
        };
      }
    }, []);
    const pageClick = useCallback(
      e => {
        if (!allowPageClickToClose) {
          return;
        }
        if ($elWrapper.current.contains(e.target)) {
          return;
        }
        handleOnClose();
      },
      [allowPageClickToClose],
    );
    return (
      <div style={style} ref={$elWrapper}>
        {internalShow && (
          <CalendarPickerComponent
            show={internalShow}
            defaultDate={defaultDate}
            locale={locale}
            onClose={handleOnClose}
            handleOnYearPicked={handleOnYearPicked}
            handleOnMonthPicked={handleOnMonthPicked}
            handleOnDatePicked={handleOnDatePicked}
            handleOnResetDate={handleOnResetDate}
            handleOnResetDefaultDate={handleOnResetDefaultDate}
            enableTimeSelection={enableTimeSelection}
            defaultTimes={defaultTimes}
            handleChooseHourPick={handleChooseHourPick}
            handleChooseMinutePick={handleChooseMinutePick}
            markedDates={markedDates}
            supportDateRange={supportDateRange}
            duration={duration}
          />
        )}
      </div>
    );
  },
);
interface CalendarPickerComponentProps {
  show?: boolean;
  locale?: string;
  allowPageClickToClose?: boolean;
  defaultDate?: string;
  defaultTimes?: Array<string>;
  enableTimeSelection?: boolean;
  markedDates?: Array<string>;
  supportDateRange?: Array<string>;
  duration?: number;
  onClose?: () => void;
  handleOnYearPicked?: (res: object) => void;
  handleOnMonthPicked?: (res: object) => void;
  handleOnDatePicked?: (res: object) => void;
  handleOnResetDate?: (res: object) => void;
  handleOnResetDefaultDate?: (res: object) => void;
  handleChooseHourPick?: (res: Array<string>) => void;
  handleChooseMinutePick?: (res: Array<string>) => void;
}
const CalendarPickerComponent: React.FC<CalendarPickerComponentProps> = memo(
  ({
    show,
    defaultDate,
    locale,
    defaultTimes,
    markedDates,
    supportDateRange,
    enableTimeSelection,
    onClose,
    handleOnYearPicked,
    handleOnMonthPicked,
    handleOnDatePicked,
    handleOnResetDate,
    handleOnResetDefaultDate,
    handleChooseHourPick,
    handleChooseMinutePick,
  }) => {
    const isDefaultDatesValid = isValidDate(defaultDate);
    const [internalShow, setInternalShow] = useState(false);
    const [type, setType] = useState(TYPES[0]);
    const [startDatePickedArray, setStartDatePickedArray] = useState(defaultDate ? defaultDate.split('-') : []);
    const [startTimePickedArray, setStartTimePickedArray] = useState([defaultTimes[0].split(':')[0], defaultTimes[0].split(':')[1] || '']);
    const [selected, setSelected] = useState(isDefaultDatesValid ? true : false);
    const handleChooseStartTimeHour = useCallback(
      res => {
        setStartTimePickedArray([res, startTimePickedArray[1]]);
        handleChooseHourPick(res);
      },
      [startTimePickedArray],
    );
    const handleChooseStartTimeMinute = useCallback(
      res => {
        setStartTimePickedArray([startTimePickedArray[0], res]);
        handleChooseMinutePick(res);
      },
      [startTimePickedArray],
    );
    const handleOnClose = useCallback(() => {
      setInternalShow(false);
      onClose && onClose();
    }, []);
    useEffect(() => {
      if (show) {
        setTimeout(() => {
          setInternalShow(true);
        }, 0);
      }
    }, [show]);
    const handleOnChangeType = useCallback(() => {
      if (type === TYPES[0]) {
        setType(TYPES[1]);
      } else {
        setType(TYPES[0]);
      }
    }, [type]);
    const componentClass = useMemo(() => cx('react-calendar-range-picker', internalShow && 'visible'), [internalShow]);
    const LOCALE_DATA: IObjectKeysAny = useMemo(() => (LOCALE[locale] ? LOCALE[locale] : LOCALE['en-us']), [locale]);
    return (
      <div className={componentClass}>
        <svg className="react-calendar-range-picker__close" viewBox="0 0 20 20" width="15" height="15" onClick={handleOnClose}>
          <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z" />
        </svg>
        <div className={`react-minimal-datetime-date-piker`}>
          <div className={`react-calendar-range-picker__calendar`}>
            <Calendar
              defaultDate={defaultDate}
              locale={locale}
              onYearPicked={handleOnYearPicked}
              onMonthPicked={handleOnMonthPicked}
              onDatePicked={handleOnDatePicked}
              onResetDate={handleOnResetDate}
              onResetDefaultDate={handleOnResetDefaultDate}
              markedDates={markedDates}
              supportDateRange={supportDateRange}
            />
          </div>
          {type === TYPES[1] && (
            <div className="react-calendar-range-picker__time-piker" style={{ marginTop: '10px' }}>
              {/* <RangeTime
                startDatePickedArray={startDatePickedArray}
                handleChooseStartTimeHour={handleChooseStartTimeHour}
                handleChooseStartTimeMinute={handleChooseStartTimeMinute}
                startTimePickedArray={startTimePickedArray}
                showOnlyTime={true}
                LOCALE_DATA={LOCALE_DATA}
                singleMode={true}
              /> */}
            </div>
          )}
        </div>
        {enableTimeSelection && (
          <div
            className={cx('react-calendar-range-picker__button', 'react-calendar-range-picker__button--type', !selected && 'disabled')}
            onClick={selected ? handleOnChangeType : () => {}}
            style={{ padding: '0', marginTop: '10px' }}
          >
            {type === TYPES[0] ? LOCALE_DATA[TYPES[1]] : LOCALE_DATA[TYPES[0]]}
          </div>
        )}
      </div>
    );
  },
);

const TYPES = ['date', 'time'];
