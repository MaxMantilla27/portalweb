import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import {  Subject, takeUntil } from 'rxjs';
import { OfertaLaboralService } from 'src/app/Core/Shared/Services/OfertaLaboral/oferta-laboral.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { MisPostulacionesComponent } from './mis-postulaciones/mis-postulaciones.component';

@Component({
  selector: 'app-bolsa-trabajo',
  templateUrl: './bolsa-trabajo.component.html',
  styleUrls: ['./bolsa-trabajo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BolsaTrabajoComponent implements OnInit {
  private signal$ = new Subject();
  constructor(
    private _OfertaLaboralService:OfertaLaboralService,
    private _HelperService:HelperService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _router:Router,
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
  }

  irAmisPostulaciones(IdConvocatoria:number){
    this.MisPostulaciones.BuscarDataSeleccionada(IdConvocatoria)
    this.tabIndex=1
  }
}
