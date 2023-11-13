import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {UserService} from '../../../../../core/services/user.service';

import {UserAvatars} from '../../../../../core/helpers/admin.helper';
import {environment} from '../../../../../../environments/environment';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-user-avatar-modal',
    templateUrl: './user-avatar-modal.component.html',
    styleUrls: ['./user-avatar-modal.component.scss']
})

export class UserAvatarModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    user: any;
    usersData: any;
    selected: any;
    avatars = UserAvatars;
    isFormSubmitted = false;
    isProfileUploded = false;
    isProfileLoaded = true;
    @ViewChild('profileDropzone', {static: true}) profileDropzone: ElementRef;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        public bsModalRef: BsModalRef,
        private toastr: ToastrService,
        private userService: UserService
    ) {
    }

    ngOnInit() {
        this.usersData = Object.assign({}, this.user);
        this.onClose = new Subject();
        this.loadDropzone();
        this.setAvatar(this.usersData.avatar);
    }

    loadDropzone() {
        let that = this;
        new Dropzone(this.profileDropzone.nativeElement, {
            url: 'https://httpbin.org/post',
            maxFiles: 1,
            clickable: true,
            acceptedFiles: 'image/*',
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
                        reader.onload = (e) => {
                            that.isProfileUploded = true;
                            that.usersData.avatar = reader.result;
                            that.isProfileLoaded = false;
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.usersData.avatar = null;
                    that.isProfileLoaded = false;
                });


                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });
    }

    removeDropzoneImage() {
        this.isProfileUploded = true;
        this.isProfileLoaded = false;
        this.usersData.avatar = null;
    }

    setAvatar(avatar) {
        if (avatar === this.selected) {
            this.selected = null;
        } else {
            this.selected = avatar;
        }
        this.usersData.avatar = this.selected;
    }

    isActive(avatar) {
        return this.selected === avatar;
    };

    onSubmit() {
        this.usersData.type = 'list';
        this.usersData.UserAvatars = this.avatars;
        this.userService.update(this.usersData).subscribe(
            data => {
                this.toastr.success(this.translate.instant('users.messages.avatar'), this.translate.instant('users.title'));
                this.event.emit({data: true});
                this.onCancel();
            }, error => {
                this.onCancel();
            });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }

}
