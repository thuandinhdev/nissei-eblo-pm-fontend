import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {LeavesListComponent} from './pages/leaves-list/leaves-list.component';
import {CalendarViewComponent} from './pages/calendar-view/calendar-view.component';
import {ListViewComponent} from './pages/list-view/list-view.component';
import {LeavesReportComponent} from './pages/leaves-report/leaves-report.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                canActivate: [NgxPermissionsGuard],
                component: LeavesListComponent
            },
            {
                path: 'calendar',
                canActivate: [NgxPermissionsGuard],
                component: CalendarViewComponent,
                data: {
                    breadcrumbs: {
                        text: 'breadcrumbs.calendar.title',
                        icon: 'fa fa-calendar',
                        show: true,
                        isHome: true
                    }
                }
            },
            {
                path: 'request',
                canActivate: [NgxPermissionsGuard],
                component: ListViewComponent,
                data: {
                    breadcrumbs: {
                        text: 'common.request',
                        icon: 'fa fa-trello',
                        show: true,
                        isHome: true
                    }
                }
            },
            {
                path: 'report',
                canActivate: [NgxPermissionsGuard],
                component: LeavesReportComponent,
                data: {
                    breadcrumbs: {
                        text: 'common.report',
                        icon: 'fa fa-area-chart',
                        show: true,
                        isHome: true
                    }
                }
            },
        ]
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class LeavesRoutingModule {
}
