import { Component, OnInit, Query } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AdalService } from 'adal-angular4';

import { environment } from '../../../environments/environment';

import { KustoService } from '../../services/kusto.service';
import { Month } from '../../models/month.model';
import { State } from '../../models/state.model';

import { Application } from '../../models/application.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    enableExport = true;
    query = null; // { displayName: string, name: string }
    state: State = null;

    constructor(public adalService: AdalService, private http: HttpClient, public kustoService: KustoService) {
        // init requires object with clientId and tenant properties
        adalService.init(environment.azureAuthProvider);
    }

    ngOnInit() {
        this.adalService.handleWindowCallback();
        if (!this.adalService.userInfo.authenticated) {
            this.adalService.login();
        }
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
        const observableArray = [];
        environment.queries.forEach(query => observableArray.push(this.kustoService.getKustoResult(app, fromDate, toDate, query.query)));
        forkJoin(observableArray).subscribe(results => {
            for (let i = 0; i < environment.queries.length; i++) {
                month[environment.queries[i].name] = Number(results[i]);
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

    importData(event) {
        if (event.target.files.length !== 1) {
            console.error('No file selected');
        } else {
            const reader = new FileReader();
            reader.onloadend = (e) => {
                // handle data processing
                const fileAsString = reader.result.toString();
                if (event.target.files[0].name.endsWith('.csv')) {
                    console.log('Importing CSV');
                    this.state.applications = [];
                    const rows = fileAsString.split('\n');
                    // Skip the header row
                    for (let i = 1; i < rows.length; i++) {
                        const columns = rows[i].split(',');
                        // Add app if it does not already exist
                        if (columns[0] !== '') {
                            let app = this.state.applications.find(a => a.name === columns[0]);
                            if (app === undefined) {
                                app = this.createNewApp({
                                    fullName: columns[1],
                                    months: [],
                                    name: columns[0]
                                });
                            }
                            // Add month if it does not already exist
                            let month = app.months.find(m => m.date === columns[2]);
                            if (month === undefined) {
                                month = { date: columns[2] };
                                // Keep months in date sort order
                                app.months.sort((a, b) => {
                                    const aDate = new Date(a.date);
                                    const bDate = new Date(b.date);
                                    if (aDate < bDate) {
                                        return -1;
                                    } else if (bDate < aDate) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                });
                                app.months.push(month);
                            }
                            // Add month property
                            month[columns[3]] = Number(columns[4]);
                        }
                    }
                } else {
                    console.log('Importing JSON');
                    this.state = JSON.parse(fileAsString);
                }
                console.log(this.state);
                // Save to local storage
                localStorage.setItem('state', JSON.stringify(this.state));
            };
            reader.readAsText(event.target.files[0]);
        }
    }

    onQuerySelect(query) {
        // Pass name and displayName to graph-modal
        this.query = query;
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
