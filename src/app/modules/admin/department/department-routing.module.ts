import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {DepartmentComponent} from './pages/department/department.component';
import {DepartmentDetailComponent} from './pages/department-detail/department-detail.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: DepartmentComponent
            },
            {
                path: 'detail/:id/:roleId',
                canActivate: [NgxPermissionsGuard],
                data: {
                    breadcrumbs: {
                        text: 'common.detail',
                        icon: 'fa fa-lock',
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'departments_view']
                    }
                },
                component: DepartmentDetailComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DepartmentRoutingModule {
}
