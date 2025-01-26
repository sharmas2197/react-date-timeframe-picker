import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import { cx, isValidDates } from "../utils";
import LOCALE from "../locale";
import RangeDate from "./RangeDate";
import RangeTime from "./RangeTime";
const DEFAULT_LACALE = "en-us";
import { rangesObj } from "../const";

interface IObjectKeysAny {
  [key: string]: any;
}

const TYPES = ["date", "time"];

export interface RangePickerProps {
  show?: boolean;
  disabled?: boolean;
  locale?: string;
  allowPageClickToClose?: boolean;
  showOnlyTime?: boolean;
  defaultDate?: string;
  placeholder?: Array<string>;
  defaultDates?: Array<string>;
  defaultTimes?: Array<string>;
  initialDates?: Array<string>;
  initialTimes?: Array<string>;
  enableTimeSelection?: boolean;
  markedDates?: Array<string>;
  supportDateRange?: Array<string>;
  duration?: number;
  style?: React.CSSProperties;
  onConfirm?: (res: Array<string>) => void;
  onClear?: () => void;
  onClose?: () => void;
  onChooseDate?: (res: object) => void;
  minDate?: string;
  customRanges?: Array<{
    label: string;
    getValue: () => [Date, Date];
  }>;
}
export const RangePicker: React.FC<RangePickerProps> = memo(
  ({
    show = false,
    disabled = false,
    locale = DEFAULT_LACALE,
    allowPageClickToClose = true,
    showOnlyTime = false,
    placeholder = ["", ""],
    defaultDates = ["", ""],
    defaultTimes = ["", ""],
    initialDates = ["", ""],
    initialTimes = ["", ""],
    markedDates = [],
    supportDateRange = [],
    duration = 0,
    style = {},
    onChooseDate = () => {},
    onConfirm = () => {},
    onClear = () => {},
    onClose = () => {},
    minDate = "",
    customRanges = [],
  }) => {
    // ['YYYY-MM-DD', 'YYYY-MM-DD'] // ['hh:mm', 'hh:mm']
    const isDefaultDatesValid = isValidDates(defaultDates);
    const isInitialDatesValid = isValidDates(initialDates);
    const [selected, setSelected] = useState(
      isDefaultDatesValid ? true : false
    );
    const [start, setStart] = useState(
      defaultDates[0]
        ? `${defaultDates[0]} ${defaultTimes[0] ? defaultTimes[0] : ""}`
        : ""
    );
    const [end, setEnd] = useState(
      defaultDates[1]
        ? `${defaultDates[1]} ${defaultTimes[1] ? defaultTimes[1] : ""}`
        : ""
    );
    const [type, setType] = useState(TYPES[0]);
    const [internalShow, setInternalShow] = useState(show);
    const [startDatePickedArray, setStartDatePickedArray] = useState(
      defaultDates[0] ? defaultDates[0].split("-") : []
    );
    const [endDatePickedArray, setEndDatePickedArray] = useState(
      defaultDates[1] ? defaultDates[1].split("-") : []
    );
    const [currentDateObjStart, setCurrentDateObjStart] = useState({});
    const [currentDateObjEnd, setCurrentDateObjEnd] = useState({});
    const [startTimePickedArray, setStartTimePickedArray] = useState([
      defaultTimes[0].split(":")[0],
      defaultTimes[0].split(":")[1] || "",
    ]);
    const [endTimePickedArray, setEndTimePickedArray] = useState([
      defaultTimes[1].split(":")[0],
      defaultTimes[1].split(":")[1] || "",
    ]);
    const [dates, setDates] = useState(defaultDates);
    const [times, setTimes] = useState(defaultTimes);
    const [lastChosenRange, setLastChosenRange] = useState(
      customRanges && customRanges.length > 0 ? customRanges[0].label : "Today"
    );

    const handleChooseStartDate = useCallback(
      ({ name, month, year, value }) => {
        setDates([value, dates[1]]);
        setStartDatePickedArray(value === "" ? [] : [year, month, name]);
      },
      [dates]
    );
    const handleChooseEndDate = useCallback(
      ({ name, month, year, value }) => {
        setDates([dates[0], value]);
        setEndDatePickedArray(value === "" ? [] : [year, month, name]);
      },
      [dates]
    );
    const handleChooseStartTimeHour = useCallback(
      (res) => {
        setStartTimePickedArray((prev) => [res, ...prev.slice(1)]);
      },
      []
    );
    const handleChooseStartTimeMinute = useCallback(
      (res) => {
        setStartTimePickedArray((prevArray) => [...prevArray.slice(0, 1), res]);
      },
      []
    );
    const handleChooseEndTimeHour = useCallback(
      (res) => {
        setEndTimePickedArray((prevArray) => [res, ...prevArray.slice(1)]);
      },
      []
    );
    const handleChooseEndTimeMinute = useCallback(
      (res) => {
        setEndTimePickedArray((prevArray) => [...prevArray.slice(0, 1), res]);
      },
      []
    );
    const handleOnChangeType = useCallback(() => {
      if (type === TYPES[0]) {
        setType(TYPES[1]);
      } else {
        setType(TYPES[0]);
      }
    }, [type]);
    const handleOnConfirm = useCallback(
      (sd = null, ed = null, st = null, et = null) => {
        if (!sd) {
          sd = startDatePickedArray;
        }
        if (!ed) {
          ed = endDatePickedArray;
        }
        if (!st) {
          st = startTimePickedArray;
        }
        if (!et) {
          et = endTimePickedArray;
        }
        const a = new Date(sd.join("-"));
        const b = new Date(ed.join("-"));
        const starts = a < b ? sd : ed;
        const ends = a > b ? sd : ed;
        const startStr = `${starts.join("-")} ${
          st[0] && st[1] ? st.join(":") : ""
        }`;
        const endStr = `${ends.join("-")} ${
          et[0] && et[1] ? et.join(":") : ""
        }`;
        setStart(startStr);
        setEnd(endStr);
        setStartDatePickedArray(starts);
        setEndDatePickedArray(ends);
        setStartTimePickedArray(st);
        setEndTimePickedArray(et);
        setDates([starts.join("-"), ends.join("-")]);
        setInternalShow(false);
        onConfirm && onConfirm([startStr, endStr]);
      },
      [
        startDatePickedArray,
        endDatePickedArray,
        startTimePickedArray,
        endTimePickedArray,
      ]
    );
    const handleOnClear = useCallback(
      (e) => {
        if (disabled) {
          return;
        }
        e.stopPropagation();
        if (isInitialDatesValid) {
          handleOnConfirm(
            initialDates[0].split("-"),
            initialDates[1].split("-"),
            initialTimes[0].split(":"),
            initialTimes[1].split(":")
          );
          return;
        }
        setSelected(false);
        setInternalShow(false);
        setStart("");
        setEnd("");
        setStartDatePickedArray([]);
        setEndDatePickedArray([]);
        setDates(["", ""]);
        setTimes(["", ""]);
        setLastChosenRange("");
        setStartTimePickedArray(["00", "00"]);
        setEndTimePickedArray(["00", "00"]);
        onClear && onClear();
      },
      [disabled, initialDates, initialTimes]
    );
    useEffect(() => {
      setType(TYPES[0]);
    }, [internalShow]);
    useEffect(() => {
      if (!internalShow) {
        onClose && onClose();
      }
    }, [internalShow]);
    useEffect(() => {
      setStart(
        defaultDates[0]
          ? `${defaultDates[0]} ${defaultTimes[0] ? defaultTimes[0] : ""}`
          : ""
      );
      setEnd(
        defaultDates[1]
          ? `${defaultDates[1]} ${defaultTimes[1] ? defaultTimes[1] : ""}`
          : ""
      );
    }, [defaultDates]);
    const $elWrapper = useRef(null);
    useEffect(() => {
      if (typeof window !== "undefined") {
        window.addEventListener("mousedown", pageClick);
        window.addEventListener("touchstart", pageClick);
        return () => {
          window.removeEventListener("mousedown", pageClick);
          window.removeEventListener("touchstart", pageClick);
        };
      }
    }, []);
    const pageClick = useCallback(
      (e) => {
        if (!allowPageClickToClose) {
          return;
        }
        if ($elWrapper.current.contains(e.target)) {
          return;
        }
        setInternalShow(false);
      },
      [allowPageClickToClose]
    );
    const isInitial = useMemo(
      () =>
        start === `${initialDates[0]} ${initialTimes[0]}` &&
        end === `${initialDates[1]} ${initialTimes[1]}`,
      [initialDates, initialTimes, start, end]
    );
    const isEmpty = useMemo(() => !start && !end, [start, end]);
    const valueStart = useMemo(
      () => (showOnlyTime ? start.split(" ")[1] : start),
      [showOnlyTime, start]
    );
    const valueEnd = useMemo(
      () => (showOnlyTime ? end.split(" ")[1] : end),
      [showOnlyTime, end]
    );
    const handleOnConfirmClick = useCallback(() => {
      handleOnConfirm();
    }, [
      startDatePickedArray,
      endDatePickedArray,
      startTimePickedArray,
      endTimePickedArray,
    ]);
    return (
      <div className="react-calendar-range-picker__range" style={style}>
        <span
          className={`react-calendar-range-picker__range-input-wrapper ${
            disabled && "disabled"
          }`}
          onClick={() => !disabled && setInternalShow(!internalShow)}
        >
          <input
            readOnly={true}
            placeholder={placeholder[0]}
            className={`react-calendar-range-picker__range-input ${
              disabled && "disabled"
            }`}
            value={valueStart}
          />
          <span className="react-calendar-range-picker__range-input-separator">
            {" "}
            ~{" "}
          </span>
          <input
            readOnly={true}
            placeholder={placeholder[1]}
            className={`react-calendar-range-picker__range-input ${
              disabled && "disabled"
            }`}
            value={valueEnd}
          />
          {!isInitial && !isEmpty ? (
            <svg
              className={`react-calendar-range-picker__clear ${
                disabled && "disabled"
              }`}
              width="15"
              height="15"
              viewBox="0 0 24 24"
              onClick={handleOnClear}
            >
              <path
                className="react-calendar-range-picker__icon-fill"
                d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
              />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          ) : (
            <svg
              className="react-calendar-range-picker__clear"
              width="15"
              height="15"
              viewBox="0 0 24 24"
            >
              <path
                className="react-calendar-range-picker__icon-fill"
                d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"
              />
              <path fill="none" d="M0 0h24v24H0z" />
            </svg>
          )}
        </span>
        <div ref={$elWrapper}>
          {internalShow && (
            <RangePickerComponent
              show={internalShow}
              selected={selected}
              setSelected={setSelected}
              handleChooseStartDate={handleChooseStartDate}
              handleChooseEndDate={handleChooseEndDate}
              dates={dates}
              times={times}
              locale={locale}
              startDatePickedArray={startDatePickedArray}
              endDatePickedArray={endDatePickedArray}
              type={type}
              handleOnChangeType={handleOnChangeType}
              handleOnConfirmClick={handleOnConfirmClick}
              startTimePickedArray={startTimePickedArray}
              endTimePickedArray={endTimePickedArray}
              handleChooseStartTimeHour={handleChooseStartTimeHour}
              handleChooseStartTimeMinute={handleChooseStartTimeMinute}
              handleChooseEndTimeHour={handleChooseEndTimeHour}
              handleChooseEndTimeMinute={handleChooseEndTimeMinute}
              currentDateObjStart={currentDateObjStart}
              setCurrentDateObjStart={setCurrentDateObjStart}
              currentDateObjEnd={currentDateObjEnd}
              setCurrentDateObjEnd={setCurrentDateObjEnd}
              showOnlyTime={showOnlyTime}
              markedDates={markedDates}
              supportDateRange={supportDateRange}
              duration={duration}
              onChooseDate={onChooseDate}
              lastChosenRange={lastChosenRange}
              setLastChosenRange={setLastChosenRange}
              minDate={minDate}
              customRanges={customRanges}
            />
          )}
        </div>
      </div>
    );
  }
);

