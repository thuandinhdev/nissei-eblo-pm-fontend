import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {UserService} from '../../../../../core/services/user.service';
import {TeamService} from '../../../../../core/services/team.service';

import {Team} from '../../../../../shared/models/team.model';

@Component({
    selector: 'app-team-edit-modal',
    templateUrl: './team-edit-modal.component.html',
    styleUrls: ['./team-edit-modal.component.scss']
})

export class TeamEditModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    editTeamForm: FormGroup;
    team: Team;
    isFormSubmitted = false;
    isPageLoaded = false;
    users = [];
    teamLeaders = [];
    members = [];

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
        return this.editTeamForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.getUsers();
    }

    getUsers() {
        this.userService.getAll()
            .subscribe(
                data => {
                    this.users = data;
                    this.loadForms();
                });
    }

    loadForms() {
        for (let iRow in this.team.members) {
            this.members.push(this.team.members[iRow].id);
        }

        this.teamLeaders = this.team.members;
        this.editTeamForm = this.formBuilder.group({
            id: [this.team.id],
            team_name: [this.team.team_name, [Validators.required, Validators.maxLength(30)]],
            members: [this.members, Validators.required],
            team_leader: [this.team.team_leader, Validators.required],
            description: [this.team.description]
        });
        this.isPageLoaded = true;
    }

    teamMemberChange(event: any) {
        this.editTeamForm.patchValue({team_leader: null});
        this.teamLeaders = event;
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editTeamForm.invalid) {
            return;
        }

        // // --
        // this.toastr.error(this.translate.instant('common.not_allowed'));
        // this.onCancel();
        // return;

        this.teamService.update(this.editTeamForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('teams.messages.update'), this.translate.instant('teams.title'));
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
