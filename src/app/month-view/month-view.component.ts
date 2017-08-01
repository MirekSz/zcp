import {Component, OnInit, AfterViewInit, AfterViewChecked, Input, Output, EventEmitter} from '@angular/core';
import {Month} from "./month-selector/month-selector.component";
import {HolidaysService} from './holidays.service';
import * as moment from 'moment';

declare var $: any;
@Component({
  selector: 'month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css']
})
export class MonthViewComponent implements OnInit {
  @Input() program: string;
  @Output() onMonthChange = new EventEmitter<{month: Month, days: Array<WorkingDay>}>();

  month: Month;
  private days: Array<WorkingDay> = [];
  private holidays: Array<any>;

  constructor(private service: HolidaysService) {
  }


  ngOnInit() {
    this.service.getHilidays().then((data: any) => {
      this.holidays = data.json().map(el => {
        el.date = moment(el.date);
        el.start = moment(el.start);
        el.end = moment(el.end);
        return el;
      });
      this.markHolidays();
    })
  }


  markHolidays() {
    if (!this.holidays) {
      return;
    }
    for (let day of this.days) {
      for (let holiday of this.holidays) {
        if (holiday.date.isSame(day.monthDate, 'day')) {
          day.setHoliday();
        }
      }
    }
  }

  showMonthDays(month: Month) {
    this.month = month;
    this.days = [];
    let date = month.date;
    let lastDay = date.endOf('month').date();
    for (let i = 1; i <= lastDay; i++) {
      let monthDate = date.clone().date(i);

      let workingDay = new WorkingDay(i, 8, monthDate);
      if (monthDate.isoWeekday() == 6 || monthDate.isoWeekday() == 7) {
        workingDay.workHours = 0;
        workingDay.weekend = true;
      }
      this.days.push(workingDay);
    }
    this.onMonthChange.emit({month:this.month,days:this.days});
    this.markHolidays();
  }

}
const WORK_DAY = 8;
class WorkingDay {
  constructor(public lp: number, public workHours: number, public monthDate: any) {
    this.dayName = monthDate.format('dddd')
  }

  public nonWorkReason: string;
  public weekend: boolean;
  public holiday: boolean;
  public dayName: string;
  private _nonWorkHours: number = 0;

  set nonWorkHours(val) {
    this._nonWorkHours = val;
    this.workHours = WORK_DAY - val;
  }

  get nonWorkHours() {
    return this._nonWorkHours;
  }

  setNonWork(reason: string) {
    this.nonWorkReason = reason;
    this.nonWorkHours = 8;
  }

  setHoliday() {
    this.nonWorkReason = 'Święto';
    this.nonWorkHours = 8;
    this.workHours = null;
    this.holiday = true;
  }

}
