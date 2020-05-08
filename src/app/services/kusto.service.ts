import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, combineLatest, throwError as observableThrowError, Observable, of } from 'rxjs';
import { catchError, map, retryWhen, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Connection } from '../models/connection.model';

@Injectable()
export class KustoService {

    constructor(private http: HttpClient) {}

    private getConnection(name: string): Connection {
        const connection = {
            apiKey: null,
            applicationId: null,
            options: null,
            url: null
        };
        const appDetails = environment.applications.find((a) => a.name === name);
        if (appDetails !== undefined) {
            connection.apiKey = appDetails.apiKey;
            connection.applicationId = appDetails.applicationId;
            connection.url = `https://api.applicationinsights.io/v1/apps/${connection.applicationId}/query`;
            connection.options = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'X-API-Key': connection.apiKey
                })
            };
        }
        return connection;
    }

    public getApplicationsMakingRequests(name: string): Observable<number> {
        // Applications making requests (last month)
        const connection = this.getConnection(name);
        const body = {
            query: 'requests | where timestamp between (startofmonth(ago(30d)) .. endofmonth(ago(30d))) and user_Id != "testing" | distinct user_Id | summarize ApplicationsUsingEdh=count(user_Id)'
        };
        return this.http.post<number>(connection.url, body, connection.options).pipe(
            map((response: any) => {
                return response.tables[0].rows[0]; // Only one row will come back
            }),
            catchError(this.handleError)
        );
    }

    private handleError(error: Response) {
        // In the future, we may send the server to some remote logging infrastructure
        console.error(error);
        return observableThrowError(error || 'Server error');
    }

}
