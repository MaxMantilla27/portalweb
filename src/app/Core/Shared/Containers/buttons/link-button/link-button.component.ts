import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-link-button',
  templateUrl: './link-button.component.html',
  styleUrls: ['./link-button.component.scss']
})
export class LinkButtonComponent implements OnInit {

  @Input()
  item: any
  @Input()
  tipo: any
  @Input ()
  fontColor: any
  @Input ()
  fontStyle: any
  @Input ()
  fontSize: any
  @Input ()
  link: boolean = true


  @Output()
  onCliked: EventEmitter<null> = new EventEmitter<null>();

  constructor() { }

  ngOnInit(): void {
  }

}