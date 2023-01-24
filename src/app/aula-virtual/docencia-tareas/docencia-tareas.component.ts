import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ParametroNotaRegistrarV3DTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { ParametroEnvioTrabajoPares, ParametroObtenerEvaluacionTarea } from 'src/app/Core/Models/TareaEvaluacionDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
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
  private signal$ = new Subject();
  constructor(
    private _TareaEvaluacionService:TareaEvaluacionService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _TrabajoDeParesIntegraService:TrabajoDeParesIntegraService,
    private _ActivatedRoute:ActivatedRoute,
    private _OperacionesNotaService:OperacionesNotaService,
    private _HelperService: HelperService,
  ) { }

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
    Retroalimentacion:'',
    file:new File([],'')
  }
  public IdTarea=0;
  public tareas:any
  public datosTarea:any
  public tareaAc:any;
  public calificacion=0;
  public cargaEnvio=false;
  public usuario=''
  public instruccionesAcerca=false;
  public instruccionesSubir=false
  public nota:Array<ParametroNotaRegistrarV3DTO>=[]
  // {
  //   Id:0,
  //   IdPespecifico:0,
  //   Grupo:0,
  //   IdMatriculaCabecera:0,
  //   IdEsquemaEvaluacionPGeneralDetalle:0,
  //   IdParametroEvaluacion:0,
  //   IdEscalaCalificacionDetalle:0,
  //   PortalTareaEvaluacionTareaId:0,
  //   EsProyectoAnterior:false,
  //   IdProyectoAplicacionEnvioAnterior:0,
  //   NombreArchivoRetroalimentacion:'',
  //   UrlArchivoSubidoRetroalimentacion:'',
  // }
  public retroalimentacion=''
  public retroalimentacionFile:File=new File([],'')
  public IdMatriculaCabecera=0
  public EsProyectoAnterior=false
  public Grupo=1
  public IdProyectoAplicacionEnvioAnterior=0
  public nombrefile='Ningún archivo seleccionado'
  public filestatus=false
  public fileErrorMsg=''
  public selectedFiles?: FileList;
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
        this.IdMatriculaCabecera=x.idMatriculaCabecera
        this.EsProyectoAnterior=x.esProyectoAnterior
        this.Grupo=x.grupo
        this.IdProyectoAplicacionEnvioAnterior=x.idProyectoAplicacionEnvioAnterior
        this.usuario=x.usuario;

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

    this.enviarJson.Retroalimentacion=this.retroalimentacion
    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.enviarJson.file = file;
      }
    }
    console.log(this.enviarJson);
    this._TareaEvaluacionService.EnviarCalificacionTrabajoPares(this.enviarJson).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.ObtenerEvaluacionTarea()
        this.cargaEnvio=false
      },
      error:x=>{
        console.log(x)
        this.cargaEnvio=false
      }
    })
  }

  getFileDetails(event:any) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.filestatus=true
      var name = event.target.files[i].name;
      this.nombrefile=name;
      var type = event.target.files[i].type;
      var size = event.target.files[i].size;
      var modifiedDate = event.target.files[i].lastModifiedDate;
      var extencion=name.split('.')[name.split('.').length-1]
      if( Math.round((size/1024)/1024)>150){
        this.fileErrorMsg='El tamaño del archivo no debe superar los 25 MB'
        this.filestatus=false
      }
      this.selectedFiles = event.target.files;
      // console.log ('Name: ' + name + "\n" +
      //   'Type: ' + extencion + "\n" +
      //   'Last-Modified-Date: ' + modifiedDate + "\n" +
      //   'Size: ' + Math.round((size/1024)/1024) + " MB");
    }
  }
  RegistrarV3(index:number){
    var tareasDetalle=this.tareaAc[index];
    console.log(tareasDetalle)
    var n:ParametroNotaRegistrarV3DTO={
        Id:0,
        IdPespecifico:this.tareas.criteriosEvaluacion.idPEspecifico,
        Grupo:this.Grupo,
        IdMatriculaCabecera:this.IdMatriculaCabecera,
        IdEsquemaEvaluacionPGeneralDetalle:this.tareas.criteriosEvaluacion.idEsquemaEvaluacionPGeneralDetalle_Anterior,
        IdParametroEvaluacion:this.tareas.criteriosEvaluacion.idParametroEvaluacion,
        IdEscalaCalificacionDetalle:this.calificacion,
        PortalTareaEvaluacionTareaId:tareasDetalle.id,
        EsProyectoAnterior:this.EsProyectoAnterior,
        IdProyectoAplicacionEnvioAnterior:this.IdProyectoAplicacionEnvioAnterior==null?0:this.IdProyectoAplicacionEnvioAnterior,
        NombreArchivoRetroalimentacion:'',
        UrlArchivoSubidoRetroalimentacion:'',
      }

    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.retroalimentacionFile = file;
      }
    }
    this.nota.push(n)
    this._OperacionesNotaService.RegistrarV3(this.nota,this.tareas.criteriosEvaluacion.idPEspecifico,this.usuario,this.retroalimentacion,this.retroalimentacionFile,this.IdTarea).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.ObtenerEvaluacionTarea()
      },
      error:x=>{
        console.log(x)
      }
    })
  }

  maxValue(array:Array<any>){
    return Math.max(...array.map(o => o.valor))
  }
  minValue(array:Array<any>){
    return Math.min(...array.map(o => o.valor))
  }
}
