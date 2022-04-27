import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-default-button',
  templateUrl: './default-button.component.html',
  styleUrls: ['./default-button.component.scss']
})
export class DefaultButtonComponent implements OnInit {
  @Input() confs: any = {}
  @Input() ruta: any

  constructor() { }

  ngOnInit(): void {
    
  }

}
