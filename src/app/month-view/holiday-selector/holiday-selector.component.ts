import {Component, OnInit, Input, EventEmitter, ViewChild, ElementRef, QueryList} from '@angular/core';
import 'moment/min/locales.min';

let dataSource = ['Urlop', 'Święto', 'Konferencja',
    'Chorobowe'
];

declare var $: any;
@Component({
    selector: 'holiday-selector',
    templateUrl: './holiday-selector.component.html',
    styleUrls: ['./holiday-selector.component.css']
})
export class HolidaySelectorComponent implements OnInit {
    @Input()
    private day: any;

    @ViewChild("myInput")
    private input: ElementRef;

    constructor() {
    }


    ngOnInit() {
        var self = this;
        setTimeout(() => {
            $(this.input.nativeElement).kendoComboBox({
                dataSource: dataSource,
                change: function (event) {
                    let value = this.value();
                    self.day.setNonWork(value);
                    // console.log('event: ', event, value);
                }
            });

            var combobox = $(self.input.nativeElement).data("kendoComboBox");
            if (self.day.holiday) {
                combobox.value(self.day.nonWorkReason)
            }
        }, 0)
    }


}
