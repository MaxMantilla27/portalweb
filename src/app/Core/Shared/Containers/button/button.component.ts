import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Basic, BasicUrl } from 'src/app/Core/Models/BasicDTO';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  constructor() { }
  @Input() data:Array<Basic>=[];
  @Input() dataUrl:Array<BasicUrl>=[];
  @Input() Url:string='';
  @Input() tipo:number=1;
  @Input() color:string='';
  @Input() background:string='';
  @Input() border:string='';

  @Input() class:string='';
  hover : boolean=false;

  @Output()
  OnClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {
  }
  prueba(){
    console.log(1)
  }


}
