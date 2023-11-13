import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';

import {IncidentService} from '../../../../../core/services/incident.service';
import {IncidentCommentService} from '../../../../../core/services/incident-comment.service';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-incident-comments',
    templateUrl: './incident-comments.component.html',
    styleUrls: ['./incident-comments.component.scss']
})

export class IncidentCommentsComponent implements OnInit {
    @Input() permission;
    @Input() apiUrl;
    @Input() loginUser: any;
    incidentCommentsForm: FormGroup;
    incidentCommentsReplyForm: FormGroup;
    comments: any;
    incidentData: any;
    replayComment: any;
    dropzoneObj: any;
    fileDetails: any;
    isPageLoaded = false;
    isCommentFormSubmitted = false;
    isReplayFormSubmitted = false;
    parentChild = [];
    selectedFiles = [];
    incidentId = this.route.snapshot.params.id;
    customClass = 'comment-collapse';
    oneAtATime: boolean = true;

    @ViewChild('commentdropzone', {static: false}) commentdropzone: ElementRef;

    constructor(
        public translate: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private incidentCommentsService: IncidentCommentService,
        private incidentService: IncidentService
    ) {
    }

    get commentControl() {
        return this.incidentCommentsForm.controls;
    }

    get replyCommentControl() {
        return this.incidentCommentsReplyForm.controls;
    }

    ngOnInit() {
        this.loadForms();
        this.getComment(this.incidentId);
        this.loadReplyForm();

        setTimeout(() => {
            this.loadDropzone();
        });
    }

    loadForms() {
        let that = this;
        this.incidentCommentsForm = this.formBuilder.group({
            incident_id: [this.incidentId],
            comment: ['', Validators.required],
            files: [null]
        });
    }

    loadReplyForm() {
        this.incidentCommentsReplyForm = this.formBuilder.group({
            incident_id: [this.incidentId],
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

        this.incidentCommentsForm.patchValue({files: this.selectedFiles});

        if (this.incidentCommentsForm.invalid) {
            return;
        }

        this.incidentCommentsService.create(this.incidentCommentsForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('comments.messages.create'), this.translate.instant('comments.title'));
            this.dropzoneObj.removeAllFiles();
            this.getComment(this.incidentId);
            this.commentFormReset();
            this.loadForms();
        });
    }

    replyFormReset() {
        this.incidentCommentsReplyForm.patchValue({replay_comment: ''});
        this.incidentCommentsReplyForm.patchValue({files: ''});
        this.incidentCommentsReplyForm.patchValue({attachments: ''});
    }

    commentFormReset() {
        this.isCommentFormSubmitted = false;
        this.commentControl.comment.reset();
        this.incidentCommentsForm.patchValue({attachments: null});
    }

    showReplayCommentBox(id) {
        $('#comment_replay_' + id).removeClass('d-none');
    }

    getComment(incidentId) {
        this.incidentService.getById(incidentId).subscribe(
            data => {
                this.incidentData = data;
                this.incidentData.comments = this.getNestedChildren(this.incidentData.comments, 0);
                this.comments = this.incidentData.comments;
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
        if (this.incidentCommentsReplyForm.value.replay_comment) {
            this.isReplayFormSubmitted = true;
            comment.parent_id = comment.id;
            comment.files = '';
            comment.comment = this.incidentCommentsReplyForm.value.replay_comment;
            this.incidentCommentsReplyForm.patchValue({attachments: ''});
            let replyCommentValues = {
                comment: this.incidentCommentsReplyForm.value.replay_comment,
                parent_id: comment.parent_id,
                incident_id: comment.incident_id,
                user: comment.user,
                user_id: comment.user_id,
                files: '',
                attachments: '',
                replay_comment: this.incidentCommentsReplyForm.value.replay_comment
            };

            if (this.incidentCommentsReplyForm.invalid) {
                return;
            }

            this.incidentCommentsService.create(replyCommentValues)
                .subscribe(
                    resp => {
                        this.toastr.success(this.translate.instant('comments.messages.create'), this.translate.instant('comments.title'));
                        this.getComment(this.incidentId);
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
                this.incidentCommentsService.delete(commentId)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('comments.messages.delete'), this.translate.instant('incidents.title'));
                            this.getComment(this.incidentId);
                        });
            }
        });
    }

    saveComments(comment, index, value) {
        comment[index] = value;
        this.incidentCommentsService.update(comment).subscribe(data => {
            this.toastr.success(this.translate.instant('comments.messages.update'), this.translate.instant('tasks.title'));
            this.getComment(this.incidentId);
        });
    }

}
