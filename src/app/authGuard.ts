import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable,of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {OAuthService} from 'angular-oauth2-oidc';

//authentication guard for oidc implementation
//if we do not have a valid ticket, redirect to home screen (blank with login prompt)
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: OAuthService, private router : Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
      if(!this.authService.hasValidIdToken()){
        this.router.navigate([""]);
        return false;
      }
      return true;
  }
}