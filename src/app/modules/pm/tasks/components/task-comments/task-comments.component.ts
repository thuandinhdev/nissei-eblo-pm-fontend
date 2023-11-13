import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';

import {TaskService} from '../../../../../core/services/task.service';
import {TaskCommentsService} from '../../../../../core/services/task-comments.service';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-task-comments',
    templateUrl: './task-comments.component.html',
    styleUrls: ['./task-comments.component.scss']
})

export class TaskCommentsComponent implements OnInit {
    @Input() permission: boolean;
    @Input() apiUrl;
    @Input() loginUser: any;
    comments: any;
    taskData: any;
    replayComment: any;
    dropzoneObj: any;
    fileDetails: any;
    isPageLoaded = false;
    taskCommentsForm: FormGroup;
    taskCommentsReplyForm: FormGroup;
    isCommentFormSubmitted = false;
    isReplayFormSubmitted = false;
    parentChild = [];
    selectedFiles = [];
    taskId = this.route.snapshot.params.id;
    customClass = 'comment-collapse';
    oneAtATime: boolean = true;

    @ViewChild('commentdropzone', {static: false}) commentdropzone: ElementRef;

    constructor(
        public translate: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private taskCommentsService: TaskCommentsService,
        private taskService: TaskService
    ) {
    }

    get commentControl() {
        return this.taskCommentsForm.controls;
    }

    get replyCommentControl() {
        return this.taskCommentsReplyForm.controls;
    }

    ngOnInit() {
        this.loadForms();
        this.getComment(this.taskId);
        this.loadReplyForm();

        setTimeout(() => {
            this.loadDropzone();
        });
    }

    loadForms() {
        let that = this;
        this.taskCommentsForm = this.formBuilder.group({
            task_id: [this.taskId],
            comment: ['', Validators.required],
            files: [null]
        });
    }

    loadReplyForm() {
        this.taskCommentsReplyForm = this.formBuilder.group({
            task_id: [this.taskId],
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

        if (this.taskCommentsForm.invalid) {
            return;
        }

        this.taskCommentsForm.patchValue({files: this.selectedFiles});

        this.taskCommentsService.create(this.taskCommentsForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('comments.messages.create'), this.translate.instant('comments.title'));
            this.dropzoneObj.removeAllFiles();
            this.getComment(this.taskId);
            this.commentFormReset();
            this.loadForms();
        });
    }

    replyFormReset() {
        this.taskCommentsReplyForm.patchValue({replay_comment: ''});
        this.taskCommentsReplyForm.patchValue({files: ''});
        this.taskCommentsReplyForm.patchValue({attachments: ''});
    }

    commentFormReset() {
        this.isCommentFormSubmitted = false;
        this.commentControl.comment.reset();
        this.taskCommentsForm.patchValue({attachments: null});
    }

    showReplayCommentBox(id) {
        $('#comment_replay_' + id).removeClass('d-none');
    }

    getComment(taskID) {
        this.taskService.getById(taskID).subscribe(
            data => {
                this.taskData = data;
                this.taskData.comments = this.getNestedChildren(this.taskData.comments, 0);
                this.comments = this.taskData.comments;
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
        if (this.taskCommentsReplyForm.value.replay_comment) {
            this.isReplayFormSubmitted = true;
            comment.parent_id = comment.id;
            comment.files = '';
            comment.comment = this.taskCommentsReplyForm.value.replay_comment;
            this.taskCommentsReplyForm.patchValue({attachments: ''});
            let replyCommentValues = {
                comment: this.taskCommentsReplyForm.value.replay_comment,
                parent_id: comment.parent_id,
                task_id: comment.task_id,
                user: comment.user,
                user_id: comment.user_id,
                files: '',
                attachments: '',
                replay_comment: this.taskCommentsReplyForm.value.replay_comment
            };

            if (this.taskCommentsReplyForm.invalid) {
                return;
            }
            this.taskCommentsService.create(replyCommentValues)
                .subscribe(
                    resp => {
                        this.toastr.success(this.translate.instant('comments.messages.create'), this.translate.instant('comments.title'));
                        this.getComment(this.taskId);
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
                this.taskCommentsService.delete(commentId)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('comments.messages.delete'), this.translate.instant('tasks.title'));
                            this.getComment(this.taskId);
                        });
            }
        });
    }

    saveComments(comment, index, value) {
        comment[index] = value;
        this.taskCommentsService.update(comment).subscribe(data => {
            this.toastr.success(this.translate.instant('comments.messages.update'), this.translate.instant('tasks.title'));
            this.getComment(this.taskId);
        });
    }

}
