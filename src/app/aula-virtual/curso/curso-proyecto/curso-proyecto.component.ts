import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { ModelTareaEvaluacionTareaDTO, ParametroObtenerEvaluacionTarea } from 'src/app/Core/Models/TareaEvaluacionDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { TareaEvaluacionService } from 'src/app/Core/Shared/Services/TareaEvaluacion/tarea-evaluacion.service';

@Component({
  selector: 'app-curso-proyecto',
  templateUrl: './curso-proyecto.component.html',
  styleUrls: ['./curso-proyecto.component.scss'],
})
export class CursoProyectoComponent implements OnInit,OnChanges {
  constructor(
    private _TareaEvaluacionService: TareaEvaluacionService,
    private _SnackBarServiceService: SnackBarServiceService,
    private _HelperService:HelperService
  ) {}
  @Input() idProyecto:any;
  @Input() idPGeneral=0;;
  @Input() idPEspecifico=0;
  @Input() curso:any;
  public proyecto:any
  public params: ParametroObtenerEvaluacionTarea = {
    id:0,
    idEvaluacion: 0,
    idPEspecifico: 0,
    idPEspecificoPadre: 0,
    idPGeneral: 0,
    idPrincipal: 0,
  };
  public miPerfil:any
  public progress=0
  public selectedFiles?: FileList;
  public file:any;
  public filestatus=false
  public fileErrorMsg=''
  public instruccionesAcerca=false;
  public instruccionesSubir=false
  public nombrefile='Ningún archivo seleccionado'
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
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.subscribe((x) => {
      this.miPerfil=x
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.idProyecto!=undefined){
      this.params.idEvaluacion=this.idProyecto;
      this.params.idPEspecifico=this.idPEspecifico
      this.params.idPEspecificoPadre=this.idPEspecifico
      this.params.idPGeneral=this.idPGeneral
      this.params.idPrincipal=this.idPGeneral
      this.ObtenerEvaluacionProyectoAplicacion();
    }
  }

  maxValue(array:Array<any>){
    return Math.max(...array.map(o => o.valor))
  }
  minValue(array:Array<any>){
    return Math.min(...array.map(o => o.valor))
  }
  ObtenerEvaluacionProyectoAplicacion(){
    this._TareaEvaluacionService.ObtenerEvaluacionProyectoAplicacion(this.params).subscribe({
      next:x=>{
        console.log(x)
        this.proyecto=x
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
    this.sendFile.idEsquemaEvaluacionPGeneralDetalle=this.proyecto.criteriosEvaluacion.idEsquemaEvaluacionPGeneralDetalle
    this.sendFile.idEsquemaEvaluacionPGeneralDetalle_Anterior=this.proyecto.criteriosEvaluacion.idEsquemaEvaluacionPGeneralDetalle_Anterior
    this.sendFile.idEvaluacion=this.idProyecto
    this.sendFile.idPEspecificoHijo=this.idPEspecifico
    this.sendFile.idPEspecificoPadre=this.idPEspecifico
    this.sendFile.idPGeneral=this.idPGeneral
    this.sendFile.idPrincipal=this.idPGeneral
    this.sendFile.idTipoEvaluacionTrabajo=2
    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.sendFile.file = file;
      }
    }
  }
  EnviarFile(){
    if(this.filestatus){
      if(this.proyecto.registroEvaluacionArchivo.length>=2){
        this._SnackBarServiceService.openSnackBar("Solo tiene 2 intentos para subir su proyecto.",'x',15,"snackbarCrucigramaerror");
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
                this.ObtenerEvaluacionProyectoAplicacion()
              }else{
                this._SnackBarServiceService.openSnackBar("Solo tiene 2 intentos para subir su proyecto.",'x',15,"snackbarCrucigramaerror");
              }
            }
          },
          error:x=>{
            this.progress=0;

          }
        })
      }
    }else{
      this._SnackBarServiceService.openSnackBar("Ningun archivo seleccionado.",'x',15,"snackbarCrucigramaerror");
    }
  }
}
