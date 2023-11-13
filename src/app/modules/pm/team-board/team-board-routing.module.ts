import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {TeamBoardComponent} from './pages/team-board/team-board.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [NgxPermissionsGuard],
        component: TeamBoardComponent,
        data: {
            permissions: {
                only: ['teams_view']
            }
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TeamBoardRoutingModule {
}
