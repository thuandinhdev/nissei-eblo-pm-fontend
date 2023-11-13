import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';

import {ProjectService} from '../../../../../core/services/project.service';
import {ProjectCommentsService} from '../../../../../core/services/project-comments.service';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-project-comments',
    templateUrl: './project-comments.component.html',
    styleUrls: ['./project-comments.component.scss']
})

export class ProjectCommentsComponent implements OnInit {
    @Input() permissions: any;
    @Input() apiUrl;
    @Input() loginUser: any;
    projectData: any;
    replayComment: any;
    dropzoneObj: any;
    comments: any;
    fileDetails: any;
    isPageLoaded = false;
    projectCommentsForm: FormGroup;
    projectCommentsReplyForm: FormGroup;
    isCommentFormSubmitted = false;
    isReplayFormSubmitted = false;
    parentChild = [];
    selectedFiles = [];
    projectId = this.route.snapshot.params.id;
    customClass = 'comment-collapse';
    oneAtATime: boolean = true;

    @ViewChild('commentdropzone', {static: false}) commentdropzone: ElementRef;

    constructor(
        public translate: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private projectCommentsService: ProjectCommentsService,
        private projectService: ProjectService
    ) {
    }

    get commentControl() {
        return this.projectCommentsForm.controls;
    }

    get replyCommentControl() {
        return this.projectCommentsReplyForm.controls;
    }

    ngOnInit() {
        this.loadForms();
        this.getComment(this.projectId);
        this.loadReplyForm();

        setTimeout(() => {
            this.loadDropzone();
        });
    }

    loadForms() {
        this.projectCommentsForm = this.formBuilder.group({
            project_id: [this.projectId],
            comment: ['', Validators.required],
            files: [null]
        });
    }

    loadReplyForm() {
        this.projectCommentsReplyForm = this.formBuilder.group({
            project_id: [this.projectId],
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

        if (this.projectCommentsForm.invalid) {
            return;
        }

        this.projectCommentsForm.patchValue({files: this.selectedFiles});

        this.projectCommentsService.create(this.projectCommentsForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('comments.messages.create'), this.translate.instant('comments.title'));
            this.dropzoneObj.removeAllFiles();
            this.getComment(this.projectId);
            this.commentFormReset();
            this.loadForms();
        });
    }

    replyFormReset() {
        this.projectCommentsReplyForm.patchValue({replay_comment: ''});
        this.projectCommentsReplyForm.patchValue({files: ''});
        this.projectCommentsReplyForm.patchValue({attachments: ''});
    }

    commentFormReset() {
        this.isCommentFormSubmitted = false;
        this.commentControl.comment.reset();
        this.projectCommentsForm.patchValue({attachments: null});
    }

    showReplayCommentBox(id) {
        $('#comment_replay_' + id).removeClass('d-none');
    }

    getComment(projectID) {
        this.projectService.getById(projectID).subscribe(
            data => {
                this.projectData = data;
                this.projectData.comments = this.getNestedChildren(this.projectData.comments, 0);
                this.comments = this.projectData.comments;
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
        if (this.projectCommentsReplyForm.value.replay_comment) {
            this.isReplayFormSubmitted = true;
            comment.parent_id = comment.id;
            comment.files = '';
            comment.comment = this.projectCommentsReplyForm.value.replay_comment;
            this.projectCommentsReplyForm.patchValue({attachments: ''});

            let replyCommentValues = {
                comment: this.projectCommentsReplyForm.value.replay_comment,
                parent_id: comment.parent_id,
                project_id: comment.project_id,
                user: comment.user,
                user_id: comment.user_id,
                files: '',
                attachments: '',
                replay_comment: this.projectCommentsReplyForm.value.replay_comment
            };

            if (this.projectCommentsReplyForm.invalid) {
                return;
            }
            this.projectCommentsService.create(replyCommentValues)
                .subscribe(
                    resp => {
                        this.toastr.success(this.translate.instant('comments.messages.create'), this.translate.instant('comments.title'));
                        this.getComment(this.projectId);
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
                this.projectCommentsService.delete(commentId)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('comments.messages.delete'), this.translate.instant('projects.title'));
                            this.getComment(this.projectId);
                        });
            }
        });
    }

    saveComments(comment, index, value) {
        comment[index] = value;
        this.projectCommentsService.update(comment).subscribe(data => {
            this.toastr.success(this.translate.instant('comments.messages.update'), this.translate.instant('tasks.title'));
            this.getComment(this.projectId);
        });
    }

}
