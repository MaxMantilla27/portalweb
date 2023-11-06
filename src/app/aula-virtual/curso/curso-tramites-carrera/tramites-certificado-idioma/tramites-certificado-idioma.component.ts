import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
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
  public url='https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/MatriculaAlumno/Idioma/Prueba.pdf';
  public nombre='Certificado de Ingles.pdf'
  OpenInstrucciones=true
  @Output() Volver= new EventEmitter<number>();
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
    var f=new File([],'')
    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        f = file;
      }
    }
    this._CertificadoService.InsertarCertificadoIdiomaExtranjero(f).pipe(takeUntil(this.signal$)).subscribe({
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

}
