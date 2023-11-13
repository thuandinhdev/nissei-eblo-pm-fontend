import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {ErrorDialogService} from '../services/error-dialog.service';
import {AuthenticationService} from '../services/authentication.service';

@Injectable()

export class HttpConfigInterceptor implements HttpInterceptor {

    /**
     *    @class HttpConfigInterceptor
     *    @constructor
     */
    constructor(
        public translate: TranslateService,
        public router: Router,
        public errorDialogService: ErrorDialogService,
        public toastrService: ToastrService,
        public authenticationService: AuthenticationService,
    ) {
    }

    /**
     *    Transform the outgoing request before passing it to the next interceptor in the chain, by calling next.handle() method
     *
     *    @class HttpConfigInterceptor
     *    @method intercept
     *    @param {request} request
     *    @param {next} httpHandler
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let loginToken = this.authenticationService.currentTokenValue;

        // --
        // Check expiration token
        if (loginToken) {
            if (loginToken.expires_in && (Date.now() > (Date.now() + loginToken.expires_in))) {
                this.toastrService.error(this.translate.instant('common.error_messages.message2'));
                this.authenticationService.logout();
            }

            request = request.clone({headers: request.headers.set('Authorization', loginToken.token_type + ' ' + loginToken.token)});
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});
        }

        request = request.clone({headers: request.headers.set('Accept', 'application/json')});

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                let errorMessages = [];

                switch (error.status) {
                    case 200:
                        break;
                    case 400:
                        if (error.error.error) {
                            this.toastrService.error(error.error.error, this.translate.instant('common.errors_keys.key2'));
                        }
                        break;
                    case 401:
                        // this.toastrService.error(this.translate.instant('common.error_messages.message3'), this.translate.instant('common.errors_keys.key3'));
                        this.authenticationService.logout(false);
                        break;
                    case 403:
                        this.toastrService.error(this.translate.instant('common.error_messages.message1'), this.translate.instant('common.errors_keys.key4'));
                        break;
                    case 404:
                        this.toastrService.error(this.translate.instant('common.error_messages.message4'), this.translate.instant('common.errors_keys.key5'));
                        break;
                    case 422:
                        if (error.error.error) {
                            this.toastrService.error(error.error.error, this.translate.instant('common.errors_keys.key6'));
                        } else {
                            for (let iRow in error.error.errors) {
                                for (let jRow in error.error.errors[iRow]) {
                                    errorMessages.push(error.error.errors[iRow][jRow]);
                                }
                            }
                            this.errorDialogService.openDialog(error, errorMessages);
                        }
                        break;
                    case 500:
                        errorMessages.push(error.error.message);
                        // this.errorDialogService.openDialog(error, errorMessages);
                        this.toastrService.error(error.error.error, this.translate.instant('common.error_messages.message5'));
                        break;
                    default:
                        // this.errorDialogService.openDialog(error, errorMessages);
                        break;
                }
                return throwError(error);
            }));
    }
}
