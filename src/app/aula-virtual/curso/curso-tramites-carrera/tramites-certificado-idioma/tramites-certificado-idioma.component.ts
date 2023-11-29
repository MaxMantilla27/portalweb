import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DatosCertificadoIdiomaAlumnoValidacionCarreraDTO } from 'src/app/Core/Models/CertificadoDTO';
import { ModalCarrerasComponent } from 'src/app/Core/Shared/Containers/Dialog/modal-carreras/modal-carreras.component';
import { CertificadoService } from 'src/app/Core/Shared/Services/Certificado/certificado.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-tramites-certificado-idioma',
  templateUrl: './tramites-certificado-idioma.component.html',
  styleUrls: ['./tramites-certificado-idioma.component.scss']
})
export class TramitesCertificadoIdiomaComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }


  public selectedFiles?: FileList;
  public file:any;
  public filestatus=false
  public fileErrorMsg=''
  public nombrefile=''
  constructor(
    private _HelperService:HelperService,
    private _CertificadoService:CertificadoService,
    public dialog: MatDialog,
  ) { }
  public url='';
  public nombre=''
  OpenInstrucciones=true
  @Input() IdMatriculaCabecera=0;
  @Output() Volver= new EventEmitter<number>();
  public CertificadoIdioma:any;
  public json:DatosCertificadoIdiomaAlumnoValidacionCarreraDTO={
    file:new File([],''),
    IdMatriculaCabecera:0
  }
  ngOnInit(): void {
    this.ObtenerCertificadoIdiomaAlumno()
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

  InsertarCertificadoIdiomaExtranjero(){
    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.json.file = file;
      }
    }
    this.json.IdMatriculaCabecera=this.IdMatriculaCabecera
    this._CertificadoService.InsertarCertificadoIdiomaAlumnoCarrera(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if (x.type === HttpEventType.UploadProgress) {
          console.log(Math.round(100 * x.loaded / x.total))
        } else if (x instanceof HttpResponse) {
          console.log(x)
          this.OpenRespuesta();
        }
      },
      error:x=>{
      }
    })
  }
  OpenRespuesta(){
    const dialogRef = this.dialog.open(ModalCarrerasComponent, {
      width: '800px',
      data: {
        titulo:'¡Tu certificado se ha subido con éxito!' ,
        texto:'validaremos tu documentos y actualizaremos el estado de tu tramite en <br> un plazo de 7 días hábiles'},
      panelClass: 'dialog-modal-carrera',
      disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result)
      this.Volver.emit(0)
    });
  }
  ObtenerCertificadoIdiomaAlumno(){
    this._CertificadoService.ObtenerCertificadoIdiomaAlumno(this.IdMatriculaCabecera).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);
        this.CertificadoIdioma=x;
      }
    })
  }

}
