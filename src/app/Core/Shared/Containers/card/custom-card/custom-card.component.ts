import { Component, Input, OnInit } from '@angular/core';
import { HelperService } from '../../../Services/helper.service';

@Component({
  selector: 'app-custom-card',
  templateUrl: './custom-card.component.html',
  styleUrls: ['./custom-card.component.scss']
})
export class CustomCardComponent implements OnInit {

  @Input()
  item: any = {}
  @Input()
  confs: any = {}
  @Input() Interaccion=''
  constructor(
    private _HelperService :HelperService,
  ) { }

  ngOnInit(): void {
  }

  EventoInteraccion(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:'Descubre más >',Programa:nombre,Seccion:this.Interaccion})
  }
}
