import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { ModelTareaEvaluacionTareaDTO, ParametroObtenerEvaluacionTarea } from 'src/app/Core/Models/TareaEvaluacionDTO';
import { EliminarComponent } from 'src/app/Core/Shared/Containers/Dialog/eliminar/eliminar.component';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { TareaEvaluacionService } from 'src/app/Core/Shared/Services/TareaEvaluacion/tarea-evaluacion.service';
import { RetroalimentacionTareaComponent } from './retroalimentacion-tarea/retroalimentacion-tarea.component';

@Component({
  selector: 'app-sesion-tarea',
  templateUrl: './sesion-tarea.component.html',
  styleUrls: ['./sesion-tarea.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SesionTareaComponent implements OnInit,OnChanges,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _TareaEvaluacionService:TareaEvaluacionService,
    private _SnackBarServiceService:SnackBarServiceService,
    public dialog: MatDialog,
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
  @Input() habilitado=false;

  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() prev: EventEmitter<void> = new EventEmitter<void>();
  @Output() onFinish: EventEmitter<void> = new EventEmitter<void>();
  public params:ParametroObtenerEvaluacionTarea={
    id:0,
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
  public progress=0
  public selectedFiles?: FileList;
  public subir=false;
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.idtarea>0 && this.charge==true && this.habilitado==true){
      this.params.idEvaluacion=this.idtarea;
      this.params.idPEspecifico=this.json.IdPEspecificoHijo
      this.params.idPEspecificoPadre=this.json.IdPEspecificoPadre
      this.params.idPGeneral=this.json.IdPGeneralHijo
      this.params.idPrincipal=this.json.IdPGeneralPadre
      this.ObtenerEvaluacionTarea()
    }
  }
  ObtenerEvaluacionTarea(){
    this._TareaEvaluacionService.ObtenerEvaluacionTarea(this.params).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.tarea=x
        if(this.tarea.datosEvaluacionTrabajo!=undefined && this.tarea.datosEvaluacionTrabajo.instruccionesEvaluacion!=undefined &&
          this.tarea.datosEvaluacionTrabajo!=null && this.tarea.datosEvaluacionTrabajo.instruccionesEvaluacion!=null)
        this.tarea.datosEvaluacionTrabajo.instruccionesEvaluacion.sort(function (a:any, b:any) {
          return a.zonaWeb - b.zonaWeb;
        })

        console.log(this.tarea)
        if(this.tarea.registroEvaluacionArchivo==null || this.tarea.registroEvaluacionArchivo.length==0){
          this.subir=true
        }else{
          this.tarea.registroEvaluacionArchivo.forEach((r:any) => {
            if(r.calificado==true){
              if(r.nota>6){
                this.subir=false
              }else{
                this.subir=true
              }
            }else{
              this.subir=false
            }
          });
        }
        console.log(this.subir);
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
    if(this.filestatus){
      if(this.tarea.registroEvaluacionArchivo!=null && this.tarea.registroEvaluacionArchivo.length>=2 ){
        this._SnackBarServiceService.openSnackBar("Solo tiene 2 intentos para subir su tarea.",'x',15,"snackbarCrucigramaerror");
      }else{
        this.setData()
        console.log(this.sendFile)
        this._TareaEvaluacionService.EnviarEvaluacionTarea(this.sendFile).pipe(takeUntil(this.signal$)).subscribe({
          next:x=>{
            if (x.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * x.loaded / x.total);
              console.log(this.progress)
            } else if (x instanceof HttpResponse) {
              this.progress=0;
              this.onFinish.emit()
              this.filestatus=false;
              this.nombrefile=''
              if(x.body==true){
                this.ObtenerEvaluacionTarea()
                //this._SnackBarServiceService.openSnackBar(x.body.mensaje,'x',20,"snackbarCrucigramaSucces");
              }else{
                if(x.body==false){
                  this._SnackBarServiceService.openSnackBar("Solo tiene 3 intentos para subir su tarea.",'x',15,"snackbarCrucigramaerror");
                }else{
                  if(x.body.estado==true){
                    this.ObtenerEvaluacionTarea()
                    this._SnackBarServiceService.openSnackBar(x.body.mensaje,'x',20,"snackbarCrucigramaSucces");
                  }else{
                    this._SnackBarServiceService.openSnackBar(x.body.mensaje,'x',20,"snackbarCrucigramaerror");
                  }
                }
              }
            }
          },
          error:x=>{
            this.progress=0;

          }
        })
      }
    }else{
      this._SnackBarServiceService.openSnackBar("Ningún archivo seleccionado.",'x',15,"snackbarCrucigramaerror");
    }
  }
  nextc(){
    if(this.tarea!=undefined && this.tarea.registroEvaluacionArchivo.length>0){

      this.next.emit();
    }
  }
  prevc(){
    this.prev.emit();
  }
  OpenModalDelete(tarea:any){
    const dialogRef = this.dialog.open(EliminarComponent, {
      width: '550px',
      data: {
        titulo:'¿Está seguro de eliminar la tarea registrada?',
        sub:'¡No podrás revertir esta acción!'},
      panelClass: 'custom-dialog-eliminar',
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe(result => {
      if(result==true){
        this.DeleteTarea(tarea)
      }
    });


  }
  DeleteTarea(tarea:any){
    console.log(tarea)
    this._TareaEvaluacionService.DeleteEvaluacionTareaEvaluacionTarea(tarea.id).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x.estado==true){
          this.ObtenerEvaluacionTarea()
          this._SnackBarServiceService.openSnackBar(x.mensaje,'x',20,"snackbarCrucigramaSucces");
        }else{
          this._SnackBarServiceService.openSnackBar(x.mensaje,'x',20,"snackbarCrucigramaerror");
        }
      }
    })
  }
  mensajeError(){
    console.log('------')
    this._SnackBarServiceService.openSnackBar('Aún no puedes subir otra versión de la tarea, comunícate con tu asistente de atención al cliente.','x',
    1000,'snackbarCrucigramaerror')
  }
  OpenModalR(index:number){
    this.tarea.registroEvaluacionArchivo[index]
    const dialogRef =this.dialog.open(RetroalimentacionTareaComponent,{
      panelClass:'dialog-retro-tarea',
      data: this.tarea.registroEvaluacionArchivo[index],
    });
  }
}
