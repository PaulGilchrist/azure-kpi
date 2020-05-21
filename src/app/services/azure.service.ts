import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, combineLatest, throwError as observableThrowError, Observable, of } from 'rxjs';
import { catchError, map, retryWhen, tap } from 'rxjs/operators';

import { AdalService } from 'adal-angular4';

import { genericRetryStrategy } from './generic-retry-strategy';

@Injectable()
export class AzureService {
    private metrics = new BehaviorSubject(null);
    metrics$ = this.metrics.asObservable();
    private queries = new BehaviorSubject(null);
    queries$ = this.queries.asObservable();

    constructor(private adalService: AdalService, private http: HttpClient) { }

    public getMetrics(force: boolean = false): Observable<any> {
        if (force || !this.metrics.getValue()) {
            const options = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: this.adalService.userInfo.token
                })
            };
            this.http.get('https://apidev-function-app.azurewebsites.net/api/get-metrics', options).pipe(
                retryWhen(genericRetryStrategy()),
                tap(metrics => {
                    this.metrics.next(metrics);
                }),
                catchError(this.handleError)
            ).subscribe();
        }
        return this.metrics$;
    }

    public getQueries(force: boolean = false): Observable<any> {
        if (force || !this.queries.getValue()) {
            const options = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: this.adalService.userInfo.token
                })
            };
            this.http.get('https://apidev-function-app.azurewebsites.net/api/get-queries', options).pipe(
                retryWhen(genericRetryStrategy()),
                tap(queries => {
                    this.queries.next(queries);
                }),
                catchError(this.handleError)
            ).subscribe();
        }
        return this.queries$;
    }

    private handleError(error: Response) {
        // In the future, we may send the server to some remote logging infrastructure
        console.error(error);
        return observableThrowError(error || 'Server error');
    }

}
