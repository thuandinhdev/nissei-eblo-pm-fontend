import {Component, Input, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {NgxRolesService} from 'ngx-permissions';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';

import {TimesheetService} from '../../../../core/services/timesheet.service';
import {MeetingService} from '../../../../core/services/meeting.service';

import {CreateTimesheetModalComponent} from '../../components/create-timesheet-modal/create-timesheet-modal.component';
import {EditTimesheetModalComponent} from '../../components/edit-timesheet-modal/edit-timesheet-modal.component';

@Component({
    selector: 'app-timesheet-list',
    templateUrl: './timesheet-list.component.html',
    styleUrls: ['./timesheet-list.component.scss']
})

export class TimesheetListComponent implements OnInit {
    @Input() module_id: number;
    @Input() module_related_id: number;
    @Input() project_id: number;
    @Input() loginUser: any;
    @Input() apiUrl: any;
    public modalRef: BsModalRef;
    timesheets: any;
    isPageLoaded = false;

    constructor(
        public translate: TranslateService,
        private modalService: BsModalService,
        private toastr: ToastrService,
        public ngxRolesService: NgxRolesService,
        private timesheetService: TimesheetService,
        private meetingService: MeetingService
    ) {
    }

    ngOnInit() {
        this.getTimesheet();
    }

    getTimesheet() {
        let params = {'module_id': this.module_id, 'module_related_id': this.module_related_id};
        this.timesheetService.getTimesheetsByModule(params).subscribe(data => {
            this.timesheets = data;
            this.isPageLoaded = true;
        });
    }

    openTimesheetCreateModal() {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                params: {
                    module_id: this.module_id,
                    module_related_id: this.module_related_id,
                    project_id: this.project_id
                }
            }
        };
        this.modalRef = this.modalService.show(CreateTimesheetModalComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getTimesheet();
        });
    }

    editTimesheet(timesheet) {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                timesheet: timesheet
            }
        };
        this.modalRef = this.modalService.show(EditTimesheetModalComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getTimesheet();
        });
    }

    deleteTimesheet(id, index) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + this.translate.instant('timesheet.title').toLowerCase() + '!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.timesheetService.delete(id).subscribe(data => {
                    this.timesheets.splice(index, 1);
                    this.toastr.success(this.translate.instant('timesheet.messages.delete'), this.translate.instant('timesheet.title'));
                });
            }
        });
    }

    saveTimesheetDetail(index, name, value) {
        this.timesheets[index][name] = value;
        this.timesheetService.update(this.timesheets[index]).subscribe(data => {
            this.toastr.success(this.translate.instant('timesheet.messages.update'), this.translate.instant('timesheet.title'));
            this.getTimesheet();
        });
    }

    getCheckPermission(timesheet) {
        let role = this.ngxRolesService.getRole('admin');
        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
            return true;
        } else if (timesheet.created_user_id == this.loginUser.id) {
            return true;
        } else {
            return false;
        }
    }

    addTimesheet() {
        if (this.module_id == 5) {
            this.meetingService.getById(this.module_related_id).subscribe(data => {
                let meeting: any = data;
                let params = {
                    project_id: null,
                    module_id: this.module_id,
                    module_related_id: this.module_related_id,
                    start_time: meeting.start_date,
                    end_time: meeting.end_date,
                    note: null
                };
                this.timesheetService.create(params).subscribe(data => {
                    this.getTimesheet();
                    this.toastr.success(this.translate.instant('timesheet.messages.create'), this.translate.instant('timesheet.title'));
                }, error => {
                    this.toastr.error(this.translate.instant('common.error_messages.message5'));
                });
            }, error => {
                this.toastr.error(this.translate.instant('common.error_messages.message5'));
            });
        } else {
            this.toastr.error(this.translate.instant('common.error_messages.message5'));
        }
    }

}
