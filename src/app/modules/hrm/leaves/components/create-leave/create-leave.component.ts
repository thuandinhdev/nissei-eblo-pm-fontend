import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {LeaveService} from '../../../../../core/services/leave.service';
import {LeavetypeService} from '../../../../../core/services/leavetype.service';
import {UserService} from '../../../../../core/services/user.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {LeaveTypeModalComponent} from '../../components/leave-type-modal/leave-type-modal.component';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-create-leave',
    templateUrl: './create-leave.component.html',
    styleUrls: ['./create-leave.component.scss']
})

export class CreateLeaveComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    createLeaveForm: FormGroup;
    leavetypes: any;
    users: any;
    loginUser: any;
    dropzoneObj: any;
    fileDetails: any;
    isFormSubmitted = false;
    isPageLoad = false;
    dateSelected = [];
    selectedClass = [];
    selectedFiles = [];
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };
    modalConfigs = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'inmodal modal-dialog-centered modal-lg animated fadeIn'
    };
    @ViewChild('leaveDropzone', {static: false}) leaveDropzone: ElementRef;

    constructor(
        public translate: TranslateService,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private datepipe: DatePipe,
        private leaveService: LeaveService,
        private leavetypeService: LeavetypeService,
        private userService: UserService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    get leaveControl() {
        return this.createLeaveForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.getLeaveTypes(true);
        this.getUsers();
    }

    loadForm() {
        if (this.loginUser.is_admin || this.loginUser.is_super_admin) {
            this.createLeaveForm = this.formBuilder.group({
                user_id: [null, Validators.required],
                leave_type_id: [null, Validators.required],
                duration: ['full'],
                multi_date: [null],
                leave_date: [null],
                duration_type: [null],
                reason: [null, Validators.required],
                status: [1],
                files: [null]
            });
        } else {
            this.createLeaveForm = this.formBuilder.group({
                user_id: [this.loginUser.id],
                leave_type_id: [null, Validators.required],
                duration: ['full'],
                multi_date: [null],
                leave_date: [null],
                duration_type: [null],
                reason: [null, Validators.required],
                status: [1],
                files: [null]
            });
        }

        this.changeDuration();
        this.isPageLoad = true;
        setTimeout(() => {
            this.loadDropzone();
        });
    }

    loadDropzone() {
        let that = this;
        this.dropzoneObj = new Dropzone(this.leaveDropzone.nativeElement, {
            url: 'https://httpbin.org/post',
            maxFiles: 5,
            clickable: true,
            createImageThumbnails: true,
            init: function () {
                this.on('addedfile', function (file) {
                    const removeButton = Dropzone.createElement('<button class=\'btn btn-sm btn-block\'>' + that.translate.instant('common.remove_file') + '</button>');
                    const _this = this;
                    removeButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.removeFile(file);
                    });

                    file.previewElement.appendChild(removeButton);

                    if (file) {
                        let reader = new FileReader();
                        that.fileDetails = file;
                        reader.onload = (e) => {
                            let thisFile = {
                                uuid: that.fileDetails.upload.uuid,
                                name: file.name,
                                extension: file.name.split('.').pop(),
                                size: file.size,
                                file: reader.result
                            };
                            that.selectedFiles.push(thisFile);
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.fileDetails = file;
                    that.selectedFiles.forEach((value, index) => {
                        if (value.uuid == that.fileDetails.upload.uuid) {
                            that.selectedFiles.splice(index, 1);
                        }
                    });
                });

                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });
    }

    changeDuration($event = []) {
        if (this.createLeaveForm.value.duration == 'multiple') {
            this.selectedClass = [];
            this.dateSelected = [];
            this.createLeaveForm.get('multi_date').setValidators([Validators.required]);
            this.createLeaveForm.get('multi_date').updateValueAndValidity();

            this.createLeaveForm.get('leave_date').clearValidators();
            this.createLeaveForm.get('leave_date').updateValueAndValidity();
        } else {
            this.createLeaveForm.get('leave_date').setValidators([Validators.required]);
            this.createLeaveForm.get('leave_date').updateValueAndValidity();

            this.createLeaveForm.get('multi_date').clearValidators();
            this.createLeaveForm.get('multi_date').updateValueAndValidity();
        }

        if (this.createLeaveForm.value.duration == 'half') {
            this.createLeaveForm.patchValue({'duration_type': 'first_half'});
        } else {
            this.createLeaveForm.patchValue({'duration_type': null});
        }
    }

    getLeaveTypes(isFormload = false) {
        this.leavetypeService.getAll()
            .subscribe(
                data => {
                    this.leavetypes = data;
                    if (isFormload) {
                        this.loadForm();
                    }
                });
    }

    getUsers() {
        this.userService.getAll()
            .subscribe(
                data => {
                    this.users = data;
                });
    }

    getDateItem(date: Date): string {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    onValueChange(event) {
        if (event && event.length === undefined) {
            const date = this.getDateItem(event);
            const index = this.dateSelected.findIndex(item => {
                const testDate = this.getDateItem(item);
                return testDate === date;
            });

            if (index < 0) {
                this.dateSelected.push(event);
            } else {
                this.dateSelected.splice(index, 1);
            }
        }

        if (this.dateSelected.length > 0) {
            this.selectedClass = this.dateSelected.map(date => {
                return {
                    date,
                    classes: ['custom-selected-date']
                };
            });
        }
    }

    renderDates() {
        let dateArray = [];
        if (this.dateSelected) {
            for (let i in this.dateSelected) {
                dateArray.push(this.datepipe.transform(this.dateSelected[i], 'yyyy-MM-dd'));
            }
        }

        return dateArray;
    }

    openLeaveTypeModal() {
        this.bsModalRef = this.modalService.show(LeaveTypeModalComponent, this.modalConfigs);
        this.bsModalRef.content.event.subscribe(data => {
            this.getLeaveTypes();
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.createLeaveForm.invalid) {
            return;
        }

        this.createLeaveForm.patchValue({files: this.selectedFiles});

        this.createLeaveForm.value.leave_date = this.datepipe.transform(this.createLeaveForm.value.leave_date, 'yyyy-MM-dd');
        this.createLeaveForm.value.multi_date = this.renderDates();

        this.leaveService.create(this.createLeaveForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('leaves.messages.create'), this.translate.instant('leaves.title'));
            this.onCancel();
            this.event.emit({data: true});
        }, error => {
            this.onCancel();
        });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }

}
