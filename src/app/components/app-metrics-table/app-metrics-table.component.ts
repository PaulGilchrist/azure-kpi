import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AzureService } from '../../services/azure.service';

import { Application } from '../../models/application.model';
import { Month } from '../../models/month.model';

@Component({
    selector: 'app-metrics-table',
    templateUrl: './app-metrics-table.component.html',
    styleUrls: ['./app-metrics-table.component.scss']
})
export class AppMetricsTableComponent implements OnDestroy, OnInit {
    queries = null;

    @Input() application: Application;
    @Output() readonly querySelect = new EventEmitter<any>(); // { displayName: string, name: string }

    subscriptions: Subscription[] = [];

    constructor(private azureService: AzureService) {}

    ngOnDestroy(): void {
        // Unsubscribe all subscriptions to avoid memory leak
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    ngOnInit() {
        // Get queries
        this.subscriptions.push(this.azureService.getQueries().subscribe(queries => {
            this.queries = queries;
        }));
    }

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
