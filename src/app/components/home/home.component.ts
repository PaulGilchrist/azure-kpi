import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AppInsightsService } from '../../services/app-insights.service';
import { AdalService } from 'adal-angular4';

import { State } from '../../models/state.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    enableExport = true;
    query = null; // { displayName: string, name: string }
    state: State = null;

    constructor(private appInsightsService: AppInsightsService, private http: HttpClient, public adalService: AdalService) {}

    ngOnInit() {
        this.appInsightsService.logPageView('home.component', '/home');
        // Get metrics
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: this.adalService.userInfo.token
            })
        };
        this.http.get<State>('https://apidev-function-app.azurewebsites.net/api/get-metrics', options).subscribe(
            data => {
                this.state = data;
            },
            error => console.log(error));
    }

    exportData() {
        const json = JSON.stringify(this.state);
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
        this.state.applications.forEach(application =>
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
