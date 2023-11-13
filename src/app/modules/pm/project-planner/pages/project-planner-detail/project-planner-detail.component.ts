import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxRolesService} from 'ngx-permissions';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {UserService} from '../../../../../core/services/user.service';
import {ClientService} from '../../../../../core/services/client.service';
import {ProjectService} from '../../../../../core/services/project.service';
import {ProjectPlannerSprintService} from './../../../.././../core/services/project-planner-sprint.service';

import {project_status_key_value} from './../../../../../core/helpers/pm-helper';

import {EditProjectModalComponent} from './../../components/edit-project-modal/edit-project-modal.component';
import {CreateSprintModalComponent} from './../../components/create-sprint-modal/create-sprint-modal.component';
import {EditSprintModalComponent} from './../../components/edit-sprint-modal/edit-sprint-modal.component';
import {CreateSprintTaskModalComponent} from './../../components/create-sprint-task-modal/create-sprint-task-modal.component';
import {EditSprintTaskModalComponent} from './../../components/edit-sprint-task-modal/edit-sprint-task-modal.component';
import {CreateTaskModalComponent} from './../../components/create-task-modal/create-task-modal.component';
import {EditTaskModalComponent} from './../../components/edit-task-modal/edit-task-modal.component';
import {MoveTaskModalComponent} from './../../components/move-task-modal/move-task-modal.component';

import {AuthenticationService} from '../../../../../core/services/authentication.service';
import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-project-planner-detail',
    templateUrl: './project-planner-detail.component.html',
    styleUrls: ['./project-planner-detail.component.scss']
})

