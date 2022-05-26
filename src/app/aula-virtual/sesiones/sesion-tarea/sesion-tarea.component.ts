import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { ModelTareaEvaluacionTareaDTO, ParametroObtenerEvaluacionTarea } from 'src/app/Core/Models/TareaEvaluacionDTO';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { TareaEvaluacionService } from 'src/app/Core/Shared/Services/TareaEvaluacion/tarea-evaluacion.service';

@Component({
  selector: 'app-sesion-tarea',
  templateUrl: './sesion-tarea.component.html',
  styleUrls: ['./sesion-tarea.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SesionTareaComponent implements OnInit,OnChanges {

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
  public params:ParametroObtenerEvaluacionTarea={
    idEvaluacion:0,
    idPEspecifico:0,
    idPEspecificoPadre:0,
    idPGeneral:0,
    idPrincipal:0,
  }
  @Input() charge:boolean|undefined=false;
  public file:any;
  public filestatus=false
  public fileErrorMsg=''
  public tarea:any
  public instruccionesAcerca=false;
  public instruccionesSubir=false
  public sendFile:ModelTareaEvaluacionTareaDTO={
    idEsquemaEvaluacionPGeneralDetalle:0,
    idEsquemaEvaluacionPGeneralDetalle_Anterior:0,
    idEvaluacion:0,
    idPEspecificoHijo:0,
    idPEspecificoPadre:0,
    idPGeneral:0,
    idPrincipal:0,
    idTipoEvaluacionTrabajo:0,
    file:new File([],'')
  }
  public progress=0
  public selectedFiles?: FileList;
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.idtarea>0 && this.charge==true){
      this.params.idEvaluacion=this.idtarea;
      this.params.idPEspecifico=this.json.IdPEspecificoHijo
      this.params.idPEspecificoPadre=this.json.IdPEspecificoPadre
      this.params.idPGeneral=this.json.IdPGeneralHijo
      this.params.idPrincipal=this.json.IdPGeneralPadre
      this.ObtenerEvaluacionTarea()
    }
  }
  ObtenerEvaluacionTarea(){
    this._TareaEvaluacionService.ObtenerEvaluacionTarea(this.params).subscribe({
      next:x=>{
        this.tarea=x
        if(this.tarea.datosEvaluacionTrabajo!=undefined && this.tarea.datosEvaluacionTrabajo.instruccionesEvaluacion!=undefined &&
          this.tarea.datosEvaluacionTrabajo!=null && this.tarea.datosEvaluacionTrabajo.instruccionesEvaluacion!=null)
        this.tarea.datosEvaluacionTrabajo.instruccionesEvaluacion.sort(function (a:any, b:any) {
          return a.zonaWeb - b.zonaWeb;
        })
        console.log(this.tarea)
      }
    })
  }
  maxValue(array:Array<any>){
    return Math.max(...array.map(o => o.valor))
  }
  minValue(array:Array<any>){
    return Math.min(...array.map(o => o.valor))
  }
  getFileDetails(event:any) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.filestatus=true
      var name = event.target.files[i].name;
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
  setData(){
    this.sendFile.idEsquemaEvaluacionPGeneralDetalle=this.tarea.criteriosEvaluacion.idEsquemaEvaluacionPGeneralDetalle
    this.sendFile.idEsquemaEvaluacionPGeneralDetalle_Anterior=this.tarea.criteriosEvaluacion.idEsquemaEvaluacionPGeneralDetalle_Anterior
    this.sendFile.idEvaluacion=this.idtarea
    this.sendFile.idPEspecificoHijo=this.json.IdPEspecificoHijo
    this.sendFile.idPEspecificoPadre=this.json.IdPEspecificoPadre
    this.sendFile.idPGeneral=this.json.IdPGeneralHijo
    this.sendFile.idPrincipal=this.json.IdPGeneralPadre
    this.sendFile.idTipoEvaluacionTrabajo=1
    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.sendFile.file = file;
      }
    }
  }
  EnviarFile(){
    if(this.tarea.registroEvaluacionArchivo.length>=3){
      this._SnackBarServiceService.openSnackBar("Solo tiene 3 intentos para subir su tarea.",'x',15,"snackbarCrucigramaerror");
    }else{
      this.setData()
      console.log(this.sendFile)
      this._TareaEvaluacionService.EnviarEvaluacionTarea(this.sendFile).subscribe({
        next:x=>{
          if (x.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * x.loaded / x.total);
            console.log(this.progress)
          } else if (x instanceof HttpResponse) {
            this.progress=0;
            if(x.body==true){
              this.ObtenerEvaluacionTarea()
            }else{
              this._SnackBarServiceService.openSnackBar("Solo tiene 3 intentos para subir su tarea.",'x',15,"snackbarCrucigramaerror");
            }
          }
        },
        error:x=>{
          this.progress=0;

        }
      })
    }
  }
}
