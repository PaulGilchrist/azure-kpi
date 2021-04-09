import { Component, OnInit } from '@angular/core';

import { AppInsightsService } from './../../services/app-insights.service';
import {OAuthService} from 'angular-oauth2-oidc';

@Component({
    selector: 'app-token',
    styleUrls: ['./token.component.scss'],
    templateUrl: './token.component.html'
})
export class TokenComponent implements OnInit {

    token: any = this.authService.getIdentityClaims();
    rawIdToken = this.authService.getIdToken();

    constructor(
        private appInsightsService: AppInsightsService,
        private authService: OAuthService
    ) { }

    ngOnInit(): void {
        this.appInsightsService.logPageView('token.component', '/token');
        // // Initialize tooltips just for this component
        // $(function() {
        // 	// No typings for bootstrap's tooltip
        // 	$('my-token [data-toggle="tooltip"]')).tooltip({ container: 'body' });
        // });
    }

    getDateString(num: any): string {
        let returnString = '';
        if (num) {
            returnString = num + ' (' + new Date(num * 1000) + ')';
        }
        return returnString;
    }

    logout(): void {
        this.authService.logOut();
    }
}
 