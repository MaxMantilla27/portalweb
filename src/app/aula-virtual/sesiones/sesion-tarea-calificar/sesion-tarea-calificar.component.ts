import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { ParametroEnvioCriterioReflexivo, ParametroEnvioTrabajoPares, ParametroObtenerEvaluacionTarea } from 'src/app/Core/Models/TareaEvaluacionDTO';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { TareaEvaluacionService } from 'src/app/Core/Shared/Services/TareaEvaluacion/tarea-evaluacion.service';

@Component({
  selector: 'app-sesion-tarea-calificar',
  templateUrl: './sesion-tarea-calificar.component.html',
  styleUrls: ['./sesion-tarea-calificar.component.scss']
})
export class SesionTareaCalificarComponent implements OnInit,OnChanges,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _TareaEvaluacionService:TareaEvaluacionService,
    private _SnackBarServiceService:SnackBarServiceService,
  ) { }
  @Input() json: ParametrosEstructuraEspecificaDTO = {
    AccesoPrueba: false,
    IdMatriculaCabecera: 0,
    IdPEspecificoPadre: 0,
    IdPGeneralPadre: 0,
    IdPEspecificoHijo: 0,
    IdPGeneralHijo: 0,
    NombreCapitulo: '',
    NombrePrograma: '',
    idModalidad:1
  };
  @Input() idtarea=0;
  @Input() NombreCapitulo=''
  @Input() idCapitulo=0;
  @Input() id=0;
  @Input() habilitado=false;

  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() prev: EventEmitter<void> = new EventEmitter<void>();
  @Output() onFinish: EventEmitter<void> = new EventEmitter<void>();
  public retroalimentacion=''
  public retroalimentacionFile:File=new File([],'')
  public nombrefile='Ningún archivo seleccionado'
  public filestatus=false
  public fileErrorMsg=''
  public selectedFiles?: FileList;
  public params:ParametroObtenerEvaluacionTarea={
    id:0,
    idEvaluacion:0,
    idPEspecifico:0,
    idPEspecificoPadre:0,
    idPGeneral:0,
    idPrincipal:0,
  }
  @Input() charge:boolean|undefined=false;
  public enviarJson:ParametroEnvioTrabajoPares={
    IdEscalaCalificacionDetalle:0,
    IdEsquemaEvaluacionPGeneralDetalle:0,
    IdEvaluacion:0,
    IdParametroEvaluacion:0,
    ValorCalificado:0,
    Retroalimentacion:'',
    file:new File([],'')
  }
  public tarea:any
  public tareaAc:any;
  public cargaEnvio=false;
  public calificacion=0;
  public paramsAr:ParametroEnvioCriterioReflexivo={
    IdEvaluacion:0,
    IdPEspecifico:0,
    IdPGeneral:0,
    IdUsuario:'',
    IdTareaEvaluacionTarea:0,
    Registros:[]
  }
  public envioAr=true;
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
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
        this.fileErrorMsg='El tamaño del archivo no debe superar los 150 MB'
        this.filestatus=false
      }
      this.selectedFiles = event.target.files;
      // console.log ('Name: ' + name + "\n" +
      //   'Type: ' + extencion + "\n" +
      //   'Last-Modified-Date: ' + modifiedDate + "\n" +
      //   'Size: ' + Math.round((size/1024)/1024) + " MB");
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.idtarea>0 && this.charge==true && this.habilitado==true){
      console.log(this.id)
      this.params.id=this.id;
      this.params.idEvaluacion=this.idtarea;
      this.params.idPEspecifico=this.json.IdPEspecificoHijo
      this.params.idPEspecificoPadre=this.json.IdPEspecificoPadre
      this.params.idPGeneral=this.json.IdPGeneralHijo
      this.params.idPrincipal=this.json.IdPGeneralPadre
      this.ObtenerEvaluacionTarea()
    }
  }
  ObtenerEvaluacionTarea(){
    this._TareaEvaluacionService.ObtenerEvaluacionTrabajoPares(this.params).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.tarea=x
        if(this.tarea.datosTrabajoPares!=undefined && this.tarea.datosTrabajoPares.instruccionesEvaluacion!=undefined &&
          this.tarea.datosTrabajoPares!=null && this.tarea.datosTrabajoPares.instruccionesEvaluacion!=null)
        this.tarea.datosTrabajoPares.instruccionesEvaluacion.sort(function (a:any, b:any) {
          return a.zonaWeb - b.zonaWeb;
        })
        console.log(this.tarea)
        if( this.tarea.registroTareaEvaluacionArchivo!=null){
          this.tarea.registroTareaEvaluacionArchivo.forEach((t:any) => {
            if(t.id==this.id){
              this.tareaAc=t
            }
          });
        }
        if(this.tarea.criteriosEvaluacionReflexivo!=undefined && this.tarea.criteriosEvaluacionReflexivo.length>0){
          this.envioAr=true
          this.tarea.criteriosEvaluacionReflexivo.forEach((c:any) => {
            c.calificacion=0;
            if(c.idParametroEvaluacionNota==null || c.idParametroEvaluacionNota==undefined || c.idParametroEvaluacionNota==0){
              this.envioAr=false
            }
          });
        }
        console.log(this.envioAr)
        console.log(this.tareaAc)
      }
    })
  }
  EnviarNota(){
    this.cargaEnvio=true
    var cal=0;
    console.log(this.calificacion)
    this.tarea.criteriosEvaluacion.listaParametroEscalaEvaluacion.forEach((p:any) => {
      if(p.id==this.calificacion){
        cal=p.valor
      }
    });
    this.enviarJson.IdEscalaCalificacionDetalle=this.calificacion
    this.enviarJson.IdEvaluacion=this.tareaAc.id
    this.enviarJson.ValorCalificado=cal
    this.enviarJson.IdParametroEvaluacion=this.tarea.criteriosEvaluacion.idParametroEvaluacion
    this.enviarJson.IdEsquemaEvaluacionPGeneralDetalle=this.tarea.criteriosEvaluacion.idEsquemaEvaluacionPGeneralDetalle
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
        this.tareaAc.calificado=true
        if(this.envioAr){
          this.onFinish.emit()
        }
        this.cargaEnvio=false
      },
      error:x=>{
        console.log(x)
        this.cargaEnvio=false
      },
      complete:()=>{
        this.cargaEnvio=false
      }
    })

  }
  nextc(){
    console.log(this.tareaAc)
    if(this.tareaAc!=undefined && this.tareaAc.calificado==true){
      this.next.emit();
    }
  }
  prevc(){
    this.prev.emit();
  }
  ValidarCriterioReflexivo(){
    for (let i = 0; i < this.tarea.criteriosEvaluacionReflexivo.length; i++) {
      if(this.tarea.criteriosEvaluacionReflexivo[i].calificacion==null || this.tarea.criteriosEvaluacionReflexivo[i].calificacion<=0){
        return false
      }
    }
    return true;
  }
  EnviarCriterioReflexivo(){
    if(this.cargaEnvio==false){
      console.log(this.ValidarCriterioReflexivo());
      this.cargaEnvio=true
      if(this.ValidarCriterioReflexivo()){
        this.paramsAr.IdPEspecifico=this.json.IdPEspecificoHijo
        this.paramsAr.IdTareaEvaluacionTarea=this.tareaAc.id
        this.tarea.criteriosEvaluacionReflexivo.forEach((x:any) => {
          this.paramsAr.Registros.push({
            IdEscalaCalificacionDetalle:x.calificacion,
            IdEsquemaEvaluacionPGeneralDetalle:x.idEsquemaEvaluacionPGeneralDetalle_Anterior,
            IdEsquemaEvaluacionPGeneralDetalleCongelado:x.idEsquemaEvaluacionPGeneralDetalle,
            IdParametroEvaluacion:x.idParametroEvaluacion
          })
        });
        this._TareaEvaluacionService.EnviarCriterioReflexivo(this.paramsAr).pipe(takeUntil(this.signal$)).subscribe({
          next:x=>{
            console.log(x)
            this.cargaEnvio=false
            if(x==true){
              this.envioAr=true
              this._SnackBarServiceService.openSnackBar("Tus respuestas se enviaron correctamente",'x',15,"snackbarCrucigramaSucces");
              this.onFinish.emit()
            }
          },
          error:e=>{
            this.cargaEnvio=false
          },
          complete:()=>{
            this.cargaEnvio=false
          }
        })
      }else{
        this._SnackBarServiceService.openSnackBar("Debe completar todas las preguntas",'x',15,"snackbarCrucigramaerror");
      }
    }
  }
}
