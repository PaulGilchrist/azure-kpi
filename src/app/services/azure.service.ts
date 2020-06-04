import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, throwError as observableThrowError, Observable} from 'rxjs';
import { catchError,  retryWhen, tap } from 'rxjs/operators';

import { AdalService } from 'adal-angular4';

import { genericRetryStrategy } from './generic-retry-strategy';

@Injectable()
export class AzureService {
    private metrics = new BehaviorSubject(null);
    private queries = new BehaviorSubject(null);

    constructor(private adalService: AdalService, private http: HttpClient) { }

    public getMetrics(force: boolean = false): Observable<any> {
        if (force || !this.metrics.getValue()) { // Could also set caching threshold here
            // Pull data from local storage cache for fast startup while in parallel pulling from Azure
            const cachedMetrics = localStorage.getItem('kpiMetrics');
            if(cachedMetrics != null) {
                this.metrics.next(JSON.parse(cachedMetrics));
            }
            // In the future we may decide to only get the metrics from azure if null or current month > last month of collected metrics
            const options = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: this.adalService.userInfo.token
                })
            };
            this.http.get('https://apidev-function-app.azurewebsites.net/api/get-metrics', options).pipe(
                retryWhen(genericRetryStrategy()),
                tap(metrics => {
                    localStorage.setItem('kpiMetrics', JSON.stringify(metrics));
                    this.metrics.next(metrics);
                }),
                catchError(this.handleError)
            ).subscribe();
        }
        return this.metrics.asObservable();
    }

    public getQueries(force: boolean = false): Observable<any> {
        if (force || !this.queries.getValue()) { // Could also set caching threshold here
            // Pull data from local storage cache for fast startup while in parallel pulling from Azure
            const cachedQueries = localStorage.getItem('kpiQueries');
            if(cachedQueries != null) {
                this.queries.next(JSON.parse(cachedQueries));
            }
            // In the future we may decide to only get the metrics from azure if null or current month > last month of collected metrics
            const options = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: this.adalService.userInfo.token
                })
            };
            this.http.get('https://apidev-function-app.azurewebsites.net/api/get-queries', options).pipe(
                retryWhen(genericRetryStrategy()),
                tap(queries => {
                    localStorage.setItem('kpiQueries', JSON.stringify(queries));
                    this.queries.next(queries);
                }),
                catchError(this.handleError)
            ).subscribe();
        }
        return this.queries.asObservable();
    }

    private handleError(error: Response) {
        // In the future, we may send the error to some remote logging infrastructure
        console.error(error);
        return observableThrowError(error || 'Server error');
    }

}
