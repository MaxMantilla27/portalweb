import { Component, Inject, OnDestroy, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ParametroNotaRegistrarV3DTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { ParametroEnvioTrabajoPares, ParametroObtenerEvaluacionTarea } from 'src/app/Core/Models/TareaEvaluacionDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { OperacionesNotaService } from 'src/app/Core/Shared/Services/OperacionesNota/operaciones-nota.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { TareaEvaluacionService } from 'src/app/Core/Shared/Services/TareaEvaluacion/tarea-evaluacion.service';
import { TrabajoDeParesIntegraService } from 'src/app/Core/Shared/Services/TrabajoDeParesIntegra/trabajo-de-pares-integra.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DevolverProyectoComponent } from 'src/app/aula-virtual/docencia-tareas/devolver-proyecto/devolver-proyecto.component';
import { DocenciaCalificarProyectoAplicacionComponent } from '../docencia-calificar-proyecto-aplicacion/docencia-calificar-proyecto-aplicacion.component';

@Component({
  selector: 'app-docencia-calificar-proyecto-aplicacion-modal',
  templateUrl: './docencia-calificar-proyecto-aplicacion-modal.component.html',
  styleUrls: ['./docencia-calificar-proyecto-aplicacion-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class DocenciaCalificarProyectoAplicacionModalComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _TareaEvaluacionService:TareaEvaluacionService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _TrabajoDeParesIntegraService:TrabajoDeParesIntegraService,
    private _ActivatedRoute:ActivatedRoute,
    private _OperacionesNotaService:OperacionesNotaService,
    private _HelperService: HelperService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DocenciaCalificarProyectoAplicacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
  public TerminaCarga=false
  ngOnInit(): void {
    this.TerminaCarga=false;
    this.IdTarea = this.data.idTarea
    this.ObtenerProyectoAplicacionPorId()
  }

  ObtenerProyectoAplicacionPorId(){
    this._TrabajoDeParesIntegraService.ObtenerTrabajoParesPorId(this.IdTarea).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        if(x.id>0){
          this.datosTarea=x;
          this.params.id=this.IdTarea
          this.params.idEvaluacion=x.idEvaluacion
          this.params.idPEspecifico=x.idPEspecificoPadre
          this.params.idPEspecificoPadre=x.idPEspecificoHijo
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
  ObtenerEvaluacionTarea(){
    this._TareaEvaluacionService.ObtenerEvaluacionTrabajoPares(this.params).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.TerminaCarga=true;
        this.tareas=x
        if( this.tareas.registroTareaEvaluacionArchivo!=null){
          this.tareaAc=this.tareas.registroTareaEvaluacionArchivo
        }
        this.migaPan.push(
          {
            titulo: x.datosTrabajoPares.nombre,
            urlWeb: '/AulaVirtual/Docencia',
          },
        )
      }
    })
  }
  DevolverTarea(item:any){
    const dialogRef = this.dialog.open(DevolverProyectoComponent, {
      width: '600px',
      data: item,
      panelClass: 'dialog-devolucion-proyecto',
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      if(result!=undefined){
        this.ListadoActividadesCalificablesDocentePorCurso()
      }
    });
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
    }
  }

  EnviarCalificacionProyectoEvaluacion(index:number){
    this.cargaEnvio=true
    var tareasDetalle=this.tareaAc[index];
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
        Retroalimentacion:this.retroalimentacion

      }

    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.retroalimentacionFile = file;
      }
    }
    n.file=this.retroalimentacionFile
    this.nota.push(n)
    this._TareaEvaluacionService.EnviarCalificacionProyectoEvaluacion(n).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.cargaEnvio=false
        this.ObtenerEvaluacionTarea()
      },
      error:x=>{
        this.cargaEnvio=false
        this._SnackBarServiceService.openSnackBar("Ocurrio un error, por favor vuelva a recargar en unos momentos",'x',15,"snackbarCrucigramaerror");
      },
      complete:()=>{
        this.dialogRef.close(true);
      }
    })
  }

  ActualizarCalificacionProyectoEvaluacion(index:number){
    this.cargaEnvio=true
    var tareasDetalle=this.tareaAc[index];
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
        Retroalimentacion:this.retroalimentacion

      }

    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.retroalimentacionFile = file;
      }
    }
    n.file=this.retroalimentacionFile
    this.nota.push(n)
    this._TareaEvaluacionService.ActualizarCalificacionProyectoEvaluacion(n).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.cargaEnvio=false
        this.ObtenerEvaluacionTarea()
      },
      error:x=>{
        this.cargaEnvio=false
        this._SnackBarServiceService.openSnackBar("Ocurrio un error, por favor vuelva a recargar en unos momentos",'x',15,"snackbarCrucigramaerror");
      },
      complete:()=>{
        this.CerrarModal();
      }

    })
  }
  maxValue(array:Array<any>){
    return Math.max(...array.map(o => o.valor))
  }
  minValue(array:Array<any>){
    return Math.min(...array.map(o => o.valor))
  }
  CerrarModal(){
    this.dialogRef.close();
  }
}

