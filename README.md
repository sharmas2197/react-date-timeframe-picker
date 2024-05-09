# react-datetime-range

# Docs Link
[Custom Locale Guide(can be multiple locales)](#custom-locale)

### Version of ```16.8.6``` or higher of react and react-dom is required.
```js
  "peerDependencies": {
    "react": ">= 16.8.6",
    "react-dom": ">= 16.8.6"
  }
```

# Installation
```sh
npm install react-datetime-range --save
```

# Browser support
Tested on IE9+ and Chrome and Safari(10.0.3)

# Docs

```js
import { CalendarPicker, RangePicker } from 'react-datetime-range';
import 'react-datetime-range/lib/react-datetime-range.min.css';

<RangePicker
  locale="en-us"// ['en-us', 'zh-cn','ko-kr']; default is en-us
  show={false} // default is false
  disabled={false} // default is false
  allowPageClickToClose={true} // default is true
  onConfirm={res => console.log(res)}
  onClose={() => console.log('onClose')}
  onClear={() => console.log('onClear')}
  style={{ width: '300px', margin: '0 auto' }}
  placeholder={['Start Time', 'End Time']}
  // markedDates={[`${todayY}-${todayM}-${todayD - 1}`, `${todayY}-${todayM}-${todayD}`]} // OPTIONAL. ['YYYY-MM-DD']
  showOnlyTime={false} // default is false, only select time
  // duration={2} // day count. default is 0. End date will be automatically added 2 days when the start date is picked.
  // onChooseDate={res => {}} // on date clicked
  ////////////////////
  // IMPORTANT DESC //
  ////////////////////
  defaultDates={[year+'-'+month+'-'+date,year+'-'+month+'-'+date]}
  // ['YYYY-MM-DD', 'YYYY-MM-DD']
  // This is the value you choosed every time.
  defaultTimes={[hour+':'+minute,hour+':'+minute]}
  // ['hh:mm', 'hh:mm']
  // This is the value you choosed every time.
  initialDates={[year+'-'+month+'-'+date,year+'-'+month+'-'+date]}
  // ['YYYY-MM-DD', 'YYYY-MM-DD']
  // This is the initial dates.
  // If provied, input will be reset to this value when the clear icon hits,
  // otherwise input will be display placeholder
  initialTimes={[hour+':'+minute,hour+':'+minute]}
  // ['hh:mm', 'hh:mm']
  // This is the initial times.
  // If provied, input will be reset to this value when the clear icon hits,
  // otherwise input will be display placeholder
/>
```


### <a name="custom-locale"></a>Custom Locale (can be multiple locales)
By providing ```window.REACT_DATETIME_RANGE['customLocale']```, you can overwrite the current locale if you like or add a new locale.


```html
        <script type="text/javascript">
        window.REACT_DATETIME_RANGE = {
            customLocale: {
                "my-own-locale": {...},//structure must follow below
                'es': {
                    weeks: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    date: 'Select date',
                    time: 'Select time',
                    confirm: 'Confirm',
                    start: 'Start',
                    end: 'End',
                    date_format: (month, year) => {
                      return `${month} ${year}`;
                    },
                }
            }
        }
        </script>
```