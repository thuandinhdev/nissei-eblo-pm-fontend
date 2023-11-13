import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {DefectListComponent} from './pages/defect-list/defect-list.component';
import {DefectCreateComponent} from './pages/defect-create/defect-create.component';
import {DefectEditComponent} from './pages/defect-edit/defect-edit.component';
import {DefectDetailComponent} from './pages/defect-detail/defect-detail.component';
import {DefectKanbanComponent} from './pages/defect-kanban/defect-kanban.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                canActivate: [NgxPermissionsGuard],
                component: DefectListComponent,
                data: {
                    permissions: {
                        only: ['admin', 'super_admin', 'defects_view']
                    }
                }
            },
            {
                path: 'create',
                canActivate: [NgxPermissionsGuard],
                component: DefectCreateComponent,
                data: {
                    breadcrumbs: {
                        text: 'common.create',
                        icon: 'fa fa-bug',
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'defects_create']
                    }
                }
            },
            {
                path: 'edit/:id',
                canActivate: [NgxPermissionsGuard],
                component: DefectEditComponent,
                data: {
                    breadcrumbs: {
                        text: 'common.edit',
                        icon: 'fa fa-bug',
                        hasParams: true,
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'defects_edit']
                    }
                }
            },
            {
                path: 'detail/:id',
                canActivate: [NgxPermissionsGuard],
                component: DefectDetailComponent,
                data: {
                    breadcrumbs: {
                        text: 'common.detail',
                        icon: 'fa fa-bug',
                        hasParams: true,
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'defects_view']
                    }
                }
            },
            {
                path: 'kanban',
                canActivate: [NgxPermissionsGuard],
                component: DefectKanbanComponent,
                data: {
                    breadcrumbs: {
                        text: 'common.kanban',
                        icon: 'fa fa-bug',
                        hasParams: true,
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'defects_view']
                    }
                }
            },
            {
                path: ':status/:defectFilterKey',
                component: DefectListComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DefectsRoutingModule {
}
