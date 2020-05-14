import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdalGuard } from 'adal-angular4';

import { HomeComponent } from './components/home/home.component';
import { TokenComponent } from './components/token/token.component';

const routes: Routes = [
    // Static Loading
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    // Lazy Loading
    { path: 'home', component: HomeComponent, canActivate: [AdalGuard] },
    { path: 'token', component: TokenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
