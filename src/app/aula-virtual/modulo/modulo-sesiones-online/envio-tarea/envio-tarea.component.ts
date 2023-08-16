import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PEspecificoSesionTareaAlumnoSaveParamsDTO } from 'src/app/Core/Models/PEspecificoEsquema';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';

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
    private _PEspecificoEsquemaService: PEspecificoEsquemaService
  ) { }
    public json:PEspecificoSesionTareaAlumnoSaveParamsDTO={
      file: new File([], ''),
      IdPEspecificoSesion: 0,
      Usuario: '',
      IdMatriculaCabecera:0,
      IdPwPEspecificoSesionTarea:0
    }
    public selectedFiles?: FileList;
    public nombrefile='Ningún archivo seleccionado'
    public filestatus=false
    public fileErrorMsg=''

  public instruccionesSubir=false
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
    console.log(this.data)
    this.json.IdPwPEspecificoSesionTarea=this.data.tarea.id
    this.json.IdPEspecificoSesion=this.data.tarea.idPEspecificoSesion
    this.json.IdMatriculaCabecera=this.data.IdMatriculaCabecera

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
    this._PEspecificoEsquemaService.AgregarPEspecificoSesionTareaAlumno(this.json).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        if (x.type === HttpEventType.UploadProgress) {
          console.log(Math.round((100 * x.loaded) / x.total));
        } else if (x instanceof HttpResponse) {
          this.dialogRef.close('guardado');
        }
      },
      error: (x) => {},
    });
  }
}
