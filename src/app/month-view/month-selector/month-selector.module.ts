import {NgModule} from '@angular/core';
import {MonthSelectorComponent} from './month-selector.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
@NgModule({
    imports: [
        FormsModule, ReactiveFormsModule],
    declarations: [MonthSelectorComponent],
    exports: [MonthSelectorComponent]
})
export class MonthSelectorModule {
}
