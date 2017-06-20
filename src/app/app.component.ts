import {Component, OnInit} from '@angular/core';
import monthPrinter from './MonthPrinter';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    title = 'app works!';
    public userData: any = {program: 'NEXT + VERTO', user: ''};
    private month: any;
    private days: any;
    private numbers: any;

    ngOnInit(): void {
        this.numbers = [];
        for (let i = 0; i < 1000; i++) {
            this.numbers.push(i)
        }
        let item = localStorage.getItem('userData');
        if (item) {
            this.userData = JSON.parse(item);
        }
    }

    print() {
        monthPrinter(this.userData, this.month, this.days);
        localStorage.setItem('userData', JSON.stringify(this.userData));
    }

    monthChange(event) {
        this.month = event.month;
        this.days = event.days;
    }
}
