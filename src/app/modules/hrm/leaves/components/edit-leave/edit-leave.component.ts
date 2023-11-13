import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {Leave} from '../../../../../shared/models/leave.model';

import {LeaveService} from '../../../../../core/services/leave.service';
import {LeavetypeService} from '../../../../../core/services/leavetype.service';

import {LeaveTypeModalComponent} from '../../components/leave-type-modal/leave-type-modal.component';

import {environment} from '../../../../../../environments/environment';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-edit-leave',
    templateUrl: './edit-leave.component.html',
    styleUrls: ['./edit-leave.component.scss']
})

export class EditLeaveComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    editLeaveForm: FormGroup;
    leavetypes: any;
    dropzoneObj: any;
    fileDetails: any;
    selectedFiles = [];
    removedFiles = [];
    leave: Leave;
    isFormSubmitted = false;
    isPageLoad = false;
    isFormLoad = false;
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
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private datepipe: DatePipe,
        private leaveService: LeaveService,
        private leavetypeService: LeavetypeService
    ) {
    }

    get leaveControl() {
        return this.editLeaveForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.getLeaveTypes(true);
    }

    loadForm() {
        this.editLeaveForm = this.formBuilder.group({
            id: [this.leave.id],
            user_id: [this.leave.user_id],
            leave_type_id: [this.leave.leave_type_id, Validators.required],
            duration: [this.leave.duration],
            duration_type: [this.leave.duration_type],
            leave_date: [new Date(this.leave.leave_date), Validators.required],
            reason: [this.leave.reason, Validators.required],
            status: [this.leave.status],
            files: [null],
            removed_files: [null]
        });

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

    removeattachments(id) {
        this.leave.attachments.forEach((value, index) => {
            if (value.id == id) {
                this.leave.attachments.splice(index, 1);
                this.removedFiles.push(id);
            }
        });
    }

    changeDuration($event = []) {
        if (this.editLeaveForm.value.duration == 'half') {
            this.editLeaveForm.patchValue({'duration_type': 'first_half'});
        } else {
            this.editLeaveForm.patchValue({'duration_type': null});
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

    openLeaveTypeModal() {
        this.bsModalRef = this.modalService.show(LeaveTypeModalComponent, this.modalConfigs);
        this.bsModalRef.content.event.subscribe(data => {
            this.getLeaveTypes();
        });
        return false;
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editLeaveForm.invalid) {
            return;
        }

        this.editLeaveForm.patchValue({files: this.selectedFiles});
        this.editLeaveForm.patchValue({removed_files: this.removedFiles});

        this.editLeaveForm.value.leave_date = this.datepipe.transform(this.editLeaveForm.value.leave_date, 'yyyy-MM-dd');

        this.leaveService.update(this.editLeaveForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('leaves.messages.update'), this.translate.instant('leaves.title'));
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
