import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {FileSaverService} from 'ngx-filesaver';
import Swal from 'sweetalert2';

import {FileBrowserService} from '../../../../core/services/file-browser.service';
import {AuthenticationService} from '../../../../core/services/authentication.service';

import {UploadFilesModelComponent} from '../../components/upload-files-model/upload-files-model.component';
import {EditFileModalComponent} from '../../components/edit-file-modal/edit-file-modal.component';
import {CreateFolderModelComponent} from '../../components/create-folder-model/create-folder-model.component';
import {EditFolderModalComponent} from '../../components/edit-folder-modal/edit-folder-modal.component';

import {environment} from '../../../../../environments/environment';



@Component({
    selector: 'app-file-browser',
    templateUrl: './file-browser.component.html',
    styleUrls: ['./file-browser.component.scss']
})

export class FileBrowserComponent implements OnInit {
    public modalRef: BsModalRef;
    loginUser: any;
    current_folder: any = 0;
    files: any;
    folders: any;
    breadcrumbs: any;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private fbService: FileBrowserService,
        private _http: HttpClient,
        private _FileSaverService: FileSaverService,
        public authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.getFolderBreadcrumb();
        this.getFolders();
        this.getFiles();
    }

    getFileFolders(id) {
        this.current_folder = id;
        this.getFolderBreadcrumb();
        this.getFolders();
        this.getFiles();
    }

    getFolderBreadcrumb() {
        let reqObj = {folder: this.current_folder};
        this.fbService.getFolderBreadcrumb(reqObj).subscribe(resp => {
            this.breadcrumbs = resp;
        });
    }

    getFolders() {
        let reqObj = {folder: this.current_folder};
        this.fbService.getFolders(reqObj).subscribe(resp => {
            this.folders = resp;
        });
    }

    isEmptyObject(obj) {
        return (obj && (Object.keys(obj).length === 0));
    }

    getFiles() {
        let reqObj = {folder: this.current_folder};
        this.fbService.getFiles(reqObj).subscribe(resp => {
            this.files = resp;
            if (this.files) {
                // --
                // Render files based on file type
                for (let iRow in this.files) {
                    switch (this.files[iRow].file_extension) {
                        case 'txt':
                            this.files[iRow].icon = 'fa fa-file-text';
                            break;
                        case 'mp3':
                        case 'wav':
                        case 'raw':
                        case 'tta':
                            this.files[iRow].icon = 'fa fa-music';
                            break;
                        case 'webm':
                        case 'flv':
                        case 'ogg':
                        case 'mov':
                        case 'mp4':
                        case 'm4p':
                        case 'mpeg':
                        case 'f4v':
                        case '3gp':
                            this.files[iRow].icon = 'fa fa-film';
                            break;
                        case 'pdf':
                            this.files[iRow].icon = 'fa fa-file-pdf-o';
                            break;
                        case 'jpeg':
                        case 'jpg':
                        case 'png':
                        case 'gif':
                        case 'bmp':
                        case 'svg':
                            this.files[iRow].isImageFile = true;
                            break;
                        default:
                            this.files[iRow].isImageFile = false;
                            this.files[iRow].icon = 'fa fa-file';
                            break;
                    }
                }
            }
        });
    }

    getParentFolderId() {
        this.fbService.getById(this.current_folder).subscribe(resp => {
            this.current_folder = resp;
            this.getFileFolders(this.current_folder);
        });
    }

    uploadFileModal() {
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                current_folder: this.current_folder
            }
        };
        this.modalRef = this.modalService.show(UploadFilesModelComponent, modalConfig);
        this.modalRef.content.onClose.subscribe(result => {
            this.getFileFolders(this.current_folder);
        });
    }

    opneFileEditModal(file) {
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                file: file
            }
        };

        this.modalRef = this.modalService.show(EditFileModalComponent, modalConfig);
        this.modalRef.content.onClose.subscribe(result => {
            this.getFileFolders(this.current_folder);
        });
    }

    openFolderCreateModal() {
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                current_folder: this.current_folder
            }
        };
        this.modalRef = this.modalService.show(CreateFolderModelComponent, modalConfig);
        this.modalRef.content.onClose.subscribe(result => {
            this.getFileFolders(this.current_folder);
        });
    }

    openFolderEditModal(folder) {
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                folder: folder
            }
        };

        this.modalRef = this.modalService.show(EditFolderModalComponent, modalConfig);
        this.modalRef.content.onClose.subscribe(result => {
            this.getFileFolders(this.current_folder);
        });
    }

    deleteFolder(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + ' ' + this.translate.instant('file_browser.title6'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.fbService.deleteFolder(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('file_browser.messages.delete_folder'), this.translate.instant('file_browser.title'));
                            this.getFileFolders(this.current_folder);
                        });
            }
        });
    }

    deleteFile(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + ' ' + this.translate.instant('file_browser.title5'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.fbService.deleteFile(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('file_browser.messages.delete_file'), this.translate.instant('file_browser.title'));
                            this.getFileFolders(this.current_folder);
                        });
            }
        });

    }
}
