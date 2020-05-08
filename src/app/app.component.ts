import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { KustoService } from './services/kusto.service';
import { DependencyName } from './models/dependencyName.model';
import { Month } from './models/month.model';
import { Query } from './models/query.model';
import { State } from './models/state.model';

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
            this.state.applications.forEach(app => {
                let query = '';
                const month: Month = {
                    date: `${firstDayOfCurrentMonth.getMonth() + 1}/1/${firstDayOfCurrentMonth.getFullYear()}`
                };
                app.months.push(month);
                this.kustoService.getKustoResult(app, Query.ActiveApplications).subscribe(
                    x => month.activeApplications = x, err => console.error(err)
                );
                this.kustoService.getKustoResult(app, Query.ActiveEndpointActions).subscribe(
                    x => month.activeEndpointActions = x, err => console.error(err)
                );
                this.kustoService.getKustoResult(app, Query.ActiveUsers).subscribe(
                    x => month.activeUsers = x, err => console.error(err)
                );
                this.kustoService.getKustoResult(app, Query.AvgIODataBytesPerSec).subscribe(
                    x => month.avgIODataBytesPerSec = x, err => console.error(err)
                );
                this.kustoService.getKustoResult(app, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.EDH).subscribe(
                    x => month.avgResponseTimeEdhMilliseconds = x, err => console.error(err)
                );
                if (app.name === 'PHD') {
                    this.kustoService.getKustoResult(app, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.Aspose).subscribe(
                        x => month.avgResponseTimeAsposeMilliseconds = x, err => console.error(err)
                    );
                    this.kustoService.getKustoResult(app, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.Docusign).subscribe(
                        x => month.avgResponseTimeDocusignMilliseconds = x, err => console.error(err)
                    );
                    this.kustoService.getKustoResult(app, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.EBillExpress).subscribe(
                        x => month.avgResponseTimeEBillExpressMilliseconds = x, err => console.error(err)
                    );
                    this.kustoService.getKustoResult(app, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.MicrosoftOnline).subscribe(
                        x => month.avgResponseTimeMicrosoftOnlineMilliseconds = x, err => console.error(err)
                    );
                    this.kustoService.getKustoResult(app, Query.AvgResponseTimeDependencyMilliseconds, DependencyName.PicturePark).subscribe(
                        x => month.avgResponseTimePictureParkMilliseconds = x, err => console.error(err)
                    );
                }
                // CP has the API and Web together requiring a unique query
                if (app.name === 'CP') {
                    query = Query.AvgResponseTimeMillisecondsCP;
                } else {
                    query = Query.AvgResponseTimeMilliseconds;
                }
                this.kustoService.getKustoResult(app, query).subscribe(
                    x => month.avgResponseTimeMilliseconds = x, err => console.error(err)
                );
                this.kustoService.getKustoResult(app, Query.AvgResponseTimeSqlMilliseconds).subscribe(
                    x => month.avgResponseTimeSqlMilliseconds = x, err => console.error(err)
                );
                this.kustoService.getKustoResult(app, Query.MaxNormalizedPercentProcessorTime).subscribe(
                    x => month.maxNormalizedPercentProcessorTime = x, err => console.error(err)
                );
                this.kustoService.getKustoResult(app, Query.MinAvailableMemoryMB).subscribe(
                    x => month.minAvailableMemoryMB = x, err => console.error(err)
                );
                this.kustoService.getKustoResult(app, Query.RequestErrorPercent).subscribe(
                    x => month.requestErrorPercent = Number(x), err => console.error(err)
                );
                this.kustoService.getKustoResult(app, Query.ReadPercent).subscribe(
                    x => month.readPercent = Number(x), err => console.error(err)
                );
                // this.kustoService.getKustoResult(app, Query.SqlMaxDtuPercent).subscribe(
                //     x => month.sqlMaxDtuPercent = x, err => console.error(err)
                // );
                this.kustoService.getKustoResult(app, Query.TotalRequests).subscribe(
                    x => month.totalRequests = Number(x), err => console.error(err)
                );
            });
        }
    }

}
