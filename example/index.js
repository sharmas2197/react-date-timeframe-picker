import "core-js/stable";
import "regenerator-runtime/runtime";
import React, { useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import prefixAll from "inline-style-prefix-all";
import "../src/css/example.css";
import { CalendarPicker, RangePicker } from "../src/js/component/index";
import "../src/js/component/react-calendar-range-picker.css";
const now = new Date();
const todayY = now.getFullYear();
const todayM = now.getMonth() + 1;
const todayD = now.getDate();
const currentHour = String(now.getHours()).padStart(2, '0');    // Get current hour
const currentMinute = String(now.getMinutes()).padStart(2, '0'); // Get current minute
if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
    padString = String(typeof padString !== "undefined" ? padString : " ");
    if (this.length >= targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}
const customRanges = [
  {
    label: "Last 24 Hours",
    getValue: () => {
      const end = new Date();
      const start = new Date(end.getTime() - (24 * 60 * 60 * 1000)); // 24 hours ago
      return [start, end];
    }
  },
  {
    label: "Next 7 Days",
    getValue: () => {
      const start = new Date();
      const end = new Date(start.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days ahead
      return [start, end];
    }
  },
  {
    label: "Last 7 Days",
    getValue: () => {
      const start = new Date();
      const end = new Date(start.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7 days ahead
      return [start, end];
    }
  },
  {
    label: "Next Month",
    getValue: () => {
      const start = new Date();
      const end = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate());
      return [start, end];
    }
  },
  {
    label: "Last 3 Hours",
    getValue: () => {
      const end = new Date();
      const start = new Date(end.getTime() - (3 * 60 * 60 * 1000)); // 3 hours ago
      return [start, end];
    }
  },
  {
    label: "Next 5 Hours",
    getValue: () => {
      const start = new Date();
      const end = new Date(start.getTime() + (5 * 60 * 60 * 1000)); // 5 hours ahead
      return [start, end];
    }
  }
];
const Component = () => {
  const $passwordWrapperRef = useRef(null);
  const $pinWrapperRef = useRef(null);
  const $activationWrapperRef = useRef(null);
  const [showCalendarPicker, setShowCalendarPicker] = useState(true);
  const [hour, setHour] = useState(currentHour);
  const [minute, setMinute] = useState(currentMinute);
  const [month, setMonth] = useState(
    String(now.getMonth() + 1).padStart(2, "0")
  );
  const [date, setDate] = useState(String(now.getDate()).padStart(2, "0"));
  const [year, setYear] = useState(String(now.getFullYear()));
  return (
    <div className={"wrapper"}>
      <div>
        <h3>CalendarPicker</h3>
      </div>
      <div className={"example-section"}>
        <div style={prefixAll({ flex: "0 0 50%" })}>
          <div style={{ marginBottom: "10px" }}>
            <div
              onClick={() => {
                setShowCalendarPicker(!showCalendarPicker);
              }}
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              {!showCalendarPicker ? (
                <span>Show CalendarPicker</span>
              ) : (
                <span>Close CalendarPicker</span>
              )}
            </div>
            <CalendarPicker
              locale={`en-us`} // ['en-us', 'zh-cn','ko-kr']; default is en-us
              show={showCalendarPicker} //default is false
              onClose={() => setShowCalendarPicker(false)}
              allowPageClickToClose={true} // default is true
              defaultDate={year + "-" + month + "-" + date} // OPTIONAL. format: "YYYY-MM-DD"
              onYearPicked={(res) => console.log(res)}
              onMonthPicked={(res) => console.log(res)}
              onDatePicked={(res) => console.log(res)}
              onResetDate={(res) => console.log(res)}
              onResetDefaultDate={(res) => console.log(res)}
              style={{ width: "300px", margin: "10px auto 0" }}
              markedDates={[
                `${todayY}-${todayM}-${todayD - 1}`,
                `${todayY}-${todayM}-${todayD}`,
              ]} // OPTIONAL. ['YYYY-MM-DD']
              // supportDateRange={[`2022-02-16`, `2022-12-10`]} // "YYYY-MM-DD"
              // defaultTimes={['10:12']} // OPTIONAL
              // enableTimeSelection={true} // OPTIONAL
              // handleChooseHourPick={res => console.log(res)} // OPTIONAL
              // handleChooseMinutePick={res => console.log(res)} // OPTIONAL
            />
          </div>
        </div>
        <div style={prefixAll({ flex: "0 0 50%" })}>
          <div style={{ maxWidth: "800px" }}></div>
        </div>
      </div>
      
      <div>
        <h3>RangePicker with customRange</h3>
      </div>
      <div className={"example-section"}>
        <div style={prefixAll({ flex: "0 0 50%" })}>
          <div style={{ marginBottom: "10px" }}>
            <RangePicker
              locale={`en-us`} // default is en-us
              show={false} // default is false
              disabled={false} // default is false
              allowPageClickToClose={true} // default is true
              placeholder={["Start Time", "End Time"]}
              defaultDates={[
                year + "-" + month + "-" + date,
                year + "-" + month + "-" + date,
              ]} // ['YYYY-MM-DD', 'YYYY-MM-DD']
              defaultTimes={[`${hour}:${minute}`, `${hour}:${minute}`]} // ['hh:mm', 'hh:mm']
              initialDates={[
                year + "-" + month + "-" + date,
                year + "-" + month + "-" + date,
              ]} // ['YYYY-MM-DD', 'YYYY-MM-DD']
              initialTimes={[`${hour}:${minute}`, `${hour}:${minute}`]} // ['hh:mm', 'hh:mm']
              onConfirm={(res) => console.log(res, 1)}
              onClose={() => console.log("closed")}
              style={{ width: "300px", margin: "0 auto" }}
              customRanges={customRanges}
            />
          </div>
        </div>
        <div style={prefixAll({ flex: "0 0 50%" })}>
          <div style={{ maxWidth: "800px" }}></div>
        </div>
      </div>

            
      <div>
        <h3>RangePicker with minDate</h3>
      </div>
      <div className={"example-section"}>
        <div style={prefixAll({ flex: "0 0 50%" })}>
          <div style={{ marginBottom: "10px" }}>
            <RangePicker
              minDate="2025-01-13"
              locale={`en-us`} // default is en-us
              show={false} // default is false
              disabled={false} // default is false
              allowPageClickToClose={true} // default is true
              placeholder={["Start Time", "End Time"]}
              defaultDates={[
                year + "-" + month + "-" + date,
                year + "-" + month + "-" + date,
              ]} // ['YYYY-MM-DD', 'YYYY-MM-DD']
              defaultTimes={[`${hour}:${minute}`, `${hour}:${minute}`]} // ['hh:mm', 'hh:mm']
              initialDates={[
                year + "-" + month + "-" + date,
                year + "-" + month + "-" + date,
              ]} // ['YYYY-MM-DD', 'YYYY-MM-DD']
              initialTimes={[`${hour}:${minute}`, `${hour}:${minute}`]} // ['hh:mm', 'hh:mm']
              onConfirm={(res) => console.log(res, 1)}
              onClose={() => console.log("closed")}
              style={{ width: "300px", margin: "0 auto" }}
              
            />
          </div>
        </div>
        <div style={prefixAll({ flex: "0 0 50%" })}>
          <div style={{ maxWidth: "800px" }}></div>
        </div>
      </div>
    </div>
  );
};

// <Markdown source={markdownTextboxEmptyExample} renderers={{ CodeBlock }} />

ReactDOM.render(<Component />, document.getElementById("root"));