interface RangePickerComponentProps {
  show: boolean;
  locale: string;
  selected: boolean;
  setSelected: (res: boolean) => void;
  dates: Array<string>;
  times: Array<string>;
  type: string;
  startDatePickedArray: Array<string>;
  endDatePickedArray: Array<string>;
  startTimePickedArray: Array<string>;
  endTimePickedArray: Array<string>;
  currentDateObjStart: object;
  setCurrentDateObjStart: (res: object) => void;
  currentDateObjEnd: object;
  setCurrentDateObjEnd: (res: object) => void;
  showOnlyTime: boolean;
  markedDates: Array<string>;
  supportDateRange?: Array<string>;
  duration?: number;
  handleOnChangeType: () => void;
  onChooseDate: (res: object) => void;
  handleOnConfirmClick: () => void;
  handleChooseStartTimeHour: (res: string) => void;
  handleChooseStartTimeMinute: (res: string) => void;
  handleChooseEndTimeHour: (res: string) => void;
  handleChooseEndTimeMinute: (res: string) => void;
  handleChooseStartDate: (res: object) => void;
  handleChooseEndDate: (res: object) => void;
  lastChosenRange?: string;
  setLastChosenRange: (res: string) => void;
  minDate?: string;
  customRanges?: Array<{
    label: string;
    getValue: () => [Date, Date];
  }>;
}
const RangePickerComponent: React.FC<RangePickerComponentProps> = memo(
  ({
    show,
    locale,
    selected,
    setSelected,
    dates,
    type,
    startDatePickedArray,
    endDatePickedArray,
    startTimePickedArray,
    endTimePickedArray,
    handleChooseStartDate,
    handleChooseEndDate,
    currentDateObjStart,
    setCurrentDateObjStart,
    currentDateObjEnd,
    setCurrentDateObjEnd,
    showOnlyTime,
    markedDates,
    supportDateRange,
    duration,
    onChooseDate,
    handleOnChangeType,
    handleOnConfirmClick,
    handleChooseStartTimeHour,
    handleChooseStartTimeMinute,
    handleChooseEndTimeHour,
    handleChooseEndTimeMinute,
    lastChosenRange,
    setLastChosenRange,
    minDate,
    customRanges,
  }) => {
    const [internalShow, setInternalShow] = useState(false);
    useEffect(() => {
      if (show) {
        setTimeout(() => {
          setInternalShow(true);
        }, 0);
      }
    }, [show]);
    const componentClass = useMemo(
      () => cx("react-calendar-range-picker", internalShow && "visible"),
      [internalShow]
    );
    const LOCALE_DATA: IObjectKeysAny = useMemo(
      () => (LOCALE[locale] ? LOCALE[locale] : LOCALE["en-us"]),
      [locale]
    );

    const [chosenRange, setChosenRange] = useState(
      customRanges && customRanges.length > 0 ? customRanges[0].label : "Today"
    );

    useEffect(() => {
      if (show) {
        if (customRanges && customRanges.length > 0) {
          setChosenRange(customRanges[0].label);
          handleCustomRangeSelection(customRanges[0].getValue);
        } else {
          setChosenRange(lastChosenRange);
        }
      }
    }, [show, customRanges]);

    const changeRange = (rangeType: string) => {
      setChosenRange(rangeType);
      setLastChosenRange(rangeType);
    };

    const handleRangeSelection = useCallback(
      (range) => {
        changeRange(range);

        const [start, end] = rangesObj[range];

        const formatDateTimeWithPadding = (dateTime: Date) => {
          const year = String(dateTime.getFullYear());
          const month = String(dateTime.getMonth() + 1).padStart(2, "0"); // Add leading zero if necessary
          const day = String(dateTime.getDate()).padStart(2, "0"); // Add leading zero if necessary
          const hours = String(dateTime.getHours()).padStart(2, "0");
          const minutes = String(dateTime.getMinutes()).padStart(2, "0");
          return {
            name: day,
            month: month,
            year: year,
            hours: hours,
            minutes: minutes,
            value: `${year}-${month}-${day} ${hours}:${minutes}`,
          };
        };

        const formattedStartDate = formatDateTimeWithPadding(start);
        const formattedEndDate = formatDateTimeWithPadding(end);

        // Update the selected start and end dates
        handleChooseStartDate({
          name: formattedStartDate.name,
          month: formattedStartDate.month,
          year: formattedStartDate.year,
          value: formattedStartDate.value,
        });
        handleChooseEndDate({
          name: formattedEndDate.name,
          month: formattedEndDate.month,
          year: formattedEndDate.year,
          value: formattedEndDate.value,
        });

        // Update the selected start and end times
        handleChooseStartTimeHour(formattedStartDate.hours);
        handleChooseStartTimeMinute(formattedStartDate.minutes);
        handleChooseEndTimeHour(formattedEndDate.hours);
        handleChooseEndTimeMinute(formattedEndDate.minutes);

        setSelected(true);
        setInternalShow(true);
      },
      [
        handleChooseStartDate,
        handleChooseEndDate,
        handleChooseStartTimeHour,
        handleChooseStartTimeMinute,
        handleChooseEndTimeHour,
        handleChooseEndTimeMinute,
      ]
    );

    const handleCustomRangeSelection = useCallback((getValue: () => [Date, Date]) => {
      const [start, end] = getValue();

      const formatDateTimeWithPadding = (dateTime: Date) => {
        const year = String(dateTime.getFullYear());
        const month = String(dateTime.getMonth() + 1).padStart(2, '0');
        const day = String(dateTime.getDate()).padStart(2, '0');
        const hours = String(dateTime.getHours()).padStart(2, '0');
        const minutes = String(dateTime.getMinutes()).padStart(2, '0');
        return {
          name: day,
          month: month,
          year: year,
          hours: hours,
          minutes: minutes,
          value: `${year}-${month}-${day} ${hours}:${minutes}`,
        };
      };

      const formattedStartDate = formatDateTimeWithPadding(start);
      const formattedEndDate = formatDateTimeWithPadding(end);

      handleChooseStartDate({
        name: formattedStartDate.name,
        month: formattedStartDate.month,
        year: formattedStartDate.year,
        value: formattedStartDate.value,
      });
      handleChooseEndDate({
        name: formattedEndDate.name,
        month: formattedEndDate.month,
        year: formattedEndDate.year,
        value: formattedEndDate.value,
      });

      handleChooseStartTimeHour(formattedStartDate.hours);
      handleChooseStartTimeMinute(formattedStartDate.minutes);
      handleChooseEndTimeHour(formattedEndDate.hours);
      handleChooseEndTimeMinute(formattedEndDate.minutes);

      setSelected(true);
      setInternalShow(true);
    }, [
      handleChooseStartDate,
      handleChooseEndDate,
      handleChooseStartTimeHour,
      handleChooseStartTimeMinute,
      handleChooseEndTimeHour,
      handleChooseEndTimeMinute,
    ]);

    return (
      <div className={componentClass}>
        <div
          className="react-minimal-datetime-date-picker"
          style={{ display: "flex" }}
        >
          <div className="ranges-selector">
            <ul>
              {(!customRanges || customRanges.length === 0) && 
                Object.entries(rangesObj).map(
                  ([range, [startDate, endDate]]) => (
                    <li key={range} className={`${range === chosenRange ? "active" : ""}`}>
                      <div
                        className={`selector-button ${
                          range === chosenRange ? "active" : ""
                        }`}
                        onClick={() => handleRangeSelection(range)}
                      >
                        {range}
                      </div>
                    </li>
                  )
                )
              }
              
              {customRanges && customRanges.map((range, index) => (
                <li key={`custom-${index}`} className={`${range.label === chosenRange ? "active" : ""}`}>
                  <div
                    className={`selector-button ${range.label === chosenRange ? "active" : ""}`}
                    onClick={() => {
                      setChosenRange(range.label);
                      setLastChosenRange(range.label);
                      handleCustomRangeSelection(range.getValue);
                    }}
                  >
                    {range.label}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <RangeDate
            selected={selected}
            setSelected={setSelected}
            handleChooseStartDate={(data) => {
              changeRange("Custom range");
              handleChooseStartDate(data);
            }}
            handleChooseEndDate={(data) => {
              changeRange("Custom range");
              handleChooseEndDate(data);
            }}
            rangeDirection="start"
            defaultDateStart={dates[0]}
            defaultDateEnd={dates[1]}
            locale={locale}
            startDatePickedArray={startDatePickedArray}
            endDatePickedArray={endDatePickedArray}
            currentDateObjStart={currentDateObjStart}
            setCurrentDateObjStart={setCurrentDateObjStart}
            currentDateObjEnd={currentDateObjEnd}
            setCurrentDateObjEnd={setCurrentDateObjEnd}
            markedDates={markedDates}
            supportDateRange={supportDateRange}
            duration={duration}
            onChooseDate={onChooseDate}
            minDate={minDate}
          />
          <div className="react-minimal-datetime-date-picker__divider" />
          <RangeDate
            selected={selected}
            setSelected={setSelected}
            handleChooseStartDate={(data) => {
              changeRange("Custom range");
              handleChooseStartDate(data);
            }}
            handleChooseEndDate={(data) => {
              changeRange("Custom range");
              handleChooseEndDate(data);
            }}
            rangeDirection="end"
            defaultDateStart={dates[0]}
            defaultDateEnd={dates[1]}
            locale={locale}
            startDatePickedArray={startDatePickedArray}
            endDatePickedArray={endDatePickedArray}
            currentDateObjStart={currentDateObjStart}
            setCurrentDateObjStart={setCurrentDateObjStart}
            currentDateObjEnd={currentDateObjEnd}
            setCurrentDateObjEnd={setCurrentDateObjEnd}
            markedDates={markedDates}
            supportDateRange={supportDateRange}
            duration={duration}
            onChooseDate={onChooseDate}
            minDate={minDate}
          />
          {(showOnlyTime || type === TYPES[1]) && (
            <div className="react-calendar-range-picker__time-piker">
              <RangeTime
                startDatePickedArray={startDatePickedArray}
                endDatePickedArray={endDatePickedArray}
                handleChooseStartTimeHour={handleChooseStartTimeHour}
                handleChooseStartTimeMinute={handleChooseStartTimeMinute}
                handleChooseEndTimeHour={handleChooseEndTimeHour}
                handleChooseEndTimeMinute={handleChooseEndTimeMinute}
                startTimePickedArray={startTimePickedArray}
                endTimePickedArray={endTimePickedArray}
                showOnlyTime={showOnlyTime}
                LOCALE_DATA={LOCALE_DATA}
              />
            </div>
          )}
        </div>
        <div className="react-calendar-range-picker__button-wrapper">
          {!showOnlyTime && (
            <div
              className={cx(
                "react-calendar-range-picker__button",
                "react-calendar-range-picker__button--type",
                !selected && "disabled"
              )}
              onClick={selected ? handleOnChangeType : () => {}}
            >
              {type === TYPES[0]
                ? LOCALE_DATA[TYPES[1]]
                : LOCALE_DATA[TYPES[0]]}
            </div>
          )}
          <div
            className={cx(
              "react-calendar-range-picker__button",
              "react-calendar-range-picker__button--confirm",
              !selected && "disabled"
            )}
            onClick={selected ? handleOnConfirmClick : () => {}}
          >
            {LOCALE_DATA["confirm"]}
          </div>
        </div>
      </div>
    );
  }
);
