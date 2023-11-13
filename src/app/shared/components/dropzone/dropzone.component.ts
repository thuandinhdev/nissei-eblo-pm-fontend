import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import * as Dropzone from 'dropzone';
import {environment} from '../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-dropzone',
    templateUrl: './dropzone.component.html',
    styleUrls: ['./dropzone.component.scss'],
    preserveWhitespaces: true
})
export class ShowDropzoneComponent implements OnInit {
    @Input() parentFormArrayName;
    @Input() parentFormGroupName;
    @Input() parentFormControlName;
    @Input() defaultValue;
    isFileLoaded = true;
    @Output() dropzoneCallback: EventEmitter<any> = new EventEmitter();
    @ViewChild('logodropzone', {static: false}) logodropzone: ElementRef;
    private apiUrl = environment.apiUrl;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        public datepipe: DatePipe,
    ) {
    }


    ngOnInit() {
        if(!this.defaultValue){
            this.defaultValue = false;
        }
        setTimeout(() => {
            this.loadDropzone(function (res) {
            });
        }, 1000);
    }

    removeDropzoneImage() {
        this.isFileLoaded = false;
        let that = this;
        that.dropzoneCallback.emit({
            action: 'remove',
            file: null,
            parentFormArrayName: that.parentFormArrayName,
            parentFormGroupName: that.parentFormGroupName,
            parentFormControlName: that.parentFormControlName
        });
        this.isFileLoaded ? this['fileDropZone'].previewsContainer.lastChild['hidden'] = true : this['fileDropZone'].previewsContainer.lastChild['hidden']= false;
    }

    loadDropzone(callback) {
        let that = this;
        this['fileDropZone'] = new Dropzone(this.logodropzone.nativeElement, {
            url: 'https://httpbin.org/post',
            maxFiles: 1,
            clickable: true,
            acceptedFiles: 'image/*',
            createImageThumbnails: true,
            init: function () {
                const _this = this;
                that.defaultValue ? _this.previewsContainer.lastChild['hidden'] = true : _this.previewsContainer.lastChild['hidden']= false;
                this.on('addedfile', function (file) {
                    const removeButton = Dropzone.createElement('<button class=\'btn btn-sm btn-block\'>Remove file</button>');
                    if(_this.options.maxFiles == 1){
                        that.removeDropzoneImage();
                        if(_this.files.length > 1){
                            _this.removeFile(_this.files[0]);
                        }
                    }
                    removeButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.removeFile(file);
                    });

                    file.previewElement.appendChild(removeButton);
                    if (file) {
                        let reader = new FileReader();
                        reader.onload = (e) => {
                            that.dropzoneCallback.emit({
                                action: 'upload',
                                file: reader.result,
                                parentFormArrayName: that.parentFormArrayName,
                                parentFormGroupName: that.parentFormGroupName,
                                parentFormControlName: that.parentFormControlName
                            });
                            that.isFileLoaded = false;
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.removeDropzoneImage();
                    that.isFileLoaded = false;
                });

                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });
    }

}
