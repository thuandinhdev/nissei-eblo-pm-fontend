import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {PaymentListComponent} from './pages/payment-list/payment-list.component';
import {PaymentMethodListComponent} from './pages/payment-method-list/payment-method-list.component';
import {PaymentDetailComponent} from './pages/payment-detail/payment-detail.component';

const routes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            canActivate: [NgxPermissionsGuard],
            component: PaymentListComponent
        },
        {
            path: 'method',
            canActivate: [NgxPermissionsGuard],
            component: PaymentMethodListComponent,
            data: {
                breadcrumbs: {
                    text: 'common.methods',
                    icon: 'fa fa-money',
                    show: true,
                    isHome: true
                },
                permissions: {
                    only: ['admin', 'super_admin']
                }
            }
        },
        {
            path: 'detail/:id',
            canActivate: [NgxPermissionsGuard],
            data: {
                breadcrumbs: {
                    text: 'common.detail',
                    icon: 'fa fa-money'
                },
                permissions: {
                    only: ['admin', 'super_admin', 'payments_view']
                }
            },
            component: PaymentDetailComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PaymentsRoutingModule {
}
