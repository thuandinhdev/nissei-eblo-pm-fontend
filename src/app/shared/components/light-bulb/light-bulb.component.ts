import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'light-bulb',
  templateUrl: './light-bulb.component.html',
  styleUrls: ['./light-bulb.component.scss']
})
export class LightBulbComponent implements OnInit {
  public onClose: Subject<boolean>;
  @Input() value:any;
  constructor(
    public bsModalRef: BsModalRef,
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
  }
  onCancel() {
    
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
