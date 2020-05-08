import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { KustoService } from './services/kusto.service';
import { Month } from './models/month.model';
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



        // if (true) {
        if (firstDayOfCurrentMonth > this.firstDayOfFollowingMonth(mostRecentDate)) {



            // Loop through applications adding a new month to each, and collect all the neccessary metrics
            this.state.applications.forEach(app => {
                const month: Month = {
                    date: `${firstDayOfCurrentMonth.getMonth() + 1}/1/${firstDayOfCurrentMonth.getFullYear()}`
                };
                app.months.push(month);
                // Make first kusto query, and summarize results in UI
                this.kustoService.getApplicationsMakingRequests(app.name).subscribe(
                    x => month.applicationsMakingRequests = x,
                    err => console.error(err)
                );
            });
        }
    }

}
