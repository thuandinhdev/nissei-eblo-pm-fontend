import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {AnnouncementComponent} from './pages/announcement/announcement.component';
import {AnnouncementCreateComponent} from './pages/announcement-create/announcement-create.component';
import {AnnouncementEditComponent} from './pages/announcement-edit/announcement-edit.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AnnouncementComponent
            },
            {
                path: 'create',
                canActivate: [NgxPermissionsGuard],
                data: {
                    breadcrumbs: {
                        text: 'common.create',
                        icon: 'fa fa-bullhorn',
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'announcements_create']
                    }
                },
                component: AnnouncementCreateComponent
            },
            {
                path: 'edit/:id',
                canActivate: [NgxPermissionsGuard],
                data: {
                    breadcrumbs: {
                        text: 'common.edit',
                        icon: 'fa fa-bullhorn',
                        show: true,
                        isHome: true
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'announcements_edit']
                    }
                },
                component: AnnouncementEditComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AnnouncementRoutingModule {
}
