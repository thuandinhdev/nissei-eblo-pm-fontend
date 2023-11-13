import {Component, EventEmitter, Input, OnInit, Output, Renderer, ViewChild} from '@angular/core';

@Component({
    selector: 'inline-edit-textarea',
    templateUrl: './inline-edit-textarea.component.html',
    styleUrls: ['./inline-edit-textarea.component.scss']
})

export class InlineEditTextareaComponent implements OnInit {
    public value: any;
    public isEditView: boolean = false;
    public docEditUnlisten: any;
    @Input() name: string;
    @Input() elementFor: string;
    @Input() fieldValue: string;
    @Input() isRequired: boolean;
    @Input() permission: string;
    @Output() updateValue: EventEmitter<any> = new EventEmitter();

    @ViewChild('container', {static: true}) container;

    constructor(private renderer: Renderer) {
    }

    ngOnInit() {
    }

    showEditable() {
        this.value = this.fieldValue;
        this.isEditView = true;

        this.docEditUnlisten = this.renderer.listenGlobal('document', 'click', (event) => {
            if (!this.container.nativeElement.contains(event.target)) {
                this.showDetail();
            }
        });
    }

    save() {
        this.updateValue.emit(this.value);
    }

    showDetail() {
        this.isEditView = false;
    }

}
