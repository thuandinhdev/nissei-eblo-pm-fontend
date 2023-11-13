import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {ProjectPlannerListComponent} from './pages/project-planner-list/project-planner-list.component';
import {ProjectPlannerDetailComponent} from './pages/project-planner-detail/project-planner-detail.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectPlannerListComponent
    },
    {
        path: 'detail/:id',
        canActivate: [NgxPermissionsGuard],
        component: ProjectPlannerDetailComponent,
        data: {
            breadcrumbs: {
                text: 'common.detail',
                icon: 'fa fa-product-hunt',
                hasParams: true,
                show: true,
                isHome: true
            },
            permissions: {
                only: ['admin', 'super_admin', 'projects_view']
            }
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProjectPlannerRoutingModule {
}
