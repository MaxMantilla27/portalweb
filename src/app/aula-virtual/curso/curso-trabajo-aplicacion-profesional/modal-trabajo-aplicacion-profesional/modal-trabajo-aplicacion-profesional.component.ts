import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit,Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject,takeUntil } from 'rxjs';
import { DatosProyectoAplicacionProfesionalCarreraDTO } from 'src/app/Core/Models/CertificadoDTO';
import { DialogModel } from 'src/app/Core/Models/Dialog';
import { TareaEvaluacionService } from 'src/app/Core/Shared/Services/TareaEvaluacion/tarea-evaluacion.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-modal-trabajo-aplicacion-profesional',
  templateUrl: './modal-trabajo-aplicacion-profesional.component.html',
  styleUrls: ['./modal-trabajo-aplicacion-profesional.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalTrabajoAplicacionProfesionalComponent implements OnInit {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  constructor(
    public dialogRef: MatDialogRef<ModalTrabajoAplicacionProfesionalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel,
    private _HelperService:HelperService,
    private _TareaEvaluacionService:TareaEvaluacionService,


  ) { }
  public instruccionesSubir=false
  public selectedFiles?: FileList;
  public nombrefile='Ningún archivo seleccionado'
  public filestatus=false
  public fileErrorMsg=''
  public ProyectoEnviado=false;
  public ProyectoAplicacionProfesional:any;
  public json:DatosProyectoAplicacionProfesionalCarreraDTO={
    file:new File([],''),
    IdRegistro:0
  }
  ngOnInit(): void {
    this.ProyectoEnviado=false
    console.log(this.data)
    this.ProyectoAplicacionProfesional=this.data;
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
  SubirTrabajoAplicacionProfesional(){
    this.ProyectoEnviado=true;
    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.json.file = file;
      }
    }
    this.json.IdRegistro=this.ProyectoAplicacionProfesional.id
    this._TareaEvaluacionService.InsertarProyectoAplicacionProfesionalCarrera(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if (x.type === HttpEventType.UploadProgress) {
          console.log(Math.round(100 * x.loaded / x.total))
        } else if (x instanceof HttpResponse) {
          console.log(x)
        }
      },
      error:x=>{
      }
    })
  }
  RedirigirCalificaciones(){
    this.dialogRef.close()
    this._HelperService.enviarActivarTrabajoTipoExamenCarrera(2)
  }

}
