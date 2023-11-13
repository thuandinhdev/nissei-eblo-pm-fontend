import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

import {AuthenticationService} from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    /**
     *    @class AuthGuard
     *    @constructor
     */
    constructor(
        private authenticationService: AuthenticationService,
        private route: Router
    ) {
    }

    /**
     *    Returns boolean value for user login or not
     *
     *    @class AuthGuard
     *    @method canActivate
     *    @param {next} next
     *    @param {state} route state
     */
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authenticationService.isLoggedIn()) {
            return true;
        } else {
            this.route.navigate(['login']);
            return false;
        }
    }
}
