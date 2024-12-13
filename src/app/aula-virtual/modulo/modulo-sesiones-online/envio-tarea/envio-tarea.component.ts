import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PEspecificoSesionTareaAlumnoSaveParamsDTO } from 'src/app/Core/Models/PEspecificoEsquema';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { ModalEnvioTareaComponent } from './modal-envio-tarea/modal-envio-tarea.component';
import * as moment from 'moment';

@Component({
  selector: 'app-envio-tarea',
  templateUrl: './envio-tarea.component.html',
  styleUrls: ['./envio-tarea.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EnvioTareaComponent implements OnInit ,OnDestroy {
  private signal$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<EnvioTareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,
    private _SnackBarServiceService:SnackBarServiceService,
    public dialog: MatDialog,

  ) { }
    public json:PEspecificoSesionTareaAlumnoSaveParamsDTO={
      file: new File([], ''),
      IdPEspecificoSesion: 0,
      Usuario: '',
      IdMatriculaCabecera:0,
      IdPwPEspecificoSesionTarea:0,
      // FechaEnvio:''
    }
    public selectedFiles?: FileList;
    public nombrefile='Ningún archivo seleccionado'
    public filestatus=false
    public fileErrorMsg=''

  public instruccionesSubir=false
  public ActualizaTareaEnviada=true
  public CalificacionActual=0
  public EnvioFechaSecundaria=false
  public BotonEnvioActivo=true
  public ZonaHorariaOrigenWebex: any;
  public CodigoIsoPaisWebex = 'PE';
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
    console.log(this.data)
    this.EnvioFechaSecundaria=false
    this.CalificacionActual=this.data.tarea.calificacionActual
    if(this.data.tarea.calificacionActual!=this.data.tarea.calificacionMaxima){
      this.EnvioFechaSecundaria=true
    }
    this.json.IdPwPEspecificoSesionTarea=this.data.tarea.id
    this.json.IdPEspecificoSesion=this.data.tarea.idPEspecificoSesion
    this.json.IdMatriculaCabecera=this.data.IdMatriculaCabecera
    if(this.data.tarea.tareas!=null && this.data.tarea.tareas.length>0){
      this.VerificarEnvioTarea()
    }

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
  AgregarPEspecificoSesionTareaAlumno(){

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.json.file = file;
      }
    }
    this.BotonEnvioActivo=false;
    this.ObtenerDatosZonaHoraria();
    let HoraWebexOriginal = moment.tz(new Date(), this.ZonaHorariaOrigenWebex);
    // this.json.FechaEnvio=HoraWebexOriginal.format('YYYY-MM-DDTHH:mm:ss.SSS');
    // console.log(this.json)
    this._PEspecificoEsquemaService.AgregarPEspecificoSesionTareaAlumno(this.json).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        if (x.type === HttpEventType.UploadProgress) {
          console.log(Math.round((100 * x.loaded) / x.total));
        } else if (x instanceof HttpResponse) {

          if(x.body!=1){
            if(x.body==0){
              this._SnackBarServiceService.openSnackBar("Ya paso la fecha de entrega de la tarea",'x',5,"snackbarCrucigramaerror");
            }else{
              if(x.body==3){
                this._SnackBarServiceService.openSnackBar("Ya supero el numero maximo de intentos",'x',15,"snackbarCrucigramaerror");
              }else{
                this._SnackBarServiceService.openSnackBar("Ocurrio un error al subir el Archivo.",'x',15,"snackbarCrucigramaerror");
              }
            }
          }
          this.dialogRef.close('guardado');
        }
      },
      error: (x) => {},
      complete:()=>{
        this.BotonEnvioActivo=true;
      }
    });
  }
  VerificarEnvioTarea(){
    console.log(this.data.tarea)
    this.data.tarea.tareas.forEach((x:any) => {
      console.log(x)
      this.ActualizaTareaEnviada=true
      if(x.nota!=null)
      {
        this.ActualizaTareaEnviada=false
      }
      else{
        this.nombrefile=x.nombreArchivo
      }
    });
    console.log(this.ActualizaTareaEnviada)
  }


  AbrirConfirmacionActualizar(){
    if(this.EnvioFechaSecundaria==false){
      this.AgregarPEspecificoSesionTareaAlumno()
    }
    else{
      const dialogRef = this.dialog.open(ModalEnvioTareaComponent, {
        width: '450px',
        data: {Puntos:this.CalificacionActual},
        panelClass: 'dialog-envio-tarea-actualizar-alumno',
       disableClose:true
      });

      dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
        console.log(result)
        if(result){
          this.AgregarPEspecificoSesionTareaAlumno()
        }
      });
    }
  }
  ObtenerDatosZonaHoraria() {
    this.CodigoIsoPaisWebex=this.data.CodigoIsoPaisWebex;
    this.ZonaHorariaOrigenWebex = moment.tz.zonesForCountry(this.CodigoIsoPaisWebex);
    this.ZonaHorariaOrigenWebex = this.ZonaHorariaOrigenWebex[0];
    console.log('ZonaHorariaOrigenWebex',this.ZonaHorariaOrigenWebex)
  }
}
