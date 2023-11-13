import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-show-custom-field-element',
    templateUrl: './show-custom-field-element.component.html',
    styleUrls: ['./show-custom-field-element.component.scss']
})
export class ShowCustomFieldElementComponent implements OnInit {
    @Input() customFields;
    @Input() formArray;
    @Input() controls: FormArray;
    @Input() formName: FormGroup;
    @Input() isFormSubmitted: boolean;
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    constructor() {
    }

    ngOnInit() {
    }
}