export class ProjectPlannerDetailComponent implements AfterViewInit, OnDestroy, OnInit {
    public apiUrl = environment.apiUrl;
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: false})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    loginUser: any;
    projectId: any;
    project: any;
    sprints: any;
    permissions: any = [];
    hideElementsChild = [];
    clients = [];
    userLists = [];
    projectstatusKeyValue = project_status_key_value;
    dtOptions: any = {};
    isPageLoaded = false;
    datepickerConfigs = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    constructor(
        public ngxRolesService: NgxRolesService,
        public translate: TranslateService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService,
        private userService: UserService,
        private clientService: ClientService,
        private projectService: ProjectService,
        private projectPlannerSprintService: ProjectPlannerSprintService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
        this.route.paramMap.subscribe(params => {
            this.projectId = params.get('id');
        });
    }

    ngOnInit() {
        if (!this.loginUser.is_client) {
            this.getClient();
        }
        this.getUserkeyBy();
        this.getCheckPermission();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    // rerender(): void {
    // 	setTimeout(() => {
    // 		this.dtTrigger.next();
    // 	});
    // }

    // rerender(): void {
    // 	this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // 		dtInstance.destroy();
    // 		this.dtTrigger.next();
    // 	});
    // }

    getClient() {
        let that = this;
        that.clientService.getClientsWithTrashed().subscribe(data => {
            for (let iRow in data) {
                that.clients.push({
                    label: data[iRow].firstname + ' ' + data[iRow].lastname,
                    value: data[iRow].id
                });
            }
        });
    }

    getUserkeyBy() {
        this.userService.getUserkeyBy().subscribe(data => {
            this.userLists = data;
        });
    }

    getCheckPermission() {
        let role = this.ngxRolesService.getRole('admin');
        this.permissions['project_permission'] = false;

        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
            this.permissions['project_permission'] = true;
            this.permissions['edit_delete_permission'] = {
                view: true,
                edit: true,
                delete: true
            };
        } else {
            this.projectService.getProjectPermission(this.projectId).subscribe(res => {
                this.permissions['edit_delete_permission'] = res;
                if (!this.permissions.edit_delete_permission.view) {
                    this.router.navigate(['projects-planner']);
                }
            }, error => {
                this.router.navigate(['projects-planner']);
            });
        }
        this.getProjectById(true);
    }

    getProjectById(isLoad = false) {
        this.projectService.getProjectById(this.projectId).subscribe(data => {
            this.project = data;
            this.getSprintByProject(isLoad);
        });
    }

    getSprintByProject(isLoad = false) {
        this.projectPlannerSprintService.getSprintByProject(this.projectId).subscribe(data => {
            this.sprints = data;
            if (isLoad) {
                this.loadDatatable();
            }

            this.isPageLoaded = true;
        });
    }

    loadDatatable() {
        let that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            paging: true,
            pageLength: that.loginUser.settings.tables_pagination_limit,
            responsive: false,
            autoWidth: false,
            order: [0],
            language: {
                'sEmptyTable': this.translate.instant('common.datatable.sEmptyTable'),
                'sInfo': this.translate.instant('common.datatable.sInfo'),
                'sInfoEmpty': this.translate.instant('common.datatable.sInfoEmpty'),
                'sSearch': '',
                'sInfoPostFix': this.translate.instant('common.datatable.sInfoPostFix'),
                'sInfoThousands': this.translate.instant('common.datatable.sInfoThousands'),
                'sLengthMenu': this.translate.instant('common.datatable.sLengthMenu'),
                'sLoadingRecords': this.translate.instant('common.datatable.sLoadingRecords'),
                'sProcessing': this.translate.instant('common.datatable.sProcessing'),
                'sZeroRecords': this.translate.instant('common.datatable.sZeroRecords'),
                'sSearchPlaceholder': this.translate.instant('common.datatable.sSearchPlaceholder'),
                'oPaginate': {
                    'sFirst': this.translate.instant('common.datatable.oPaginate.sFirst'),
                    'sLast': this.translate.instant('common.datatable.oPaginate.sLast'),
                    'sNext': this.translate.instant('common.datatable.oPaginate.sNext'),
                    'sPrevious': this.translate.instant('common.datatable.oPaginate.sPrevious')
                },
                'oAria': {
                    'sSortAscending': this.translate.instant('common.datatable.oAria.sSortAscending'),
                    'sSortDescending': this.translate.instant('common.datatable.oAria.sSortDescending')
                }
            },
            columnDefs: [
                {width: '30%', targets: [0]},
                {width: '20%', targets: [1]},
                {width: '10%', targets: [2]},
                {width: '10%', targets: [3]},
                {width: '10%', targets: [4]},
                {width: '10%', targets: [5]},
                {width: '10%', targets: [6], sortable: false}
            ]
        };

        setTimeout(() => {
            this.dtTrigger.next();
        });
    }

    getTranslateStatus(statusKey) {
        return this.projectstatusKeyValue[statusKey];
    }

    changeProjectStatus(projectIDs: any, status: any) {
        let changeProject = {
            ids: projectIDs,
            status: status.id
        };
        this.projectService.changeStatus(changeProject).subscribe(data => {
            this.getProjectById();
            this.toastr.success(this.translate.instant('projects.messages.status'), this.translate.instant('projects.title'));
        });
    }

    saveProjectDetail(name, value) {
        this.project[name] = value;
        if (name == 'start_date' && this.project.end_date < this.project.start_date) {
            this.project.end_date = new Date(value);
        }
        this.projectService.update(this.project).subscribe(data => {
            this.toastr.success(this.translate.instant('projects.messages.update'), this.translate.instant('projects.title'));
            this.getProjectById();
        });
    }

    changeSprintId(index) {
        this.hideElementsChild[index] = !this.hideElementsChild[index];
    }

    openEditProjectModal(projectID) {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-lg animated fadeIn',
            initialState: {
                projectId: projectID,
            }
        };
        this.modalRef = this.modalService.show(EditProjectModalComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getProjectById();
        });
    }

    openCreateSprintModal() {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-lg animated fadeIn',
            initialState: {
                project: this.project,
            }
        };
        this.modalRef = this.modalService.show(CreateSprintModalComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getSprintByProject();
        });
    }

    openEditSprintModal(project, sprintID: number) {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-lg animated fadeIn',
            initialState: {
                project: project,
                sprintId: sprintID,
            }
        };
        this.modalRef = this.modalService.show(EditSprintModalComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getSprintByProject();
        });
    }

    deleteSprint(sprintId) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + ' ' + this.translate.instant('project_planner.sprint.title').toLowerCase(),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.projectPlannerSprintService.delete(sprintId).subscribe(data => {
                    this.toastr.success(this.translate.instant('project_planner.sprint.messages.delete'), this.translate.instant('project_planner.sprint.title'));
                    this.getSprintByProject();
                });
            }
        });
    }

    openCreateSprintTaskModal(sprintData, type) {
        sprintData.type = type;
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-lg animated fadeIn',
            initialState: {
                sprint: sprintData
            }
        };
        this.modalRef = this.modalService.show(CreateSprintTaskModalComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getSprintByProject();
        });
    }

    openEditSprintTaskModal(sprint, taskID) {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-lg animated fadeIn',
            initialState: {
                sprint: sprint,
                taskId: taskID,
            }
        };
        this.modalRef = this.modalService.show(EditSprintTaskModalComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getSprintByProject();
        });
    }

    openCreateTaskModal(project, type) {
        project.type = type;
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-lg animated fadeIn',
            initialState: {
                project: project
            }
        };
        this.modalRef = this.modalService.show(CreateTaskModalComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getSprintByProject();
        });
    }

    openEditTaskModal(project, taskID) {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-lg animated fadeIn',
            initialState: {
                taskId: taskID,
                project: project
            }
        };
        this.modalRef = this.modalService.show(EditTaskModalComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getSprintByProject();
        });
    }

    openMoveTaskModal(taskID, sprintID) {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                taskId: taskID,
                sprintId: sprintID,
                sprints: this.sprints.sprint_tasks
            }
        };
        this.modalRef = this.modalService.show(MoveTaskModalComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getSprintByProject();
        });
    }

    deleteTask(taskId) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + ' ' + this.translate.instant('project_planner.sprint_task.title4').toLowerCase(),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.projectPlannerSprintService.deleteTask(taskId).subscribe(data => {
                    this.toastr.success(this.translate.instant('project_planner.sprint_task.messages.task_delete'), this.translate.instant('project_planner.sprint_task.title'));
                    this.getSprintByProject();
                });
            }
        });
    }

    deleteStory(taskId) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + ' ' + this.translate.instant('project_planner.sprint_task.title5').toLowerCase(),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.projectPlannerSprintService.deleteTask(taskId).subscribe(data => {
                    this.toastr.success(this.translate.instant('project_planner.sprint_task.messages.story_delete'), this.translate.instant('project_planner.sprint_task.title'));
                    this.getSprintByProject();
                });
            }
        });
    }

}
