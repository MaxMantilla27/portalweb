import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Basic, BasicUrl } from 'src/app/Core/Models/BasicDTO';
import { HelperService } from '../../Services/helper.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  constructor(
    private _HelperService: HelperService,
  ) { }
  @Input() data:Array<Basic>=[];
  @Input() dataUrl:Array<BasicUrl>=[];
  @Input() Url:string='';
  @Input() tipo:number=1;
  @Input() color:string='';
  @Input() weigth:string='';
  @Input() background:string='';
  @Input() border:string='';

  @Input() class:string='';
  @Input() img:string='';
  hover : boolean=false;

  @Output()
  OnClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {
  }
  prueba(){
  }

  EventoInteraccionEducacion(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:nombre,Seccion:'Menu cabecera'})
  }

}
