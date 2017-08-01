import {MonthSelectorModule} from './month-selector/month-selector.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MonthViewComponent} from "./month-view.component";
import {CommonModule} from '@angular/common';
import {NgModule, Directive, PipeTransform, Pipe} from '@angular/core';
import {HolidaysService} from "./holidays.service";
import {HolidaySelectorComponent} from "./holiday-selector/holiday-selector.component";

@Pipe({name: 'hideLessEqZero'})
export class ZeroHiddenPipe implements PipeTransform {
    transform(value: number, exponent: string): string {
        return value <= 0 ? '' : value + '';
    }
}

@NgModule({
    imports: [CommonModule,
        FormsModule, ReactiveFormsModule, MonthSelectorModule],
    declarations: [MonthViewComponent, ZeroHiddenPipe, HolidaySelectorComponent], exports: [MonthViewComponent],
    providers: [HolidaysService]
})
export class MonthViewModule {
}
