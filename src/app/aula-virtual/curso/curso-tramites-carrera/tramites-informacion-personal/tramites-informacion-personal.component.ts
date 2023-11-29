import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DatosAlumnoValidacionCarreraDTO } from 'src/app/Core/Models/CertificadoDTO';
import { ModalCarrerasComponent } from 'src/app/Core/Shared/Containers/Dialog/modal-carreras/modal-carreras.component';
import { CertificadoService } from 'src/app/Core/Shared/Services/Certificado/certificado.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-tramites-informacion-personal',
  templateUrl: './tramites-informacion-personal.component.html',
  styleUrls: ['./tramites-informacion-personal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TramitesInformacionPersonalComponent implements OnInit ,OnDestroy {
  private signal$ = new Subject();

  public nombrefile=''

  public selectedFiles?: FileList;
  public file:any;
  public filestatus=false
  public fileErrorMsg=''
  constructor(
    private _HelperService:HelperService,
    private _CertificadoService:CertificadoService,
    public dialog: MatDialog,
  ) { }

  @Input() IdMatriculaCabecera=0;

  @Output() Volver= new EventEmitter<number>();
  public OpenNombres=true
  public OpenFoto=false
  public ImgCarrera:any;

  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  public json:DatosAlumnoValidacionCarreraDTO={
    Nombres:'',
    Apellidos:'',
    file:new File([],''),
    IdMatriculaCabecera:0
  }
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x:any) => {
      this.json.Nombres=x.datosAlumno.nombres
      this.json.Apellidos=x.datosAlumno.apellidos
      this.ObtenerImagenAlumno();
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

  InsertarValidacionDatosAlumnoCarrera(){
    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.json.file = file;
      }
    }
    this.json.IdMatriculaCabecera=this.IdMatriculaCabecera
    this._CertificadoService.InsertarValidacionDatosAlumnoCarrera(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
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
        titulo:'¡Tu información personal ha sido actualizada con éxito!' ,
        texto:'Validaremos tu fotografía y actualizaremos el estado de tu tramite en <br> un plazo de 7 días hábiles'},
      panelClass: 'dialog-modal-carrera',
      disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result)
      this.Volver.emit(4)
    });
  }
  ObtenerImagenAlumno(){
    this._CertificadoService.ObtenerImagenAlumno(this.IdMatriculaCabecera).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);
        this.ImgCarrera=x;
      }
    })
  }
}
