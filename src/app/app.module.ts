import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppMetricsTableComponent } from './app-metrics-table.component';

import { KustoService } from './services/kusto.service';

@NgModule({
  declarations: [
    AppComponent,
    AppMetricsTableComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [KustoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
