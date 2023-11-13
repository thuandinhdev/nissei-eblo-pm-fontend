import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {AppointmentsComponent} from './pages/appointments/appointments.component';
import {AppointmentsListComponent} from './pages/appointments-list/appointments-list.component';
import {AppointmentsDetailComponent} from './pages/appointments-detail/appointments-detail.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AppointmentsListComponent
            },
            {
                path: 'calendar',
                canActivate: [NgxPermissionsGuard],
                component: AppointmentsComponent,
                data: {
                    breadcrumbs: {
                        text: 'common.calendar',
                        icon: 'fa fa-calendar-plus-o',
                        hasParams: true,
                        show: true,
                        isHome: true
                    }
                }
            },
            {
                path: 'detail/:id',
                canActivate: [NgxPermissionsGuard],
                component: AppointmentsDetailComponent,
                data: {
                    breadcrumbs: {
                        text: 'common.detail',
                        icon: 'fa fa-calendar-plus-o',
                        hasParams: true,
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'appointment_view']
                    }
                }
            },
            {
                path: ':statusId',
                component: AppointmentsListComponent
            }
        ]
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AppointmentsRoutingModule {
}
