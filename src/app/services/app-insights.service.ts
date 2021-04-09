import { Injectable } from '@angular/core';
import { AppInsights } from 'applicationinsights-js';
import {OAuthService} from 'angular-oauth2-oidc';

import { environment } from '../../environments/environment';

@Injectable()
export class AppInsightsService {

    private config: Microsoft.ApplicationInsights.IConfig = {
        instrumentationKey: environment.appInsights.instrumentationKey
    };

    constructor(private authService: OAuthService) {
        if (!AppInsights.config) {
            AppInsights.downloadAndSetup(this.config);
        }
    }

    logPageView(name?: string, url?: string, properties?: any, measurements?: any, duration?: number) {
        this.setUser();
        AppInsights.trackPageView(name, url, properties, measurements, duration);
    }

    logEvent(name: string, properties?: any, measurements?: any) {
        this.setUser();
        AppInsights.trackEvent(name, properties, measurements);
    }

    logException(exception: Error, handledAt?: string, properties?: any, measurements?: any) {
        this.setUser();
        AppInsights.trackException(exception, handledAt, properties, measurements);
    }

    logTrace(message: string, properties?: any, severityLevel?: any) {
        this.setUser();
        AppInsights.trackTrace(message, properties, severityLevel);
    }

    setUser() {
        if (!!this.authService.getIdToken()) {
            const claims: any = this.authService.getIdentityClaims();
            AppInsights.setAuthenticatedUserContext(claims.preferred_username);
        } else {
            AppInsights.clearAuthenticatedUserContext();
        }
    }

}
