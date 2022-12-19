import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-default-button-flecha',
  templateUrl: './default-button-flecha.component.html',
  styleUrls: ['./default-button-flecha.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class DefaultButtonFlechaComponent implements OnInit {

  @Input() confs: any = {}
  @Input() ruta: any
  @Input() style: string=""
  @Input() disabled: boolean=false
  @Input() icon: string='play_arrow'
  @Input() img: string=""
  @Output()
  ButtoclClick: EventEmitter<void> = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {

  }

}
