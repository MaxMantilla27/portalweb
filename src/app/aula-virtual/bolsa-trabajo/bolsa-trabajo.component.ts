import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import {  Subject, takeUntil } from 'rxjs';
import { OfertaLaboralService } from 'src/app/Core/Shared/Services/OfertaLaboral/oferta-laboral.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { MisPostulacionesComponent } from './mis-postulaciones/mis-postulaciones.component';
import { distinctUntilChanged } from 'rxjs/operators';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-bolsa-trabajo',
  templateUrl: './bolsa-trabajo.component.html',
  styleUrls: ['./bolsa-trabajo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BolsaTrabajoComponent implements OnInit {
  constructor(
    private _OfertaLaboralService:OfertaLaboralService,
    private _HelperService:HelperService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _router:Router,
    private _SessionStorageService:SessionStorageService
  ) { }

  @ViewChild(MisPostulacionesComponent) MisPostulaciones!: MisPostulacionesComponent;

  public migaPan = [
    {
      titulo: 'Bolsa de Trabajo',
      urlWeb: '/AulaVirtual/BolsaTrabajo',
    },
  ];

  public hide=true
  public tabIndex = 0;


  ngOnInit(): void {
    console.log('TipoCarrera',this._SessionStorageService.SessionGetValue('TipoCarrera'))
  }
  
  cambioIsButom(event:any){
    this.MisPostulaciones.BuscarDataSeleccionada(event)
    this.tabIndex=1
  }

  ActualizarMisPostulaciones(){
    this.MisPostulaciones.BuscarDataSeleccionada(0) 
  }
}
