import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-miga-pan',
  templateUrl: './miga-pan.component.html',
  styleUrls: ['./miga-pan.component.scss']
})
export class MigaPanComponent implements OnInit {

  public tipo: any

  @Input()
  items: any
  constructor() { }

  @Output()
  OnClicked: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void {

    this.tipo = 'secondary'
  }

}
