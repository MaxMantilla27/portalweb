import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {  Subject, takeUntil } from 'rxjs';
import { OfertaLaboralService } from 'src/app/Core/Shared/Services/OfertaLaboral/oferta-laboral.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { MisPostulacionesComponent } from '../mis-postulaciones/mis-postulaciones.component';


@Component({
  selector: 'oferta-laboral',
  templateUrl: './oferta-laboral.component.html',
  styleUrls: ['./oferta-laboral.component.scss']
})
export class OfertaLaboralComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _OfertaLaboralService:OfertaLaboralService,
    private _HelperService:HelperService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _router:Router,
  ) { }
  listaConvocatorias:any[]=[]
  dataAlumno:any
  dataTemp :any=null

  @Output()
  MisPostulaciones = new EventEmitter<number>();
  @Output()
  Actualizar = new EventEmitter<void>();


  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  ngOnInit(): void {
    this.ObtenerConvocatoriasVigentes()
  }

  ObtenerConvocatoriasVigentes(){
    this._OfertaLaboralService.ObtenerConvocatoriasVigentes().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        x.forEach((e:any)=>{
          e.fechaFin = new Date(e.fechaFin)
          e.fechaInicio = new Date(e.fechaInicio)
          e.isSelect=false
        })
        this.listaConvocatorias=x
        if(this.listaConvocatorias.length>0){
          this.listaConvocatorias[0].isSelect=true
          this.mostrarConvocatoria(this.listaConvocatorias[0])
        }
      }
    })
  }

  ObtenerDatosAlumno(){
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.dataAlumno = x.datosAlumno
    })
  }

  mostrarConvocatoria(data:any){
    data.isSelect=true
    this.listaConvocatorias.forEach((e:any)=>{
      if(e.id!=data.id) e.isSelect=false
    })
    this.dataTemp=data
  }

  postular()
  {
    this._OfertaLaboralService.ValidarPostulacion(this.dataTemp.id).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        if(x==true){
          this._OfertaLaboralService.RegistrarPostulacionAlumno(this.dataTemp.id).pipe(takeUntil(this.signal$)).subscribe({
          next:x=>{
              if(x==true){
                this._SnackBarServiceService.openSnackBar(
                  "Has completado exitosamente tu postulación a esta oferta laboral.!",
                  'x',
                  10,
                  "snackbarCrucigramaSucces");
                  this.Actualizar.emit()
                  this.dataTemp.isPostulado=true;
              }else
              {
                this._SnackBarServiceService.openSnackBar(
                  "Se produjo un error al intentar postular a esta oferta laboral.!",
                  'x',
                  10,
                  "snackbarCrucigramaerror");
              }
          }
        })
        }
        else{
          this._SnackBarServiceService.openSnackBar(
            "Has postulado previamente a esta oferta laboral.!",
            'x',
            10,
            "snackbarCrucigramaerror");
        }
        
      }
    })
  }

  redireccionarAMisPostulaciones(){
    this.MisPostulaciones.emit(this.dataTemp.id)
  }
}

