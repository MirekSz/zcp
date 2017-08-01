import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import * as moment from 'moment';
import 'moment/min/locales.min';
@Component({
  selector: 'month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.css']
})
export class MonthSelectorComponent implements OnInit {
  month: Month;
  @Output() onMonthSelected = new EventEmitter<Month>();

  constructor() {
  }


  ngOnInit() {
    moment().locale('pl');
    moment.locale('pl');
    this.changeMonth(0);
  }

  next() {
    this.changeMonth(1);
    return false;
  }


  prev() {
    this.changeMonth(-1);
    return false;
  }

  changeMonth(diff) {
    if (diff == 0) {
      let current = moment();
      let number = current.date();
      if (number < 15) {
        current.month(current.month() - 1);
      }
      let month = current.month();
      let format = current.format('MMMM') + ' ' + current.format('YYYY');
      this.month = {monthNumber: ++month, name: format, date: current}
    }
    let date = this.month.date;
    date.month(date.month() + diff);
    let month = this.month.date.month();
    let format = this.month.date.format('MMMM') + ' ' + this.month.date.format('YYYY');
    this.month = {monthNumber: (month + 1), name: format, date: date};
    this.onMonthSelected.emit(this.month);
  }


}

export interface Month {
  monthNumber: number;
  name: string;
  date: any
}
