import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

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
  @Output() HoverIn: EventEmitter<void> = new EventEmitter<void>();
  @Output() HoverOut: EventEmitter<void> = new EventEmitter<void>();
  public hover=false
  ngOnInit(): void {
  }
}
