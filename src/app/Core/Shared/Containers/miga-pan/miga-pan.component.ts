import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HelperService } from '../../Services/helper.service';

@Component({
  selector: 'app-miga-pan',
  templateUrl: './miga-pan.component.html',
  styleUrls: ['./miga-pan.component.scss']
})
export class MigaPanComponent implements OnInit {

  public tipo: any

  @Input()
  items: any
  constructor(
    private _HelperService: HelperService,
    ) { }

  @Output()
  OnClicked: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void {

    this.tipo = 'secondary'
  }

  EventoInteraccionEducacion(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:nombre,Seccion:'Breadcrumb'})
  }
}
