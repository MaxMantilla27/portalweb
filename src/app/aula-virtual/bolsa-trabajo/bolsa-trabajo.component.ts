import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import {  Subject, takeUntil } from 'rxjs';
import { OfertaLaboralService } from 'src/app/Core/Shared/Services/OfertaLaboral/oferta-laboral.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { MisPostulacionesComponent } from './mis-postulaciones/mis-postulaciones.component';
import { distinctUntilChanged } from 'rxjs/operators';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import {MatChipsModule} from '@angular/material/chips';


@Component({
  selector: 'app-bolsa-trabajo',
  templateUrl: './bolsa-trabajo.component.html',
  styleUrls: ['./bolsa-trabajo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BolsaTrabajoComponent implements OnInit ,OnDestroy{
  private signal$ = new Subject();
  constructor(
    private _OfertaLaboralService:OfertaLaboralService,
    private _HelperService:HelperService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _router:Router,
    private _SessionStorageService:SessionStorageService
  ) { }

  @ViewChild(MisPostulacionesComponent) MisPostulaciones!: MisPostulacionesComponent;

  public migaPan = [
    {
      titulo: 'Bolsa de Trabajo',
      urlWeb: '/AulaVirtual/BolsaTrabajo',
    },
  ];

  public nombrefile='Ningún archivo seleccionado'
  public filestatus=false
  public selectedFiles?: FileList;
  public file:any;
  public fileErrorMsg=""
  loaderGeneral=false
  public hide=true
  public tabIndex = 0;

  public JsonCV:{nombreArchivo:string, urlArchivo:string, } = {nombreArchivo:"",urlArchivo:"",}

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  ngOnInit(): void {
    this.JsonCV= {nombreArchivo:"",urlArchivo:"",}
    this.ObtenerCVAlumno()
  }

  cambioIsButom(event:any){
    this.MisPostulaciones.BuscarDataSeleccionada(event)
    this.tabIndex=1
  }

  ActualizarMisPostulaciones(){
    this.MisPostulaciones.BuscarDataSeleccionada(0) 
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
      if (type !== 'application/pdf') {
        this.fileErrorMsg = 'Solo se permiten archivos PDF';
        this.filestatus = false;
      }
      this.selectedFiles = event.target.files;
    }
  }

  EnviarFile(){
    if(this.filestatus){
      if(this.selectedFiles){
        const file: File | null = this.selectedFiles.item(0);
        if (file) {
          this.loaderGeneral=true
          this._OfertaLaboralService.ActualizarCVAlumno(file).pipe(takeUntil(this.signal$)).subscribe({
            next:x=>{
              if(x.body){
                this.loaderGeneral=false
                if(x.body.nombreArchivo!=null && x.body.nombreArchivo!="") this.nombrefile = x.body.nombreArchivo
                this.JsonCV.urlArchivo= x.body.urlArchivo

                this._SnackBarServiceService.openSnackBar(
                  "El archivo se ha subido correctamente.!",
                  'x',
                  10,
                  "snackbarCrucigramaSucces");
              }
              
            },
            error:e=>{
              this.loaderGeneral=false
              this._SnackBarServiceService.openSnackBar("Ocurrio un error al subir el Archivo.",'x',15,"snackbarCrucigramaerror");
            }
          })
        }
      }
    }else{
      this._SnackBarServiceService.openSnackBar("Ningún archivo seleccionado.",'x',15,"snackbarCrucigramaerror");
    }
  }


  ObtenerCVAlumno(){
    this._OfertaLaboralService.ObtenerCVAlumno().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        if(x.nombreArchivo!=null && x.nombreArchivo!="") this.nombrefile = x.nombreArchivo
        this.JsonCV.urlArchivo= x.urlArchivo
      }
    })
  }

}
