import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdalService } from 'adal-angular4';
import { AppInsightsService } from '../../services/app-insights.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    constructor(private adalService: AdalService, private appInsightsService: AppInsightsService, public router: Router) {
        // init requires object with clientId and tenant properties
        adalService.init(environment.azureAuthProvider);
    }

    ngOnInit(): void {
        this.adalService.handleWindowCallback();
        if (!this.adalService.userInfo.authenticated) {
            this.adalService.login();
        }
        this.appInsightsService.logPageView('app.component', '/');
    }

}
