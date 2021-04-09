import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppInsightsService } from './services/app-insights.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthGuard } from './authGuard';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { AppMetricsTableComponent } from './components/app-metrics-table/app-metrics-table.component';
import { D3GraphComponent } from './components/d3-graph/d3-graph.component';
import { HomeComponent } from './components/home/home.component';
import { ModalGraphComponent } from './components/modal-graph/modal-graph.component';
import { TokenComponent } from './components/token/token.component';
// Services
import { AzureService } from './services/azure.service';
// Other
import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent,
        AppMetricsTableComponent,
        D3GraphComponent,
        HomeComponent,
        ModalGraphComponent,
        TokenComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        HttpClientModule,
        OAuthModule.forRoot({
            resourceServer: {
                allowedUrls: [environment.apiUrl],
                sendAccessToken: true
            }
        })
    ],
    providers: [
        AuthGuard,
        AppInsightsService,
        AzureService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
