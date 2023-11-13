import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxPermissionsModule} from 'ngx-permissions';
import {BsDatepickerModule, BsDropdownModule, DatepickerModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {ExportAsModule} from 'ngx-export-as';
import {DataTablesModule} from 'angular-datatables';
import {UiSwitchModule} from 'ngx-ui-switch';

import {PaymentsRoutingModule} from './payments-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {PaymentListComponent} from './pages/payment-list/payment-list.component';
import {PaymentMethodListComponent} from './pages/payment-method-list/payment-method-list.component';
import {CreatePaymentMethodComponent} from './components/create-payment-method/create-payment-method.component';
import {EditPaymentMethodComponent} from './components/edit-payment-method/edit-payment-method.component';
import {CreatePaymentComponent} from './components/create-payment/create-payment.component';
import {EditPaymentComponent} from './components/edit-payment/edit-payment.component';
import {PaymentDetailComponent} from './pages/payment-detail/payment-detail.component';

@NgModule({
    declarations: [
        PaymentListComponent,
        PaymentMethodListComponent,
        CreatePaymentMethodComponent,
        EditPaymentMethodComponent,
        CreatePaymentComponent,
        EditPaymentComponent,
        PaymentDetailComponent
    ],
    imports: [
        CommonModule,
        PaymentsRoutingModule,
        NgxPermissionsModule,
        DataTablesModule,
        ExportAsModule,
        BsDropdownModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        DatepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        UiSwitchModule.forRoot({
            checkedLabel: 'Active',
            uncheckedLabel: 'Inactive',
            color: 'rgb(0, 189, 99)',
            switchColor: '#FFFFFF',
            defaultBgColor: '#c6c6c6',
            defaultBoColor: '#c39ef8'
        }),
        SharedModule
    ],
    entryComponents: [
        CreatePaymentMethodComponent,
        EditPaymentMethodComponent,
        CreatePaymentComponent,
        EditPaymentComponent
    ]
})

export class PaymentsModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
