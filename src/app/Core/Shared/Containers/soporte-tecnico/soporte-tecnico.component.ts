import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ChatDetalleIntegraService } from '../../Services/ChatDetalleIntegra/chat-detalle-integra.service';
import { HelperService } from '../../Services/helper.service';
@Component({
  selector: 'app-soporte-tecnico',
  templateUrl: './soporte-tecnico.component.html',
  styleUrls: ['./soporte-tecnico.component.scss']
})
export class SoporteTecnicoComponent implements OnInit,OnChanges {

  constructor(
    private _HelperService: HelperService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
  }
  @Input() cargaChat=false
  @Input() Open=false
  @Input() token=false
  @Input() IdPGeneral=0
  @Input() texto='Soporte Técnico'
  @Output()
  IsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  ngOnInit(): void {

  }
  EventoInteraccionButton(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:"Button",Nombre:nombre})
  }
}
