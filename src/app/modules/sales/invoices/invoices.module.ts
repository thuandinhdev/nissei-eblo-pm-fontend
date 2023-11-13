import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {BsDatepickerModule, BsDropdownModule, DatepickerModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {ExportAsModule} from 'ngx-export-as';
import {NgxEditorModule} from 'ngx-editor';
import {NgxPayPalModule} from 'ngx-paypal';
import {NgxPermissionsModule} from 'ngx-permissions';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTablesModule} from 'angular-datatables';

import {InvoicesRoutingModule} from './invoices-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {PaymentsModule} from '../payments/payments.module';


import {InvoiceListComponent} from './pages/invoice-list/invoice-list.component';
import {InvoiceCreateComponent} from './pages/invoice-create/invoice-create.component';
import {InvoiceEditComponent} from './pages/invoice-edit/invoice-edit.component';
import {PaypalPaymentComponent} from './components/paypal-payment/paypal-payment.component';
import {StripePaymentComponent} from './components/stripe-payment/stripe-payment.component';
import {InvoiceViewComponent} from './pages/invoice-view/invoice-view.component';
import {CreatePaymentComponent} from '../payments/components/create-payment/create-payment.component';
import {EditPaymentComponent} from '../payments/components/edit-payment/edit-payment.component';

@NgModule({
    declarations: [
        InvoiceListComponent,
        PaypalPaymentComponent,
        StripePaymentComponent,
        InvoiceCreateComponent,
        InvoiceEditComponent,
        InvoiceViewComponent
    ],
    imports: [
        CommonModule,
        InvoicesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPermissionsModule,
        DataTablesModule,
        ExportAsModule,
        NgxEditorModule,
        NgSelectModule,
        NgxPayPalModule,
        ModalModule.forRoot(),
        DatepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        PaymentsModule,
        SharedModule
    ],
    entryComponents: [
        CreatePaymentComponent,
        EditPaymentComponent
    ],
    providers: []
})
export class InvoicesModule {
}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
