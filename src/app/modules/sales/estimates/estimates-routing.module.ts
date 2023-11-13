import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {EstimateListsComponent} from './pages/estimate-lists/estimate-lists.component';
import {EstimateCreateComponent} from './pages/estimate-create/estimate-create.component';
import {EstimateEditComponent} from './pages/estimate-edit/estimate-edit.component';
import {EstimateViewComponent} from './pages/estimate-view/estimate-view.component';

const routes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            canActivate: [NgxPermissionsGuard],
            component: EstimateListsComponent
        },
        {
            path: 'create',
            canActivate: [NgxPermissionsGuard],
            data: {
                breadcrumbs: {
                    text: 'common.create',
                    icon: 'fa fa-external-link',
                    show: true,
                    isHome: true
                },
                permissions: {
                    only: ['admin', 'super_admin', 'estimates_create']
                }
            },
            component: EstimateCreateComponent
        },
        {
            path: 'edit/:id',
            canActivate: [NgxPermissionsGuard],
            data: {
                breadcrumbs: {
                    text: 'common.edit',
                    icon: 'fa fa-external-link',
                    show: true,
                    isHome: true
                },
                permissions: {
                    only: ['admin', 'super_admin', 'estimates_edit']
                }
            },
            component: EstimateEditComponent
        },
        {
            path: 'detail/:id',
            canActivate: [NgxPermissionsGuard],
            data: {
                breadcrumbs: {
                    text: 'common.detail',
                    icon: 'fa fa-external-link'
                },
                permissions: {
                    only: ['admin', 'super_admin', 'estimates_view']
                }
            },
            component: EstimateViewComponent
        }
    ]
}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class EstimatesRoutingModule {
}
