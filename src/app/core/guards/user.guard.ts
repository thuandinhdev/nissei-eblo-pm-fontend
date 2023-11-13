import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {NgxRolesService} from 'ngx-permissions';
import {Observable} from 'rxjs';

import {AuthenticationService} from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})

export class UserGuard implements CanActivate {
    loginUser: any;

    /**
     *    @class UserGuard
     *    @constructor
     */
    constructor(
        private route: Router,
        private authenticationService: AuthenticationService,
        public ngxRolesService: NgxRolesService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    /**
     *    Returns boolean value for user have authorize access or not to access files/resources
     *
     *    @class UserGuard
     *    @method canActivate
     *    @param {next} activeurl
     *    @param {state} route state
     */
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (this.loginUser.is_client == 1) {
            return false;
        } else {
            return true;
        }
    }
}
