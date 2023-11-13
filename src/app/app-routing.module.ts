import {NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {BlankLayoutComponent} from './core/layouts/blank-layout/blank-layout.component';
import {BasicLayoutComponent} from './core/layouts/basic-layout/basic-layout.component';
import {LoginComponent} from './modules/login/login.component';
import {RegisterComponent} from './modules/register/register.component';
import {ForgotPasswordComponent} from './modules/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './modules/reset-password/reset-password.component';

import {AuthGuard} from './core/guards/auth.guard';
import {MenuResolver} from './core/services/menu-resolver';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: '', component: BlankLayoutComponent,
        children: [
            {path: 'login', component: LoginComponent},
            {path: 'register', component: RegisterComponent},
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'reset-password/:email/:token', component: ResetPasswordComponent},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: BasicLayoutComponent,
        data: {
            breadcrumbs: {text: 'Home'}
        },
        resolve: {
            sidebarMenu: MenuResolver
        },
        children: [
            {
                path: 'dashboard',
                pathMatch: 'full',
                loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
                data: {
                    title: 'breadcrumbs.dashboard.title'
                }
            },
            {
                path: 'announcements',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.announcements.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.announcements.text',
                        icon: 'fa fa-bullhorn',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'announcements_view']
                    }
                },
                loadChildren: () => import('./modules/admin/announcement/announcement.module').then(m => m.AnnouncementModule)
            },
            {
                path: 'timesheet',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.timesheet.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.timesheet.text',
                        icon: 'fa fa-clock-o',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'timesheet_view']
                    }
                },
                loadChildren: () => import('./modules/timesheet/timesheet.module').then(m => m.TimesheetModule)
            },
            {
                path: 'todos',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.todos.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.todos.text',
                        icon: 'fa fa-list-ul',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'todos_view']
                    }
                },
                loadChildren: () => import('./modules/admin/todo/todo.module').then(m => m.TodoModule)
            },
            {
                path: 'users',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.users.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.users.text',
                        icon: 'fa fa-user-circle',
                        show: false,
                        isHome: false
                    }
                },
                loadChildren: () => import('./modules/admin/user/user.module').then(m => m.UserModule)
            },
            {
                path: 'departments',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.departments.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.departments.text',
                        icon: 'fa fa-lock',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin']
                    }
                },
                loadChildren: () => import('./modules/admin/department/department.module').then(m => m.DepartmentModule)
            },
            {
                path: 'roles',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.roles.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.roles.text',
                        icon: 'fa fa-lock',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin']
                    }
                },
                loadChildren: () => import('./modules/admin/role/role.module').then(m => m.RoleModule)
            },
            {
                path: 'mailbox',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.mailbox.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.mailbox.text',
                        icon: 'fa fa-envelope-o',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'mailbox_view']
                    }
                },
                loadChildren: () => import('./modules/mailbox/mailbox.module').then(m => m.MailboxModule)
            },
            {
                path: 'file-browser',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.file_browser.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.file_browser.text',
                        icon: 'fa fa-folder',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'filemanager_view']
                    }
                },
                loadChildren: () => import('./modules/file-browser/file-browser.module').then(m => m.FileBrowserModule)
            },
            {
                path: 'teams',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.teams.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.teams.text',
                        icon: 'fa fa-universal-access',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'teams_view']
                    }
                },
                loadChildren: () => import('./modules/admin/team/team.module').then(m => m.TeamModule)
            },
            {
                path: 'holidays',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.holidays.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.holidays.text',
                        icon: 'fa fa-calendar-plus-o',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'holidays_view']
                    }
                },
                loadChildren: () => import('./modules/admin/holiday/holiday.module').then(m => m.HolidayModule)
            },
            {
                path: 'meetings',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.meetings.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.meetings.text',
                        icon: 'fa fa-briefcase',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'meetings_view']
                    }
                },
                loadChildren: () => import('./modules/admin/meeting/meeting.module').then(m => m.MeetingModule)
            },
            {
                path: 'clients',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.clients.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.clients.text',
                        icon: 'fa fa-user-circle',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'clients_view']
                    }
                },
                loadChildren: () => import('./modules/admin/client/client.module').then(m => m.ClientModule)
            },
            {
                path: 'settings',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.settings.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.settings.text',
                        icon: 'fa fa-cogs',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'settings_view']
                    }
                },
                loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule)
            },
            {
                path: 'calendar',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.calendar.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.calendar.text',
                        icon: 'fa fa-calendar',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'calendar_view']
                    }
                },
                loadChildren: () => import('./modules/calendar-pm/calendar-pm.module').then(m => m.CalendarPmModule)
            },
            {
                path: 'projects',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.projects.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.projects.text',
                        icon: 'fa fa-product-hunt',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'projects_view']
                    }
                },
                loadChildren: () => import('./modules/pm/projects/projects.module').then(m => m.ProjectsModule)
            },
            {
                path: 'tasks',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.tasks.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.tasks.text',
                        icon: 'fa fa-tasks',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'tasks_view']
                    }
                },
                loadChildren: () => import('./modules/pm/tasks/tasks.module').then(m => m.TasksModule)
            },
            {
                path: 'defects',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.defects.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.defects.text',
                        icon: 'fa fa-bug',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'defects_view']
                    }
                },
                loadChildren: () => import('./modules/pm/defects/defects.module').then(m => m.DefectsModule)
            },
            {
                path: 'incidents',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.incidents.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.incidents.text',
                        icon: 'fa fa-ticket',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'incidents_view']
                    }
                },
                loadChildren: () => import('./modules/pm/incidents/incidents.module').then(m => m.IncidentsModule)
            },
            {
                path: 'taskboard',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.taskboard.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.taskboard.text',
                        icon: 'fa fa-clipboard',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'tasks_view']
                    }
                },
                loadChildren: () => import('./modules/pm/task-board/task-board.module').then(m => m.TaskBoardModule)
            },
            {
                path: 'teamboard',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.teamboard.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.teamboard.text',
                        icon: 'fa fa-universal-access',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'teams_view']
                    }
                },
                loadChildren: () => import('./modules/pm/team-board/team-board.module').then(m => m.TeamBoardModule)
            },
            {
                path: 'projects-planner',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.projects_planner.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.projects_planner.text',
                        icon: 'fa fa-american-sign-language-interpreting',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'projectplanner_view']
                    }
                },
                loadChildren: () => import('./modules/pm/project-planner/project-planner.module').then(m => m.ProjectPlannerModule)
            },
            {
                path: 'knowledgebase',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.knowledgebase.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.knowledgebase.text',
                        icon: 'fa fa-graduation-cap',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'knowledgebase_view']
                    }
                },
                loadChildren: () => import('./modules/pm/knowledgebase/knowledgebase.module').then(m => m.KnowledgebaseModule)
            },
            {
                path: 'reports',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.reports.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.reports.text',
                        icon: 'fa fa-bar-chart',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'reports_view']
                    }
                },
                loadChildren: () => import('./modules/pm/reports/reports.module').then(m => m.ReportsModule)
            },
            {
                path: 'appointments',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.appointments.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.appointments.text',
                        icon: 'fa fa-calendar-plus-o',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'appointment_view']
                    }
                },
                loadChildren: () => import('./modules/crm/appointments/appointments.module').then(m => m.AppointmentsModule)
            },
            {
                path: 'providers',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.providers.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.providers.text',
                        icon: 'fa fa-industry',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin']
                    }
                },
                loadChildren: () => import('./modules/crm/providers/providers.module').then(m => m.ProvidersModule)
            },
            {
                path: 'leaves',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.leaves.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.leaves.text',
                        icon: 'fa fa-suitcase',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'leaves_view']
                    }
                },
                loadChildren: () => import('./modules/hrm/leaves/leaves.module').then(m => m.LeavesModule)
            },
            {
                path: 'leave-types',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.leave_types.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.leave_types.text',
                        icon: 'fa fa-trello',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'leavetypes_view']
                    }
                },
                loadChildren: () => import('./modules/hrm/leave-types/leave-types.module').then(m => m.LeaveTypesModule)
            },
            {
                path: 'taxes',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.taxes.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.taxes.text',
                        icon: 'fa fa-percent',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'taxes_view']
                    }
                },
                loadChildren: () => import('./modules/sales/taxes/taxes.module').then(m => m.TaxesModule)
            },
            {
                path: 'items',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.items.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.items.text',
                        icon: 'fa fa-shopping-basket',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'items_view']
                    }
                },
                loadChildren: () => import('./modules/sales/items/items.module').then(m => m.ItemsModule)
            },
            {
                path: 'estimates',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.estimates.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.estimates.text',
                        icon: 'fa fa-external-link',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'estimates_view']
                    }
                },
                loadChildren: () => import('./modules/sales/estimates/estimates.module').then(m => m.EstimatesModule)
            },
            {
                path: 'invoices',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.invoices.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.invoices.text',
                        icon: 'fa fa-file-pdf-o',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'invoices_view']
                    }
                },
                loadChildren: () => import('./modules/sales/invoices/invoices.module').then(m => m.InvoicesModule)
            },
            {
                path: 'payments',
                canLoad: [NgxPermissionsGuard],
                data: {
                    title: 'breadcrumbs.payments.title',
                    breadcrumbs: {
                        text: 'breadcrumbs.payments.text',
                        icon: 'fa fa-money',
                        show: false,
                        isHome: false
                    },
                    permissions: {
                        only: ['admin', 'super_admin', 'payments_view']
                    }
                },
                loadChildren: () => import('./modules/sales/payments/payments.module').then(m => m.PaymentsModule)
            },
        ]
    },

    // // Handle all other routes
    {path: '**', redirectTo: ''}
];

const config: ExtraOptions = {
    useHash: true,
    scrollPositionRestoration: 'top'
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule],
    providers: [MenuResolver]
})

export class AppRoutingModule {
}
