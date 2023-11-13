import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {ReportsComponent} from './pages/reports/reports.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [NgxPermissionsGuard],
        component: ReportsComponent,
        data: {
            permissions: {
                only: ['reports_view']
            }
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ReportsRoutingModule {
}
