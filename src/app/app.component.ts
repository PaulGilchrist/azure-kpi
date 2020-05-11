import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../environments/environment';

import { KustoService } from './services/kusto.service';
import { DependencyName } from './models/dependencyName.model';
import { Month } from './models/month.model';
import { Query } from './models/query.model';
import { State } from './models/state.model';
import { forkJoin } from 'rxjs';
import { Application } from './models/application.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'azure-kpi';
    edhApplicationsMakingRequestsLastMonth: number;
    enableExport = true;
    state: State = null;

    constructor(private http: HttpClient, public kustoService: KustoService) { }

    ngOnInit() {
        // Get data from local storage if it exists otherwise pull from state.json
        const stateJson = localStorage.getItem('state');
        if (stateJson) {
            this.state = JSON.parse(stateJson);
            this.processState();
        } else {
            this.http.get<State>('./data/state.json').subscribe(
                x => {
                    this.state = x;
                    this.processState();
                },
                err => console.error(err)
            );
        }
    }

    addMonth(app: Application, date: Date) {
        // Get data for the full month preceeding the date passed in
        // ex: 5/15/2020 passed means get the full month od April (May data collection is not completed yet)
        const fromDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        const toDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const month: Month = {
            // January is 0 not 1
            date: `${toDate.getMonth() + 1}/1/${toDate.getFullYear()}`
        };
        app.months.push(month);
        this.enableExport = false;
        let observableArray = [
            this.kustoService.getKustoResult(app, fromDate, toDate, Query.ActiveApplications),
            this.kustoService.getKustoResult(app, fromDate, toDate, Query.ActiveEndpointActions),
            this.kustoService.getKustoResult(app, fromDate, toDate, Query.ActiveUsers),
            this.kustoService.getKustoResult(app, fromDate, toDate, Query.AvgIODataBytesPerSec),
            this.kustoService.getKustoResult(app, fromDate, toDate, Query.AvgResponseTimeSqlMilliseconds),
            this.kustoService.getKustoResult(app, fromDate, toDate, Query.MaxNormalizedPercentProcessorTime),
            this.kustoService.getKustoResult(app, fromDate, toDate, Query.MinAvailableMemoryMB),
            this.kustoService.getKustoResult(app, fromDate, toDate, Query.ReadPercent),
            this.kustoService.getKustoResult(app, fromDate, toDate, Query.RequestErrorPercent),
            this.kustoService.getKustoResult(app, fromDate, toDate, Query.TotalRequests),
            this.kustoService.getKustoResult(app, fromDate, toDate, Query.AvgResponseTimeMilliseconds)
            // this.kustoService.getKustoResult(app, Query.SqlMaxDtuPercent)
        ];
        if (app.name !== 'AMPP' && app.name !== 'DMV-CD' && app.name !== 'EDH' && app.name !== 'RTS') {
            observableArray.push(this.kustoService.getKustoResult(app, fromDate, toDate, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.EDH));
        }
        if (app.name === 'PHD') {
            observableArray = observableArray.concat([
                this.kustoService.getKustoResult(app, fromDate, toDate, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.Aspose),
                this.kustoService.getKustoResult(app, fromDate, toDate, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.Docusign),
                this.kustoService.getKustoResult(app, fromDate, toDate, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.EBillExpress),
                this.kustoService.getKustoResult(app, fromDate, toDate, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.MicrosoftOnline),
                this.kustoService.getKustoResult(app, fromDate, toDate, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.PicturePark)
            ]);
        }
        forkJoin(observableArray).subscribe(results => {
            month.activeApplications = Number(results[0]);
            month.activeEndpointActions = Number(results[1]);
            month.activeUsers = Number(results[2]);
            month.avgIODataBytesPerSec = Number(results[3]);
            month.avgResponseTimeSqlMilliseconds = Number(results[4]);
            month.maxNormalizedPercentProcessorTime = Number(results[5]);
            month.minAvailableMemoryMB = Number(results[6]);
            month.readPercent = Number(results[7]);
            month.requestErrorPercent = Number(results[8]);
            month.totalRequests = Number(results[9]);
            month.avgResponseTimeMilliseconds = Number(results[10]);
            if (app.name !== 'AMPP' && app.name !== 'DMV-CD' && app.name !== 'EDH' && app.name !== 'RTS') {
                month.avgResponseTimeEdhMilliseconds = Number(results[11]);
            }
            if (app.name === 'PHD') {
                month.avgResponseTimeAsposeMilliseconds = Number(results[12]);
                month.avgResponseTimeDocusignMilliseconds = Number(results[13]);
                month.avgResponseTimeEBillExpressMilliseconds = Number(results[14]);
                month.avgResponseTimeMicrosoftOnlineMilliseconds = Number(results[15]);
                month.avgResponseTimePictureParkMilliseconds = Number(results[16]);
            }
            // Save to local storage
            localStorage.setItem('state', JSON.stringify(this.state));
            this.enableExport = true;
        }, err => console.error(err));
    }

    createNewApp(envApp) {
        // Create new app
        const app = {
            fullName: envApp.fullName,
            months: [],
            name: envApp.name
        };
        this.state.applications.push(app);
        // Keep applications in fullName sort order
        this.state.applications.sort((a, b) => {
            if (a.fullName < b.fullName) {
                return -1;
            } else if (b.fullName < a.fullName) {
                return 1;
            } else {
                return 0;
            }
        });
        return app;
    }

    processState() {
        const today = new Date();
        const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        // Determine the last month of data collected
        let mostRecentDate = new Date('1/1/2020');
        this.state.applications.forEach(app =>
            app.months.forEach(month => {
                const metricsDate = new Date(month.date);
                if (metricsDate > mostRecentDate) {
                    mostRecentDate = metricsDate;
                }
            })
        );
        // Determine if any new applications were added to the environment
        environment.applications.forEach(envApp => {
            // Get matching app from state
            let app = this.state.applications.find(a => a.name === envApp.name);
            if (app === undefined) {
                app = this.createNewApp(envApp);
                // Try and get last 2 months of data
                this.addMonth(app, new Date(mostRecentDate.getFullYear(), mostRecentDate.getMonth() - 1, mostRecentDate.getDay()));
                this.addMonth(app, mostRecentDate);
            }
            // Determine if it is time to get the next month's of data
            // Date will be first of month when full month was collected (ex: 1/1/2020 means all of January)
            if (mostRecentDate < firstDayOfCurrentMonth) {
                this.addMonth(app, firstDayOfCurrentMonth);
            }
        });
    }

}
