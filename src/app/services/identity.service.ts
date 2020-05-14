import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AdalService } from 'adal-angular4';

@Injectable()
export class IdentityService {
    // Adds some minor functionality to the AdalService
    constructor(private adalService: AdalService, public router: Router) {}

    public getRoles(): string {
        if (this.adalService.userInfo.authenticated) {
            return this.adalService.userInfo.profile.roles;
        } else {
            return '';
        }
    }

    public isInAllRoles(...neededRoles: Array<string>): boolean {
        if (this.adalService.userInfo.authenticated) {
            const roles = this.adalService.userInfo.profile.roles.toLowerCase();
            return neededRoles.every(neededRole => roles.includes(neededRole.toLowerCase()));
        } else {
            return false;
        }
    }

    public isInRole(neededRole: string): boolean {
        if (this.adalService.userInfo.authenticated) {
            const roles = this.adalService.userInfo.profile.roles.toLowerCase();
            return roles.includes(neededRole.toLowerCase());
        } else {
            return false;
        }
    }

}
