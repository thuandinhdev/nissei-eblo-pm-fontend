import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {ItemsListComponent} from './pages/items-list/items-list.component';

const routes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            canActivate: [NgxPermissionsGuard],
            component: ItemsListComponent
        }
    ]
}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ItemsRoutingModule {
}
