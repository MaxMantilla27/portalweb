import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-default-button',
  templateUrl: './default-button.component.html',
  styleUrls: ['./default-button.component.scss']
})
export class DefaultButtonComponent implements OnInit {
  @Input() confs: any = {}
  @Input() ruta: any
  @Input() style: string=""
  @Input() disabled: boolean=false
  @Input() icon: string='keyboard_arrow_right'
  @Output()
  ButtoclClick: EventEmitter<void> = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {

  }

}
