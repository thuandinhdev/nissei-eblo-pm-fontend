import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {UserService} from '../../../../../core/services/user.service';
import {TeamService} from '../../../../../core/services/team.service';

@Component({
    selector: 'app-team-create-modal',
    templateUrl: './team-create-modal.component.html',
    styleUrls: ['./team-create-modal.component.scss']
})

export class TeamCreateModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    createTeamForm: FormGroup;
    isFormSubmitted = false;
    isPageLoaded = false;
    users = [];
    teamLeaders = [];

    constructor(
        public translate: TranslateService,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private userService: UserService,
        private teamService: TeamService
    ) {
    }

    get teamControl() {
        return this.createTeamForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.getUsers();
        this.loadForms();
    }

    getUsers() {
        this.userService.getAll()
            .subscribe(
                data => {
                    this.users = data;
                    this.isPageLoaded = true;
                });
    }

    loadForms() {
        this.createTeamForm = this.formBuilder.group({
            team_name: [null, [Validators.required, Validators.maxLength(30)]],
            members: [null, Validators.required],
            team_leader: [null, Validators.required],
            description: ['']
        });
    }

    teamMemberChange(event: any) {
        this.teamLeaders = event;
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.createTeamForm.invalid) {
            return;
        }

        this.teamService.create(this.createTeamForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('teams.messages.create'), this.translate.instant('teams.title'));
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
