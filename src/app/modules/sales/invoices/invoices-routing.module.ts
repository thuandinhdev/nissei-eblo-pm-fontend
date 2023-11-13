import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {InvoiceListComponent} from './pages/invoice-list/invoice-list.component';
import {InvoiceCreateComponent} from './pages/invoice-create/invoice-create.component';
import {InvoiceEditComponent} from './pages/invoice-edit/invoice-edit.component';
import {InvoiceViewComponent} from './pages/invoice-view/invoice-view.component';

const routes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            canActivate: [NgxPermissionsGuard],
            component: InvoiceListComponent
        },
        {
            path: 'create',
            canActivate: [NgxPermissionsGuard],
            data: {
                breadcrumbs: {
                    text: 'common.create',
                    icon: 'fa fa-file-pdf-o',
                    show: true,
                    isHome: true
                },
                permissions: {
                    only: ['admin', 'super_admin', 'invoices_create']
                }
            },
            component: InvoiceCreateComponent
        },
        {
            path: 'edit/:id',
            canActivate: [NgxPermissionsGuard],
            data: {
                breadcrumbs: {
                    text: 'common.edit',
                    icon: 'fa fa-file-pdf-o',
                    show: true,
                    isHome: true
                },
                permissions: {
                    only: ['admin', 'super_admin', 'invoices_edit']
                }
            },
            component: InvoiceEditComponent
        },
        {
            path: 'detail/:id',
            canActivate: [NgxPermissionsGuard],
            data: {
                breadcrumbs: {
                    text: 'common.detail',
                    icon: 'fa fa-file-pdf-o'
                },
                permissions: {
                    only: ['admin', 'super_admin', 'invoices_view']
                }
            },
            component: InvoiceViewComponent
        }
    ]
}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InvoicesRoutingModule {
}
