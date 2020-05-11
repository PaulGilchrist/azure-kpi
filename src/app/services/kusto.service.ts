import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, combineLatest, throwError as observableThrowError, Observable, of } from 'rxjs';
import { catchError, map, retryWhen, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Application } from '../models/application.model';
import { Connection } from '../models/connection.model';

@Injectable()
export class KustoService {

    constructor(private http: HttpClient) { }

    private getConnection(name: string): Connection {
        const connection = {
            apiKey: null,
            applicationId: null,
            options: null,
            roleName: null,
            url: null
        };
        const appDetails = environment.applications.find((a) => a.name === name);
        if (appDetails !== undefined) {
            connection.apiKey = appDetails.apiKey;
            connection.applicationId = appDetails.applicationId;
            connection.options = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'X-API-Key': connection.apiKey
                })
            };
            connection.roleName = appDetails.roleName;
            connection.url = `https://api.applicationinsights.io/v1/apps/${connection.applicationId}/query`;
        }
        return connection;
    }

    public getKustoResult(application: Application, fromDate: Date, toDate: Date, query: string): Observable<number> {
        // Query Azure App Insights
        const connection = this.getConnection(application.name);
        query = query
            // January is 0 not 1
            .replace('<FromDateGoesHere>', `${fromDate.getMonth() + 1}/${fromDate.getDate()}/${fromDate.getFullYear()}`)
            .replace('<ToDateGoesHere>', `${toDate.getMonth() + 1}/${fromDate.getDate()}/${toDate.getFullYear()}`)
            .replace('<RoleNameGoesHere>', connection.roleName);
        return this.http.post<number>(connection.url, { query }, connection.options).pipe(
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
