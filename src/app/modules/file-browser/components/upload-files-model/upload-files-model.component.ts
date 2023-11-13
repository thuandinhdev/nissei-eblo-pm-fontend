import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {FileUploader} from 'ng2-file-upload';
import {Subject} from 'rxjs';

import {AuthenticationService} from '../../../../core/services/authentication.service';
import {FileBrowserService} from '../../../../core/services/file-browser.service';

import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-upload-files-model',
    templateUrl: './upload-files-model.component.html',
    styleUrls: ['./upload-files-model.component.scss']
})

export class UploadFilesModelComponent implements OnInit {
    public uploader: FileUploader;
    public onClose: Subject<boolean>;
    hasBaseDropZoneOver: boolean;
    current_folder: number;
    loginToken: any;
    attachmentsArr = [];
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        public bsCreateFileModalRef: BsModalRef,
        private toastr: ToastrService,
        private fbService: FileBrowserService,
        private authenticationService: AuthenticationService,
    ) {
        this.loginToken = this.authenticationService.currentTokenValue;
    }

    ngOnInit() {
        this.uploader = new FileUploader({
            url: this.apiUrl + '/api/files/upload',
            authToken: this.loginToken.token_type + ' ' + this.loginToken.token,
            additionalParameter: {folder: this.current_folder},
            method: 'post',
            removeAfterUpload: false,
            autoUpload: true,
            isHTML5: true,
        });

        this.hasBaseDropZoneOver = false;
        this.onClose = new Subject();
        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        };

        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            let obj = JSON.parse(response);
            if (obj.success) {
                this.attachmentsArr.push(obj.id);
                this.toastr.success(this.translate.instant('file_browser.messages.upload_file'), this.translate.instant('file_browser.title'));
            }
        };
    }

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public uploaderRemove(id) {
        let index = this.attachmentsArr.indexOf(id);
        if (index > -1) {
            let dataObj = {
                id: id,
            };
            this.fbService.removeAttachments(dataObj).subscribe(data => {
                this.toastr.success(this.translate.instant('file_browser.messages.delete_file'), this.translate.instant('file_browser.title'));
            });
            this.attachmentsArr.splice(index, 1);
        }
    }

    onCancel() {
        this.onClose.next(false);
        this.bsCreateFileModalRef.hide();
    }

}
