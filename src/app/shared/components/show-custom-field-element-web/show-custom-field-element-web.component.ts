import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import * as Dropzone from 'dropzone';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-show-custom-field-element-web',
    templateUrl: './show-custom-field-element-web.component.html',
    styleUrls: ['./show-custom-field-element-web.component.scss'],
    preserveWhitespaces: true
})
export class ShowCustomFieldElementWebComponent implements OnInit {
    @Input() customFields;
    @Input() multiple;
    @Input() formArray;
    @Input() machineName;
    @Input() widgetsData;
    @Input() controls: FormArray;
    @Input() formName: FormGroup;
    @Input() isFormSubmitted: boolean;
    dataCallback: any;
    selected: any;
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };
    @ViewChild('logodropzone', {static: false}) logodropzone: ElementRef;
    private apiUrl = environment.apiUrl;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public datepipe: DatePipe,
    ) {
    }


    ngOnInit() {
        let that = this;
        let i = 0;
        let keyName = '';
        let myForm: any;
        if (that.multiple != 0) {
            myForm = (<FormArray>that.formName.get(that.formArray)).at(i);
        } else {
            myForm = (<FormArray>that.formName.get(that.formArray)).at(i);
        }
        this.customFields.forEach(obj => {
            if (obj.field_type == 'file') {
                setTimeout(() => {
                    this.loadDropzone(function (res) {
                        keyName = that.formArray + obj.field_column;
                        myForm.patchValue({
                            [keyName]: res
                        });
                    });
                });
            }
            i = i + 1;
        });
    }

    removeDropzoneImage(key) {
        let that = this;
        let myForm = (<FormArray>that.formName.get(that.formArray)).at(0);
        this.widgetsData[key] = null;
        myForm.patchValue({[key]: null});
    }

    loadDropzone(callback) {
        let that = this;
        new Dropzone(this.logodropzone.nativeElement, {
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
                            callback(reader.result);
                            // that.formName.patchValue({project_logo: reader.result});
                            this.isLogoLoaded = false;
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.formName.patchValue({project_logo: null});
                });

                this.on('error', function (file, message: any) {
                    if (file) {
                        // that.toastr.error(message);
                    }
                });
            }
        });
    }

    setLogos(project_logo) {
        if (project_logo === this.selected) {
            this.selected = null;
        } else {
            this.selected = project_logo;
        }
        this.formName.patchValue({project_logo: this.selected});
    }

    isActive(avatar) {
        return this.selected === avatar;
    };

}
