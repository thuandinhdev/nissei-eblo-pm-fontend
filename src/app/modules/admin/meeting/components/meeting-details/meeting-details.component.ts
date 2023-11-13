import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';

import {MeetingService} from '../../../../../core/services/meeting.service';

import {meeting_status_key_value} from '../../../../../core/helpers/admin.helper';

@Component({
    selector: 'app-meeting-details',
    templateUrl: './meeting-details.component.html',
    styleUrls: ['./meeting-details.component.scss']
})

export class MeetingDetailsComponent implements OnInit {
    @Input() meeting;
    @Input() loginUser: any;
    @Input() apiUrl;
    @Input() permission;
    meetingstatusKeyValue = meeting_status_key_value;

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private meetingService: MeetingService
    ) {
    }

    ngOnInit() {
    }

    getTranslateStatus(statusKey) {
        return this.meetingstatusKeyValue[statusKey];
    }

    changeMeetingStatus(meetingIDs: any, status: any) {
        let params = {
            ids: meetingIDs,
            status: status.id
        };
        this.meetingService.changeStatus(params).subscribe(data => {
            this.toastr.success(this.translate.instant('meetings.messages.status'), this.translate.instant('meetings.title'));
        });
    }

}
