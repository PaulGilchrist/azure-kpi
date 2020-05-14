import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { AppMetricsTableComponent } from './components/app-metrics-table/app-metrics-table.component';
import { D3GraphComponent } from './components/d3-graph/d3-graph.component';
import { ModalGraphComponent } from './components/modal-graph/modal-graph.component';

import { KustoService } from './services/kusto.service';

@NgModule({
  declarations: [
    AppComponent,
    AppMetricsTableComponent,
    D3GraphComponent,
    ModalGraphComponent
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
