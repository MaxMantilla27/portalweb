import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-indicaciones-content',
  templateUrl: './indicaciones-content.component.html',
  styleUrls: ['./indicaciones-content.component.scss']
})
export class IndicacionesContentComponent implements OnInit {

  constructor() { }
  @Input() title=''
  @Input() imgUrl=''
  @Output() ButtoclClick: EventEmitter<void> = new EventEmitter<void>();
  ngOnInit(): void {
  }

}
