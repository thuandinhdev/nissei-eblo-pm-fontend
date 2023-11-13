import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';

import {FileBrowserService} from '../../../../core/services/file-browser.service';

@Component({
    selector: 'app-create-folder-model',
    templateUrl: './create-folder-model.component.html',
    styleUrls: ['./create-folder-model.component.scss']
})

export class CreateFolderModelComponent implements OnInit {
    public onClose: Subject<boolean>;
    createFolderForm: FormGroup;
    current_folder: number;
    isSubmitted = false;

    constructor(
        public translate: TranslateService,
        public bsCreateFolderModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private fbService: FileBrowserService,
        private toastr: ToastrService
    ) {
    }

    get folderControl() {
        return this.createFolderForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForm();
    }

    loadForm() {
        this.createFolderForm = this.formBuilder.group({
            parent_folder: [this.current_folder, Validators.required],
            folder_name: ['', Validators.required],
            folder_desc: ['']
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.createFolderForm.invalid) {
            return;
        }

        this.fbService.createFolder(this.createFolderForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('file_browser.messages.create_folder'), this.translate.instant('file_browser.title'));
            this.onCancel();
        });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsCreateFolderModalRef.hide();
    }
}
