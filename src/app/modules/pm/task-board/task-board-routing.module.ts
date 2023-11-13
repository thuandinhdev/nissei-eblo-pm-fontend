import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {TaskBoardComponent} from './pages/task-board/task-board.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [NgxPermissionsGuard],
        component: TaskBoardComponent,
        data: {
            permissions: {
                only: ['admin', 'super_admin', 'tasks_view']
            }
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TaskBoardRoutingModule {
}
