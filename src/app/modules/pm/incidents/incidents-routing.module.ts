import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {IncidentListComponent} from './pages/incident-list/incident-list.component';
import {IncidentDetailComponent} from './pages/incident-detail/incident-detail.component';
import {IncidentCreateComponent} from './pages/incident-create/incident-create.component';
import {IncidentEditComponent} from './pages/incident-edit/incident-edit.component';
import {IncidentKanbanComponent} from './pages/incident-kanban/incident-kanban.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                canActivate: [NgxPermissionsGuard],
                component: IncidentListComponent,
                data: {
                    permissions: {
                        only: ['admin', 'super_admin', 'incidents_view']
                    }
                }
            },
            {
                path: 'create',
                canActivate: [NgxPermissionsGuard],
                component: IncidentCreateComponent,
                data: {
                    breadcrumbs: {
                        text: 'common.create',
                        icon: 'fa fa-ticket',
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'incidents_create']
                    }
                }
            },
            {
                path: 'edit/:id',
                canActivate: [NgxPermissionsGuard],
                component: IncidentEditComponent,
                data: {
                    breadcrumbs: {
                        text: 'common.edit',
                        icon: 'fa fa-ticket',
                        hasParams: true,
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'incidents_edit']
                    }
                }
            },
            {
                path: 'detail/:id',
                canActivate: [NgxPermissionsGuard],
                component: IncidentDetailComponent,
                data: {
                    breadcrumbs: {
                        text: 'common.detail',
                        icon: 'fa fa-ticket',
                        hasParams: true,
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'incidents_view']
                    }
                }
            },
            {
                path: 'kanban',
                canActivate: [NgxPermissionsGuard],
                component: IncidentKanbanComponent,
                data: {
                    breadcrumbs: {
                        text: 'common.kanban',
                        icon: 'fa fa-bug',
                        hasParams: true,
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'incidents_view']
                    }
                }
            },
            {
                path: ':status/:incidentFilterKey',
                component: IncidentListComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class IncidentsRoutingModule {
}
