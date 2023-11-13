import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {TranslateService} from '@ngx-translate/core';
import {FileUploader} from 'ng2-file-upload';
import Swal from 'sweetalert2';

import {AuthenticationService} from '../../../../core/services/authentication.service';
import {MailService} from '../../../../core/services/mail.service';
import {UserService} from '../../../../core/services/user.service';

import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-mailbox',
    templateUrl: './mailbox.component.html',
    styleUrls: ['./mailbox.component.scss']
})

export class MailboxComponent implements OnInit {
    public uploader: FileUploader;
    public mailboxViewable: boolean;
    public composeViewable: boolean;
    public mailviewViewable: boolean;
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    composeMailForm: FormGroup;
    hasBaseDropZoneOver: boolean;
    resData: any = {};
    mailDetails: any = {};
    loginToken: any;
    loginUser: any;
    txtSearch: string;
    mailboxData = {} as any;
    tableData = {} as any;
    tableParams = {} as any;
    mail_checked = [];
    submitted = false;
    isMailLoaded = false;
    attachmentsArr = [];
    mailboxUsers = [];
    mailboxEmailsUsers = [];
    mailboxType: string;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private authenticationService: AuthenticationService,
        private mailService: MailService,
        private userService: UserService,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
    ) {
        this.loginToken = this.authenticationService.currentTokenValue;
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
        this.toggle(true, false, false);
        this.loadFileUploader();
    }

    get mailForm() {
        return this.composeMailForm.controls;
    }

    ngOnInit() {
        this.setTableParams();
        this.tableParams.length = 5;
        this.tableParams.emailType = 'inbox';
        this.tableParams.trashType = 'inbox';
        this.getMail(this.tableParams.emailType);
        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        };
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            if (!isNaN(response)) {
                this.attachmentsArr.push(response);
                this.toastr.success(this.translate.instant('mailbox.messages.message'), this.translate.instant('mailbox.title'));
            }
        };
        this.userService.getMailUsers().subscribe(resp => {
            this.mailboxEmailsUsers = resp;
            resp.forEach(user => {
                this.mailboxUsers.push({value: user.id, label: user.firstname + ' ' + user.lastname});
            });
        });
    }

    loadFileUploader() {
        this.uploader = new FileUploader({
            url: this.apiUrl + '/api/mailbox/files/upload',
            method: 'post',
            authToken: this.loginToken.token_type + ' ' + this.loginToken.token,
            removeAfterUpload: false,
            autoUpload: true,
            isHTML5: true,
        });
        this.hasBaseDropZoneOver = false;
    }

    getMail(emailType, trashType = this.tableParams.trashType) {
        this.toggle(true, false, false);
        if (emailType != this.tableParams.emailType) {
            this.tableParams.emailType = emailType;
            this.setTableParams();
        }
        if (trashType != this.tableParams.trashType && trashType != '') {
            this.tableParams.trashType = trashType;
            this.setTableParams();
        }

        let reqObj = {
            type: this.tableParams.emailType,
            trashType: this.tableParams.trashType,
            search: this.txtSearch,
            currentPage: this.tableParams.currentPage,
            length: this.tableParams.length,
            start: (this.tableParams.currentPage - 1) * this.tableParams.length,
        };
        this.mailService.getAll(reqObj).subscribe(resp => {
            this.mailboxData = resp;
            this.tableData = {
                listData: this.mailboxData.mailbox,
                countUnRead: this.mailboxData.countUnRead,
                countDraft: this.mailboxData.countDraft,
                totalPage: this.mailboxData.totalPage,
                totalData: this.mailboxData.totalData,
            };
        });
    }

    search() {
        this.setTableParams();
        this.getMail(this.tableParams.emailType);
    }

    setPage(currentPage) {
        let isPageSet: boolean = true;
        if (currentPage < 1) {
            currentPage = 1;
            isPageSet = false;
        } else if (currentPage > this.tableData.totalPage) {
            currentPage = this.tableData.totalPage;
            isPageSet = false;
        }
        this.tableParams.currentPage = currentPage;
        if (isPageSet) {
            this.getMail(this.tableParams.emailType);
        }
    }

    setTableParams() {
        this.tableParams.start = 0;
        this.tableParams.currentPage = 1;
    }

    markAsRead() {
        let mailObj = {
            ids: this.mail_checked
        };

        if (this.mail_checked.length <= 0) {
            this.toastr.error(this.translate.instant('mailbox.messages.message2'), this.translate.instant('mailbox.title'));
            return false;
        }

        this.mailService.markAsRead(mailObj).subscribe(data => {
            this.toastr.success(this.translate.instant('mailbox.messages.message8'), this.translate.instant('mailbox.title'));
            this.referesh();
        });
    }

    markAsFavourite() {
        let mailObj = {
            ids: this.mail_checked
        };

        if (this.mail_checked.length <= 0) {
            this.toastr.error(this.translate.instant('mailbox.messages.message2'), this.translate.instant('mailbox.title'));
            return false;
        }

        this.mailService.markAsFavourite(mailObj).subscribe(data => {
            this.toastr.success(this.mail_checked.length + this.translate.instant('mailbox.messages.message7'), this.translate.instant('mailbox.title'));
            this.referesh();
        });
    }

    setUnFavouriteMail(id) {
        let mailObj = {
            id: id
        };

        this.mailService.setUnFavouriteMail(mailObj).subscribe(data => {
            this.toastr.success(this.translate.instant('mailbox.messages.message6'), this.translate.instant('mailbox.title'));
            this.referesh();
        });
    }

    moveToTrash() {
        let mailObj = {
            ids: this.mail_checked
        };

        if (this.mail_checked.length <= 0) {
            this.toastr.error(this.translate.instant('mailbox.messages.message2'), this.translate.instant('mailbox.title'));
            return false;
        }

        this.mailService.removeMarkMails(mailObj).subscribe(data => {
            this.toastr.success(this.mail_checked.length + this.translate.instant('mailbox.messages.message5'), this.translate.instant('mailbox.title'));
            this.referesh();
        });
    }

    composeMail() {
        this.toggle(false, true, false);
        this.attachmentsArr = [];
        this.composeMailForm = this.formBuilder.group({
            to: ['', Validators.required],
            subject: ['', Validators.required],
            message_body: [''],
        });
    }

    onSubmit(type) {
        this.submitted = true;
        if (this.composeMailForm.invalid) {
            return;
        }

        let mailComObj = {
            type: type,
            to: this.composeMailForm.value.to,
            subject: this.composeMailForm.value.subject,
            message_body: this.composeMailForm.value.message_body,
            attachments: this.attachmentsArr,
        };

        this.mailService.create(mailComObj).subscribe(data => {
            if (type == 'draft') {
                this.toastr.success(this.translate.instant('mailbox.messages.message9'), this.translate.instant('mailbox.title'));
            } else {
                this.toastr.success(this.translate.instant('mailbox.messages.message3'), this.translate.instant('mailbox.title'));
            }
            this.toggle(true, false, false);
        });
    }

    // View mail.
    mailView(id, type) {
        this.isMailLoaded = false;
        this.mailboxType = type;
        this.mailService.findById(id).subscribe(resp => {
            this.resData = resp;
            this.mailDetails = this.resData.mailbox;
            this.toggle(false, false, true);
            this.isMailLoaded = true;
        });
    }

    deleteMail(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + ' ' + this.translate.instant('mailbox.title20'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.mailService.destroy(id).subscribe(data => {
                    this.toastr.success(this.translate.instant('mailbox.messages.message4'), this.translate.instant('mailbox.title'));
                    this.getMail(this.tableParams.emailType);
                });
            }
        });
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
            this.mailService.removeAttachments(dataObj).subscribe(data => {
                this.toastr.success(this.translate.instant('mailbox.messages.message1'), this.translate.instant('mailbox.title'));
            });
            this.attachmentsArr.splice(index, 1);
        }
    }

    public toggle(mailboxViewable, composeViewable, mailviewViewable): void {
        this.mailboxViewable = mailboxViewable;
        this.composeViewable = composeViewable;
        this.mailviewViewable = mailviewViewable;
    }

    referesh() {
        this.mail_checked = [];
        this.getMail(this.tableParams.emailType);
    }

    getSentUser(email) {
        for (let iRow in this.mailboxEmailsUsers) {
            if (this.mailboxEmailsUsers[iRow].email == email) {
                return this.mailboxEmailsUsers[iRow].firstname + ' ' + this.mailboxEmailsUsers[iRow].lastname;
            }
        }
    }

}
