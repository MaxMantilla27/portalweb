import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { Subject, takeUntil } from 'rxjs';
import { AsistenciaRegistrarDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { AsistenciaService } from 'src/app/Core/Shared/Services/Asistencia/asistencia.service';
import { OperacionesAsistenciaService } from 'src/app/Core/Shared/Services/OperacionesAsistencia/operaciones-asistencia.service';
import { OperacionesNotaService } from 'src/app/Core/Shared/Services/OperacionesNota/operaciones-nota.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-registrar-asistencia-online',
  templateUrl: './registrar-asistencia-online.component.html',
  styleUrls: ['./registrar-asistencia-online.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegistrarAsistenciaOnlineComponent implements OnInit, OnDestroy {
  private signal$ = new Subject();

  columnHeader = {
    index: 'N°',
    codigoMatricula: 'Código',
    alumno: 'Nombres y Apellidos',
    asistio: 'Asistencia',
  };

  TipoContenido: any = {
    //'Acciones': ['buttons'],
  };
  tableInfo: any;

  constructor(
    public dialogRef: MatDialogRef<RegistrarAsistenciaOnlineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _OperacionesNotaService: OperacionesNotaService,
    public _OperacionesAsistenciaService: OperacionesAsistenciaService,
    private r: ActivatedRoute,
    private _SnackBarServiceService: SnackBarServiceService,
    private _AsistenciaService: AsistenciaService,

  ) {}

  public asistencias: Array<AsistenciaRegistrarDTO> = [];

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public Asistencias: any;
  public listadoAsistencias: any;

  public charge = false;
  public activarGuardado = false;

  ngOnInit(): void {
    console.log(this.data)
    this.ObtenerAsistenciaSesion();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.ObtenerAsistenciaSesion();
  }

  ObtenerAsistenciaSesion() {
    this._OperacionesNotaService
      .ObtenerAsistenciaAlumnoSesion(this.data.IdPespecifico, this.data.IdSesion)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.Asistencias = x;
          // this.tableInfo=x;
          // this.tableInfo.forEach((e:any) => {
          //   e.Acciones=e.UrlWebex==null?'Próximamente':'Unirse'
          // });
          console.log(this.Asistencias);
        },
      });
  }

  RegistrarAsistenciaDetalleDocente() {
    this.activarGuardado=true
    console.log(this.Asistencias);
    this.Asistencias.forEach((x: any) => {
      if(x.asistio==null){
        this.activarGuardado=false
      }
    });
    if(this.activarGuardado==true){
      if (this.charge == false) {
        this.charge = true;
        this.asistencias = [];
        this.Asistencias.forEach((mat: any) => {
          console.log(mat.asistenciaAlumno);
          this.asistencias.push({
            Id: mat.id,
            IdPEspecificoSesion: this.data.IdSesion,
            IdMatriculaCabecera: mat.idMatriculaCabecera,
            Asistio: mat.asistio,
            Justifico: mat.justifico,
          });
        });
        this._OperacionesAsistenciaService
          .Registrar(this.asistencias, this.data.IdPespecifico, this.data.correo)
          .pipe(takeUntil(this.signal$))
          .subscribe({
            next: (x) => {
              console.log(x);
              console.log(this.asistencias);
              this.charge = false;
              this._SnackBarServiceService.openSnackBar(
                'Se guardo correctamente',
                'x',
                5,
                'snackbarCrucigramaSucces'
              );
              // this.CorregirAsistencias()
              this.dialogRef.close();

            },
            error: (e) => {
              console.log(e);
              this._SnackBarServiceService.openSnackBar(
                'Ocurrio un error , intentelo nuevamente mas tarde',
                'x',
                10,
                'snackbarCrucigramaerror'
              );
              this.charge = false;
            },
            complete:()=>{

            }
          });
      }
    }
    else{
      this._SnackBarServiceService.openSnackBar(
        'Debe completar el registro de todos los alumnos',
        'x',
        10,
        'snackbarCrucigramaerror'
      );
    }
  }
  CorregirAsistencias(){
    this._AsistenciaService.RegistrarAsistenciaDocenteCorreccion(this.asistencias, this.data.IdPespecifico, this.data.correo ).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      },
      error:e=>{
        console.log(e)
      },
      complete:()=>{

      }
    })
  }
}
