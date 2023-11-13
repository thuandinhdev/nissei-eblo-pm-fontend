import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';

import {Folder} from '../../../../shared/models/folder.model';

import {FileBrowserService} from '../../../../core/services/file-browser.service';

@Component({
    selector: 'app-edit-folder-modal',
    templateUrl: './edit-folder-modal.component.html',
    styleUrls: ['./edit-folder-modal.component.scss']
})

export class EditFolderModalComponent implements OnInit {
    public onClose: Subject<boolean>;
    editFolderForm: FormGroup;
    isSubmitted = false;
    folder: Folder;

    constructor(
        public translate: TranslateService,
        public bsEditFolderModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private fbService: FileBrowserService,
        private toastr: ToastrService
    ) {
    }

    get folderControl() {
        return this.editFolderForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForm();
    }

    loadForm() {
        this.editFolderForm = this.formBuilder.group({
            id: [this.folder.id],
            folder_name: [this.folder.folder_name, Validators.required],
            folder_desc: [this.folder.folder_desc]
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.editFolderForm.invalid) {
            return;
        }

        this.fbService.updateFolder(this.editFolderForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('file_browser.messages.update_folder'), this.translate.instant('file_browser.title'));
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsEditFolderModalRef.hide();
    }
}
