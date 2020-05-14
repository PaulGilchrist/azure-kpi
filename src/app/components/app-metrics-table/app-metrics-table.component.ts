import { Component, EventEmitter, Input, Output } from '@angular/core';

import { environment } from '../../../environments/environment';

import { Application } from '../../models/application.model';
import { Month } from '../../models/month.model';

@Component({
    selector: 'app-metrics-table',
    templateUrl: './app-metrics-table.component.html',
    styleUrls: ['./app-metrics-table.component.scss']
})
export class AppMetricsTableComponent {

    environment = environment;

    @Input() application: Application;

    @Output() readonly querySelect = new EventEmitter<any>(); // { displayName: string, name: string }

    numberWithCommas(x) {
        if (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return '';
    }

    appHasDataForProperty(months: Month[], propertyName: string) {
        return months.findIndex(x => x[propertyName] != null && !isNaN(x[propertyName])) !== -1;
    }

    selectQuery(query): void {
        this.querySelect.emit(query);
    }



}
