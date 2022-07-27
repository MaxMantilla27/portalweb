import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ParametroEnvioTrabajoPares, ParametroObtenerEvaluacionTarea } from 'src/app/Core/Models/TareaEvaluacionDTO';
import { OperacionesNotaService } from 'src/app/Core/Shared/Services/OperacionesNota/operaciones-nota.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { TareaEvaluacionService } from 'src/app/Core/Shared/Services/TareaEvaluacion/tarea-evaluacion.service';
import { TrabajoDeParesIntegraService } from 'src/app/Core/Shared/Services/TrabajoDeParesIntegra/trabajo-de-pares-integra.service';

@Component({
  selector: 'app-docencia-tareas',
  templateUrl: './docencia-tareas.component.html',
  styleUrls: ['./docencia-tareas.component.scss']
})
export class DocenciaTareasComponent implements OnInit,OnDestroy {

  constructor(
    private _TareaEvaluacionService:TareaEvaluacionService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _TrabajoDeParesIntegraService:TrabajoDeParesIntegraService,
    private _ActivatedRoute:ActivatedRoute,
    private _OperacionesNotaService:OperacionesNotaService
  ) { }
  private signal$ = new Subject();

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  public migaPan = [
    {
      titulo: 'Docencia',
      urlWeb: '/AulaVirtual/Docencia',
    },
  ];
  public params:ParametroObtenerEvaluacionTarea={
    id:0,
    idEvaluacion:0,
    idPEspecifico:0,
    idPEspecificoPadre:0,
    idPGeneral:0,
    idPrincipal:0,
  }
  public enviarJson:ParametroEnvioTrabajoPares={
    IdEscalaCalificacionDetalle:0,
    IdEsquemaEvaluacionPGeneralDetalle:0,
    IdEvaluacion:0,
    IdParametroEvaluacion:0,
    ValorCalificado:0,
  }
  public IdTarea=0;
  public tareas:any
  public datosTarea:any
  public tareaAc:any;
  public calificacion=0;
  public cargaEnvio=false;
  ngOnInit(): void {

    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.IdTarea = x['IdTarea'];
        this.ObtenerTrabajoParesPorId()
      },
    });
  }

  ObtenerEvaluacionTarea(){
    this._TareaEvaluacionService.ObtenerEvaluacionTrabajoPares(this.params).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.tareas=x
        console.log(this.tareas)
        if( this.tareas.registroTareaEvaluacionArchivo!=null){
          this.tareaAc=this.tareas.registroTareaEvaluacionArchivo
        }
        console.log(this.tareaAc)
        this.migaPan.push(
          {
            titulo: x.datosTrabajoPares.nombre,
            urlWeb: '/AulaVirtual/Docencia',
          },
        )
      }
    })
  }
  ObtenerTrabajoParesPorId(){
    this._TrabajoDeParesIntegraService.ObtenerTrabajoParesPorId(this.IdTarea).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x.id>0){
          this.datosTarea=x;
          this.params.id=this.IdTarea
          this.params.idEvaluacion=x.idEvaluacion
          this.params.idPEspecifico=x.idPEspecificoHijo
          this.params.idPEspecificoPadre=x.idPEspecificoPadre
          this.params.idPGeneral=x.idPGeneralHijo
          this.params.idPrincipal=x.idPGeneralPadre
          this.ObtenerEvaluacionTarea();
        }else{
          this.ListadoActividadesCalificablesDocentePorCurso();
        }
      }
    })
  }
  ListadoActividadesCalificablesDocentePorCurso(){
    this._TrabajoDeParesIntegraService.ListadoActividadesCalificablesDocentePorCurso(this.IdTarea).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.datosTarea=x;
        this.params.id=this.IdTarea
        this.params.idEvaluacion=x.idEvaluacion
        this.params.idPEspecifico=x.idPEspecificoHijo
        this.params.idPEspecificoPadre=x.idPEspecificoPadre
        this.params.idPGeneral=x.idPGeneralHijo
        this.params.idPrincipal=x.idPGeneralPadre
        this.ObtenerEvaluacionTarea();
      }
    })
  }

  EnviarNota(id:number){
    this.cargaEnvio=true
    var cal=0;
    console.log(this.calificacion)
    this.tareas.criteriosEvaluacion.listaParametroEscalaEvaluacion.forEach((p:any) => {
      if(p.id==this.calificacion){
        cal=p.valor
      }
    });
    this.enviarJson.IdEscalaCalificacionDetalle=this.calificacion
    this.enviarJson.IdEvaluacion=id
    this.enviarJson.ValorCalificado=cal
    this.enviarJson.IdParametroEvaluacion=this.tareas.criteriosEvaluacion.idParametroEvaluacion
    this.enviarJson.IdEsquemaEvaluacionPGeneralDetalle=this.tareas.criteriosEvaluacion.idEsquemaEvaluacionPGeneralDetalle
    console.log(this.enviarJson);
    this._TareaEvaluacionService.EnviarCalificacionTrabajoPares(this.enviarJson).subscribe({
      next:x=>{
        console.log(x)
        this.ObtenerEvaluacionTarea()
      },
      error:x=>{
        console.log(x)
      }
    })
  }
}
