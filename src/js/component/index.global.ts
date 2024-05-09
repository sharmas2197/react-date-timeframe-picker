import { CalendarPicker } from './ReactMinimalRange';
import { RangePicker } from './RangePicker/RangePicker';

if (typeof window !== 'undefined') {
  (<any>window).CalendarPicker = CalendarPicker;
  (<any>window).RangePicker = RangePicker;
}

export { CalendarPicker, RangePicker };
