import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {TodoComponent} from './pages/todo/todo.component';
import {TodoDetailComponent} from './pages/todo-detail/todo-detail.component';

const routes: Routes = [
    {
        path: '',
        component: TodoComponent
    },
    {
        path: 'detail',
        canActivate: [NgxPermissionsGuard],
        component: TodoDetailComponent,
        data: {
            breadcrumbs: {
                text: 'common.detail',
                icon: 'fa fa-product-hunt',
                show: true,
                isHome: true
            }
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TodoRoutingModule {
}
