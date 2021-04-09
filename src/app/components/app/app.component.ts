import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {OAuthService} from 'angular-oauth2-oidc';
import {config} from './../../authConfig';
import { AppInsightsService } from '../../services/app-insights.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    constructor(private authService: OAuthService, private appInsightsService: AppInsightsService, public router: Router) {}

    ngOnInit(): void {
        this.authService.configure(config);
        this.authService.timeoutFactor=0.3;
        this.authService.setupAutomaticSilentRefresh();
        this.authService.loadDiscoveryDocumentAndLogin();
        console.log(this.authService.getIdentityClaims());
        this.appInsightsService.logPageView('app.component', '/');
    }

}
