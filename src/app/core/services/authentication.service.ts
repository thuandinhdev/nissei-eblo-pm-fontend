import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {NgxPermissionsService, NgxRolesService} from 'ngx-permissions';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {User} from '../../shared/models/user.model';
import {Token} from '../../shared/models/token.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    public loginUser: Observable<User>;
    public loginToken: Observable<Token>;
    loginCurrentUser: any;
    userAccessToken: any;
    private currentUserSubject: BehaviorSubject<User>;
    private currentTokenSubject: BehaviorSubject<Token>;
    private apiUrl = environment.apiUrl;

    constructor(
        public router: Router,
        private http: HttpClient,
        public toastrService: ToastrService,
        public ngxRolesService: NgxRolesService,
        public ngxPermissionsService: NgxPermissionsService
    ) {
        if (localStorage.getItem('loginUser')) {
            this.loginCurrentUser = JSON.parse(localStorage.getItem('loginUser'));
            this.userAccessToken = JSON.parse(localStorage.getItem('access_token'));
        }
        this.currentUserSubject = new BehaviorSubject<User>(this.loginCurrentUser);
        this.currentTokenSubject = new BehaviorSubject<Token>(this.userAccessToken);
        this.loginUser = this.currentUserSubject.asObservable();
        this.loginToken = this.currentTokenSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get currentTokenValue(): Token {
        return this.currentTokenSubject.value;
    }

    setLoginUser(user) {
        localStorage.setItem('loginUser', JSON.stringify(user));
        this.setUserPermissions(user);
        this.currentUserSubject.next(user);
    }

    setUserPermissions(user) {
        this.ngxRolesService.flushRoles();
        this.ngxPermissionsService.flushPermissions();

        localStorage.setItem('permissions', JSON.stringify(user));

        for (let iRow in user.permissions) {
            this.ngxPermissionsService.addPermission(user.permissions[iRow]);
        }
        this.ngxRolesService.addRoles(user.permissions);
    }

    getToken() {
        return localStorage.getItem('access_token');
    }

    isLoggedIn() {
        return this.getToken() !== null;
    }

    register(user: User) {
        return this.http.post(`${this.apiUrl}/api/register`, user);
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${this.apiUrl}/api/login`, {email, password})
            .pipe(map(user => {
                if (user) {
                    localStorage.setItem('access_token', JSON.stringify(user));
                    this.currentTokenSubject.next(user);
                }
                return user;
            }));
    }

    forgotPassword(email) {
        return this.http.post(`${this.apiUrl}/api/forgot-password`, email);
    }

    getVerifyUser(data) {
        return this.http.post(`${this.apiUrl}/api/verify/user`, data);
    }

    getVerifyUserToken(data) {
        return this.http.post(`${this.apiUrl}/api/verify/token`, data);
    }

    resetPassword(data) {
        return this.http.post(`${this.apiUrl}/api/reset-password`, data);
    }

    logout(isheader = true) {
        this.http.get(`${this.apiUrl}/api/logout`)
            .subscribe(
                data => {
                    localStorage.removeItem('loginUser');
                    localStorage.removeItem('access_token');
                    if (isheader) {
                        this.toastrService.success('You have successfully logged out.');
                    }

                    if (localStorage.getItem('permissions') != 'undefined' && localStorage.getItem('permissions') != null) {
                        localStorage.removeItem('permissions');
                    }

                    this.router.navigate(['/login']);
                });
    }
}
