
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Subject, takeUntil } from 'rxjs';
import { ChatDetalleIntegraService } from '../Core/Shared/Services/ChatDetalleIntegra/chat-detalle-integra.service';
import { HelperService } from '../Core/Shared/Services/helper.service';
import { SessionStorageService } from '../Core/Shared/Services/session-storage.service';
import { datosAlumnoDTO } from '../Core/Models/AlumnoDTO';

@Component({
  selector: 'app-aula-virtual',
  templateUrl: './aula-virtual.component.html',
  styleUrls: ['./aula-virtual.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AulaVirtualComponent implements OnInit {

  constructor(
  ) {

  }
  public charge=false
  public step=-1;
  public CodigoIso=''
  public OpenChat=false;
  public cargaChat=false;
  ngOnInit(): void {

  }
  chatcharge(estado:boolean){
    console.log('------------'+estado)
    this.cargaChat=estado
  }
}
