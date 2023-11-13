import {NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {registerLocaleData} from '@angular/common';
import localeCs from '@angular/common/locales/cs';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';
import localeIt from '@angular/common/locales/it';
import localeJa from '@angular/common/locales/ja';
import localeNl from '@angular/common/locales/nl';
import localePt from '@angular/common/locales/pt';
import localeRu from '@angular/common/locales/ru';
import localeTr from '@angular/common/locales/tr';
import localeVi from '@angular/common/locales/vi';
import localeZh from '@angular/common/locales/zh';
import localeDa from '@angular/common/locales/da';
import localeEl from '@angular/common/locales/el';
import localeId from '@angular/common/locales/id';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {ModalModule} from 'ngx-bootstrap';
import {NgxPermissionsModule} from 'ngx-permissions';
import {NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule, NgxUiLoaderRouterModule} from 'ngx-ui-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {LayoutsModule} from './core/layouts/layouts.module';

import {LoginComponent} from './modules/login/login.component';
import {RegisterComponent} from './modules/register/register.component';
import {ForgotPasswordComponent} from './modules/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './modules/reset-password/reset-password.component';
import {ErrorDialogComponent} from './shared/components/error-dialog/error-dialog.component';

import {HttpConfigInterceptor} from './core/interceptor/http-config.interceptor';

import {stop_loading_url} from './core/helpers/pm-helper';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    'bgsColor': '#499ed0',
    'bgsOpacity': 0.5,
    'bgsPosition': 'center-center',
    'bgsSize': 60,
    'bgsType': 'three-strings',
    'blur': 5,
    'fgsColor': '#499ed0',
    'fgsPosition': 'center-center',
    'fgsSize': 60,
    'fgsType': 'three-strings',
    'gap': 24,
    'logoPosition': 'center-center',
    'logoSize': 120,
    'logoUrl': '',
    'masterLoaderId': 'master',
    'overlayBorderRadius': '0',
    'overlayColor': 'rgba(40, 40, 40, 0.8)',
    'pbColor': '#499ed0',
    'pbDirection': 'ltr',
    'pbThickness': 3,
    'hasProgressBar': true,
    'text': '',
    'textColor': '#fff',
    'textPosition': 'center-center'
};

registerLocaleData(localeCs);
registerLocaleData(localeDe);
registerLocaleData(localeEn);
registerLocaleData(localeEs);
registerLocaleData(localeFr);
registerLocaleData(localeIt);
registerLocaleData(localeJa);
registerLocaleData(localeNl);
registerLocaleData(localePt);
registerLocaleData(localeRu);
registerLocaleData(localeTr);
registerLocaleData(localeVi);
registerLocaleData(localeZh);

registerLocaleData(localeDa);
registerLocaleData(localeEl);
registerLocaleData(localeId);

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        ErrorDialogComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        LayoutsModule,
        ModalModule.forRoot(),
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        NgxUiLoaderRouterModule,
        NgxUiLoaderHttpModule.forRoot({exclude: stop_loading_url, showForeground: true}),
        NgxPermissionsModule.forRoot(),
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-center',
            preventDuplicates: true,
            progressBar: true
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        Title,
        {provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true}
    ],
    entryComponents: [ErrorDialogComponent],
    bootstrap: [AppComponent]
})

export class AppModule {
}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
