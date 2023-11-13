import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {SettingService} from '../../../../core/services/setting.service';

import {environment} from '../../../../../environments/environment';
import {collapsedMenu} from '../../../../core/helpers/app.helper';

import * as Dropzone from 'dropzone';

declare let $: any;

@Component({
    selector: 'app-theme-settings',
    templateUrl: './theme-settings.component.html',
    styleUrls: ['./theme-settings.component.scss']
})

export class ThemeSettingsComponent implements OnInit {
    @Input() settings: any;
    company_logo: any;
    company_sidebar_logo: any;
    login_background: any;
    sidebar_background_images: any;
    sidebar_background_images_obj: any;
    isCompanyLogoUploaded = false;
    isCompanySidebarLogoUploaded = false;
    isLoginBgUploaded = false;
    isSidebarBgsUploaded = false;
    @ViewChild('logodropzone', {static: true}) logoDropzone: ElementRef;
    @ViewChild('sidebardropzone', {static: true}) sidebardropzone: ElementRef;
    @ViewChild('loginbg', {static: true}) loginbg: ElementRef;
    @ViewChild('colorpaletts', {static: true}) colorpaletts: ElementRef;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private settingService: SettingService
    ) {
    }

    ngOnInit() {
        if (this.settings.company_logo) {
            this.company_logo = this.settings.company_logo;
            this.isCompanyLogoUploaded = true;
        }

        if (this.settings.company_sidebar_logo) {
            this.company_sidebar_logo = this.settings.company_sidebar_logo;
            this.isCompanySidebarLogoUploaded = true;
        }

        if (this.settings.login_background) {
            this.login_background = this.settings.login_background;
            this.isLoginBgUploaded = true;
        }

        if (this.settings.sidebar_background_images) {
            this.settings.sidebar_background_images = this.convertStringToArray(this.settings.sidebar_background_images);
            this.isSidebarBgsUploaded = true;
        }

        // --
        // Toggle
        // $('.theme-settings-toggle').on('click',function(){
        // 	$('.theme-settings').toggleClass('open');
        // });
        // $('.theme-settings-close').on('click',function(){
        // 	$('.theme-settings').removeClass('open');
        // });

        this.setSidebarWidth(this.settings.sidebar_width);
        this.setCollapsedMenu(this.settings.is_collapsed_menu);

        this.loadDropzones();
    }

    // --
    // Collapsed menu
    changeCollapsedMenu($event) {
        if (this.saveSettings({'is_collapsed_menu': this.settings.is_collapsed_menu})) {
            this.setCollapsedMenu(this.settings.is_collapsed_menu);
        } else {
            return false;
        }
    }

    setCollapsedMenu(isCollapsed) {
        let collapsedValue = false;
        if (isCollapsed || isCollapsed == 1) {
            collapsedValue = true;
        }

        collapsedMenu(collapsedValue);
        if (isCollapsed) {
            $('.app-sidebar').trigger('mouseleave');
        }
    }

    // --
    // Sidebar width
    changeSidebarWidth($event) {
        if (this.saveSettings({'sidebar_width': this.settings.sidebar_width})) {
            this.setSidebarWidth(this.settings.sidebar_width);
        } else {
            return false;
        }
    }

    setSidebarWidth(width) {
        let wrapper = $('.wrapper');
        switch (width) {
            case 'small':
                $(wrapper).removeClass('sidebar-lg').addClass('sidebar-sm');
                break;
            case 'large':
                $(wrapper).removeClass('sidebar-sm').addClass('sidebar-lg');
                break;
            default:
                $(wrapper).removeClass('sidebar-sm sidebar-lg');
                break;
        }
    }

    loadDropzones() {
        let that = this;
        new Dropzone(this.logoDropzone.nativeElement, {
            url: 'https://httpbin.org/post',
            maxFiles: 1,
            clickable: true,
            acceptedFiles: 'image/*',
            createImageThumbnails: true,
            init: function () {
                this.on('addedfile', function (file) {
                    const removeButton = Dropzone.createElement('<button class=\'btn btn-sm btn-block\'>Remove file</button>');
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
                            that.company_logo = reader.result;
                            this.isCompanyLogoUploaded = false;
                        };
                        reader.readAsDataURL(file);
                    }
                });
                this.on('removedfile', function (file) {
                    that.company_logo = null;
                    this.isCompanyLogoUploaded = false;
                });
                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });

        new Dropzone(this.loginbg.nativeElement, {
            url: 'https://httpbin.org/post',
            maxFiles: 1,
            clickable: true,
            acceptedFiles: 'image/*',
            createImageThumbnails: true,
            init: function () {
                this.on('addedfile', function (file) {
                    const removeButton = Dropzone.createElement('<button class=\'btn btn-sm btn-block\'>Remove file</button>');
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
                            that.login_background = reader.result;
                            that.isLoginBgUploaded = false;
                        };
                        reader.readAsDataURL(file);
                    }
                });
                this.on('removedfile', function (file) {
                    that.login_background = null;
                    that.isLoginBgUploaded = false;
                });
                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });

        //Color Pallets
        new Dropzone(this.colorpaletts.nativeElement, {
            url: 'https://httpbin.org/post',
            clickable: true,
            acceptedFiles: 'image/*',
            createImageThumbnails: true,
            init: function () {
                this.on('addedfile', function (file) {
                    const removeButton = Dropzone.createElement('<button class=\'btn btn-sm btn-block\'>Remove file</button>');
                    const _this = this;
                    removeButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.removeFile(file, 'test');
                    });

                    file.previewElement.appendChild(removeButton);
                    if (file) {
                        let reader = new FileReader();
                        reader.onload = (e) => {
                            that.sidebar_background_images_obj = this.files;
                        };
                        reader.readAsDataURL(file);
                    }
                });
                this.on('removedfile', function (file, param) {
                });
                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });

        new Dropzone(this.sidebardropzone.nativeElement, {
            url: 'https://httpbin.org/post',
            maxFiles: 1,
            clickable: true,
            acceptedFiles: 'image/*',
            createImageThumbnails: true,
            init: function () {
                this.on('addedfile', function (file) {
                    const removeButton = Dropzone.createElement('<button class=\'btn btn-sm btn-block\'>Remove file</button>');
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
                            that.company_sidebar_logo = reader.result;
                            that.isCompanySidebarLogoUploaded = false;
                        };
                        reader.readAsDataURL(file);
                    }
                });
                this.on('removedfile', function (file) {
                    that.company_sidebar_logo = null;
                    that.isCompanySidebarLogoUploaded = false;
                });
                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });
    }

    convertStringToArray(value) {
        if (typeof value == 'string') {
            value = value.replace('[', '');
            value = value.replace(']', '');
            while (value.indexOf('"') > -1) {
                value = value.replace('"', '');
            }

            return value.split(',');
        } else {
            return null;
        }
    }

    removeImage(array, item) {
        for (let i in array) {
            if (array[i] == item) {
                array.splice(i, 1);
                break;
            }
        }
    }

    removeCompanyLogo() {
        this.company_logo = null;
        this.isCompanyLogoUploaded = false;
    }

    removeCompanySidebarLogo() {
        this.company_sidebar_logo = null;
        this.isCompanySidebarLogoUploaded = false;
    }

    removeLoginBg() {
        this.login_background = null;
        this.isLoginBgUploaded = false;
    }

    removeSidebarBgImage(image) {
        this.sidebar_background_images = null;
        this.removeImage(this.settings.sidebar_background_images, image);

        if (this.settings.sidebar_background_images.length == 0) {
            this.isSidebarBgsUploaded = false;
        }
    }

    saveSettings(settings) {
        return this.settingService.create(settings).subscribe(
            data => {
                return true;
                this.toastr.success(this.translate.instant('settings.messages.update'), this.translate.instant('settings.title'));
            }, data => {
                return false;
            });
    }

    onSubmit() {
        let sidebar_bg_imgs = [];

        if (this.sidebar_background_images_obj) {
            for (let iRow = 0; iRow < this.sidebar_background_images_obj.length; iRow++) {
                let thisfile = {
                    file: this.sidebar_background_images_obj[iRow].dataURL,
                    name: this.sidebar_background_images_obj[iRow].name,
                    size: this.sidebar_background_images_obj[iRow].size,
                    extension: this.sidebar_background_images_obj[iRow].name.split('.').pop()
                };
                sidebar_bg_imgs.push(thisfile);
            }
        }

        // --
        // Manage images
        this.settings.form_for = 'theme_setting';
        this.settings.settings_images = {
            company_logo: this.company_logo,
            company_sidebar_logo: this.company_sidebar_logo,
            login_background: this.login_background,
            sidebar_background_images: this.settings.sidebar_background_images,
            sidebar_background_images_obj: sidebar_bg_imgs
        };

        this.settingService.create(this.settings).subscribe(
            data => {
                this.toastr.success(this.translate.instant('settings.messages.update'), this.translate.instant('settings.title'));
            });
    }

}
