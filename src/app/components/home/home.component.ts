import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppInsightsService } from '../../services/app-insights.service';

import { AzureService } from '../../services/azure.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy, OnInit {
    query = null; // { displayName: string, name: string }
    metrics = null;

    subscriptions: Subscription[] = [];

    constructor(private appInsightsService: AppInsightsService, private azureService: AzureService) {}

    ngOnDestroy(): void {
        // Unsubscribe all subscriptions to avoid memory leak
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    ngOnInit() {
        this.appInsightsService.logPageView('home.component', '/home');
        // Get metrics
        this.subscriptions.push(this.azureService.getMetrics().subscribe(metrics => {
            this.metrics = metrics;
        }));
    }

    exportData() {
        const json = JSON.stringify(this.metrics);
        const blob = new Blob([json], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = 'app-metrics.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    exportDataCsv() {
        let csv = 'applicationName,applicationFullName,date,metricName,metricValue\n';
        this.metrics.applications.forEach(application =>
            application.months.forEach(month =>
                Object.getOwnPropertyNames(month).forEach(metricName => {
                    const metricValue = month[metricName];
                    if (metricName !== 'date' && metricValue !== null) {
                        csv += `${application.name},${application.fullName},${month.date},${metricName},${metricValue}\n`;
                    }
                })
            )
        );
        const blob = new Blob([csv], { type: 'text/plain' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = 'app-metrics.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    onQuerySelect(query) {
        // Pass name and displayName to graph-modal
        this.query = query;
    }

}
