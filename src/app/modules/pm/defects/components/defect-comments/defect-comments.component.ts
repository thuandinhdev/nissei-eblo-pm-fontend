import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';

import {DefectService} from '../../../../../core/services/defect.service';
import {DefectCommentsService} from '../../../../../core/services/defect-comments.service';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-defect-comments',
    templateUrl: './defect-comments.component.html',
    styleUrls: ['./defect-comments.component.scss']
})

export class DefectCommentsComponent implements OnInit {
    @Input() permission;
    @Input() apiUrl;
    @Input() loginUser: any;
    defectCommentsForm: FormGroup;
    defectCommentsReplyForm: FormGroup;
    comments: any;
    defectData: any;
    replayComment: any;
    dropzoneObj: any;
    fileDetails: any;
    isPageLoaded = false;
    isCommentFormSubmitted = false;
    isReplayFormSubmitted = false;
    parentChild = [];
    selectedFiles = [];
    defectId = this.route.snapshot.params.id;
    customClass = 'comment-collapse';
    oneAtATime: boolean = true;

    @ViewChild('commentdropzone', {static: false}) commentdropzone: ElementRef;

    constructor(
        public translate: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private defectCommentsService: DefectCommentsService,
        private defectService: DefectService
    ) {
    }

    get commentControl() {
        return this.defectCommentsForm.controls;
    }

    get replyCommentControl() {
        return this.defectCommentsReplyForm.controls;
    }

    ngOnInit() {
        this.loadForms();
        this.getComment(this.defectId);
        this.loadReplyForm();

        setTimeout(() => {
            this.loadDropzone();
        });
    }

    loadForms() {
        let that = this;
        this.defectCommentsForm = this.formBuilder.group({
            defect_id: [this.defectId],
            comment: ['', Validators.required],
            files: [null]
        });
    }

    loadReplyForm() {
        this.defectCommentsReplyForm = this.formBuilder.group({
            defect_id: [this.defectId],
            replay_comment: [''],
            parent_id: [null],
        });
    }

    loadDropzone() {
        let that = this;
        this.dropzoneObj = new Dropzone(this.commentdropzone.nativeElement, {
            url: 'https://httpbin.org/post',
            maxFiles: 5,
            clickable: true,
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
                        that.fileDetails = file;
                        reader.onload = (e) => {
                            let thisFile = {
                                uuid: that.fileDetails.upload.uuid,
                                name: file.name,
                                extension: file.name.split('.').pop(),
                                size: file.size,
                                file: reader.result
                            };
                            that.selectedFiles.push(thisFile);
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.fileDetails = file;
                    that.selectedFiles.forEach((value, index) => {
                        if (value.uuid == that.fileDetails.upload.uuid) {
                            that.selectedFiles.splice(index, 1);
                        }
                    });
                });

                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });
    }

    onSubmit() {
        this.isCommentFormSubmitted = true;

        if (this.defectCommentsForm.invalid) {
            return;
        }

        this.defectCommentsForm.patchValue({files: this.selectedFiles});

        this.defectCommentsService.create(this.defectCommentsForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('comments.messages.create'), this.translate.instant('comments.title'));
            this.dropzoneObj.removeAllFiles();
            this.getComment(this.defectId);
            this.commentFormReset();
            this.loadForms();
        });
    }

    replyFormReset() {
        this.defectCommentsReplyForm.patchValue({replay_comment: ''});
        this.defectCommentsReplyForm.patchValue({files: ''});
        this.defectCommentsReplyForm.patchValue({attachments: ''});
    }

    commentFormReset() {
        this.isCommentFormSubmitted = false;
        this.commentControl.comment.reset();
        this.defectCommentsForm.patchValue({attachments: null});
    }

    showReplayCommentBox(id) {
        $('#comment_replay_' + id).removeClass('d-none');
    }

    getComment(defectId) {
        this.defectService.getById(defectId).subscribe(
            data => {
                this.defectData = data;
                this.defectData.comments = this.getNestedChildren(this.defectData.comments, 0);
                this.comments = this.defectData.comments;
            });
    }

    getNestedChildren(comment, parent) {
        let parentChild = [];
        for (let i in comment) {
            if (comment[i].attachments && ($.type(comment[i].attachments) === 'string')) {
                let jsonParse = JSON.parse(comment[i].attachments);
                comment[i].attachments = jsonParse;
            }
            if (comment[i].parent_id == parent) {
                let child = this.getNestedChildren(comment, comment[i].id);
                if (child.length) {
                    comment[i].child = child;
                }
                parentChild.push(comment[i]);
            }
        }
        return parentChild;
    }

    postReplayComment(comment) {
        if (this.defectCommentsReplyForm.value.replay_comment) {
            this.isReplayFormSubmitted = true;
            comment.parent_id = comment.id;
            comment.files = '';
            comment.comment = this.defectCommentsReplyForm.value.replay_comment;
            this.defectCommentsReplyForm.patchValue({attachments: ''});
            let replyCommentValues = {
                comment: this.defectCommentsReplyForm.value.replay_comment,
                parent_id: comment.parent_id,
                defect_id: comment.defect_id,
                user: comment.user,
                user_id: comment.user_id,
                files: '',
                attachments: '',
                replay_comment: this.defectCommentsReplyForm.value.replay_comment
            };

            if (this.defectCommentsReplyForm.invalid) {
                return;
            }
            this.defectCommentsService.create(replyCommentValues)
                .subscribe(
                    resp => {
                        this.toastr.success(this.translate.instant('comments.messages.create'), this.translate.instant('comments.title'));
                        this.getComment(this.defectId);
                        this.replyFormReset();
                        this.loadForms();
                    });
        } else {
            this.toastr.error(this.translate.instant('comments.create.error_messages.message4'), this.translate.instant('comments.title'));
            return false;
        }
    }

    commentDelete(commentId) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.defectCommentsService.delete(commentId)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('comments.messages.delete'), this.translate.instant('defects.title'));
                            this.getComment(this.defectId);
                        });
            }
        });
    }

    saveComments(comment, index, value) {
        comment[index] = value;
        this.defectCommentsService.update(comment).subscribe(data => {
            this.toastr.success(this.translate.instant('comments.messages.update'), this.translate.instant('defects.title'));
            this.getComment(this.defectId);
        });
    }

}
