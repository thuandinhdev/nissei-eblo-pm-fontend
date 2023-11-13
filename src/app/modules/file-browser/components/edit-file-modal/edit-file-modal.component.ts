import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';

import {File} from '../../../../shared/models/file.model';

import {FileBrowserService} from '../../../../core/services/file-browser.service';

@Component({
    selector: 'app-edit-file-modal',
    templateUrl: './edit-file-modal.component.html',
    styleUrls: ['./edit-file-modal.component.scss']
})

export class EditFileModalComponent implements OnInit {
    public onClose: Subject<boolean>;
    editFileForm: FormGroup;
    file: File;
    isSubmitted = false;
    renameFileFailederrors = [];

    constructor(
        public translate: TranslateService,
        public bsEditFileModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private fbService: FileBrowserService,
        private toastr: ToastrService
    ) {
    }

    get fileControl() {
        return this.editFileForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForm();
    }

    loadForm() {
        this.editFileForm = this.formBuilder.group({
            id: [this.file.id],
            file_name: [this.file.file_name, Validators.required]
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.editFileForm.invalid) {
            return;
        }

        this.fbService.updateFile(this.editFileForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('file_browser.messages.update_file'), this.translate.instant('file_browser.title'));
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsEditFileModalRef.hide();
    }

}
