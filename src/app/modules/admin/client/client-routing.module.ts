import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {ClientComponent} from './pages/client/client.component';
import {ClientCreateComponent} from './pages/client-create/client-create.component';
import {ClientEditComponent} from './pages/client-edit/client-edit.component';
import {ClientDetailComponent} from './pages/client-detail/client-detail.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ClientComponent,
            },
            {
                path: 'create',
                canActivate: [NgxPermissionsGuard],
                data: {
                    breadcrumbs: {
                        text: 'common.create',
                        icon: 'fa fa-user-circle',
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'clients_create']
                    }
                },
                component: ClientCreateComponent
            },
            {
                path: 'edit/:id',
                canActivate: [NgxPermissionsGuard],
                data: {
                    breadcrumbs: {
                        text: 'common.edit',
                        icon: 'fa fa-user-circle',
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'clients_edit']
                    }
                },
                component: ClientEditComponent
            },
            {
                path: 'profile/:id',
                canActivate: [NgxPermissionsGuard],
                data: {
                    breadcrumbs: {
                        text: 'common.detail',
                        icon: 'fa fa-user-circle',
                        show: true,
                        isHome: true
                    }
                },
                component: ClientDetailComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ClientRoutingModule {
}
