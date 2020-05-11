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

    firstDayOfCurrentMonth() {
        // Return the first day of the current month
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        return new Date(year, month, 1);
    }


    firstDayOfFollowingMonth(date: Date) {
        // Return the first day of the following month
        const year = date.getFullYear();
        const month = date.getMonth();
        if (month === 11) {
            return new Date(year + 1, 0, 1);
        } else {
            return new Date(year, month + 1, 1);
        }
    }

    processState() {
        console.log(this.state);
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
        // Determine if it is time to get the next month's of data
        // Date will be first of month when full month was collected
        const firstDayOfCurrentMonth = this.firstDayOfCurrentMonth();
        if (firstDayOfCurrentMonth > this.firstDayOfFollowingMonth(mostRecentDate)) {
            // Loop through applications adding a new month to each, and collecting all the neccessary metrics
            environment.applications.forEach(envApp => {
                // Get matching app from state
                let app = this.state.applications.find(a => a.name === envApp.name);
                if (app === undefined) {
                    app = this.createNewApp(envApp);
                }
                const month: Month = {
                    date: `${firstDayOfCurrentMonth.getMonth() + 1}/1/${firstDayOfCurrentMonth.getFullYear()}`
                };
                app.months.push(month);
                let observableArray = [
                    this.kustoService.getKustoResult(app, Query.ActiveApplications),
                    this.kustoService.getKustoResult(app, Query.ActiveEndpointActions),
                    this.kustoService.getKustoResult(app, Query.ActiveUsers),
                    this.kustoService.getKustoResult(app, Query.AvgIODataBytesPerSec),
                    this.kustoService.getKustoResult(app, Query.AvgResponseTimeSqlMilliseconds),
                    this.kustoService.getKustoResult(app, Query.MaxNormalizedPercentProcessorTime),
                    this.kustoService.getKustoResult(app, Query.MinAvailableMemoryMB),
                    this.kustoService.getKustoResult(app, Query.ReadPercent),
                    this.kustoService.getKustoResult(app, Query.RequestErrorPercent),
                    // this.kustoService.getKustoResult(app, Query.SqlMaxDtuPercent)
                    this.kustoService.getKustoResult(app, Query.TotalRequests)
                ];
                // CP has the API and Web together requiring a unique query
                if (app.name === 'CP') {
                    observableArray.push(this.kustoService.getKustoResult(app, Query.AvgResponseTimeMillisecondsCP));
                } else {
                    observableArray.push(this.kustoService.getKustoResult(app, Query.AvgResponseTimeMilliseconds));
                }
                if (app.name !== 'EDH') {
                    observableArray.push(this.kustoService.getKustoResult(app, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.EDH));
                }
                if (app.name === 'PHD') {
                    observableArray = observableArray.concat([
                        this.kustoService.getKustoResult(app, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.Aspose),
                        this.kustoService.getKustoResult(app, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.Docusign),
                        this.kustoService.getKustoResult(app, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.EBillExpress),
                        this.kustoService.getKustoResult(app, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.MicrosoftOnline),
                        this.kustoService.getKustoResult(app, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.PicturePark)
                    ]);
                }
                forkJoin(observableArray).subscribe(results => {
                    month.activeApplications = results[0];
                    month.activeEndpointActions = results[1];
                    month.activeUsers = results[2];
                    month.avgIODataBytesPerSec = results[3];
                    month.avgResponseTimeSqlMilliseconds = results[4];
                    month.maxNormalizedPercentProcessorTime = results[5];
                    month.minAvailableMemoryMB = results[6];
                    month.readPercent = Number(results[7]);
                    month.requestErrorPercent = Number(results[8]);
                    month.totalRequests = Number(results[9]);
                    month.avgResponseTimeMilliseconds = results[10];
                    if (app.name !== 'EDH') {
                        month.avgResponseTimeEdhMilliseconds = results[11];
                    }
                    if (app.name === 'PHD') {
                        month.avgResponseTimeAsposeMilliseconds = results[12];
                        month.avgResponseTimeDocusignMilliseconds = results[13];
                        month.avgResponseTimeEBillExpressMilliseconds = results[14];
                        month.avgResponseTimeMicrosoftOnlineMilliseconds = results[15];
                        month.avgResponseTimePictureParkMilliseconds = results[16];
                    }
                    // Save to local storage
                    localStorage.setItem('state', JSON.stringify(this.state));
                }, err => console.error(err));
            });
        }
    }



}
