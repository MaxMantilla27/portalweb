import {Component,Input,OnDestroy,OnInit,SimpleChanges,OnChanges,} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { Subject, takeUntil } from 'rxjs';
import { AsistenciaService } from 'src/app/Core/Shared/Services/Asistencia/asistencia.service';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-asistencias-carreras-profesionales',
  templateUrl: './asistencias-carreras-profesionales.component.html',
  styleUrls: ['./asistencias-carreras-profesionales.component.scss']
})
export class AsistenciasCarrerasProfesionalesComponent implements OnInit, OnDestroy, OnChanges
{
  private signal$ = new Subject();

  constructor(
    private _AsistenciaService: AsistenciaService,
    private _DatosPerfilService: DatosPerfilService,
    private _SessionStorageService:SessionStorageService,

  ) {}

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  @Input() border=true
  @Input() IdMatriculaCabecera = 0;
  @Input() IdPEspecifico = 0;
  @Input() IdTipoProgramaCarrera=0;
  public asistenciaAlumno: Array<any>=[];
  public sesion = 0;
  public sesionesAll: any;
  public TerminaCarga=false;
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdMatriculaCabecera != 0) {
      this.TerminaCarga=false;
      this.ObtenerSesionesOnlineWebinarPorIdPespecifico();
    }
  }
  ObtenerAsistencia() {
    if(this.IdTipoProgramaCarrera==2){
      this._AsistenciaService
      .ObtenerAsistenciaCarrerasProfesionales(this.IdMatriculaCabecera, this.IdPEspecifico)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x)
          this.asistenciaAlumno = [];
          this.asistenciaAlumno = x;
          if (
            this.sesionesAll != null &&
            this.sesionesAll != undefined &&
            this.sesionesAll.length > 0
          ) {
            if (
              this.asistenciaAlumno != null &&
              this.asistenciaAlumno != undefined &&
              this.asistenciaAlumno.length > 0
            ) {
              this.sesionesAll.forEach((s: any) => {
                this.asistenciaAlumno.forEach((a: any) => {
                  if (s.idSesion == a.idPEspecificoSesion) {
                    s.existe = true;
                  }
                });
              });
            }
          }
        },
        complete:()=>{
          this.TerminaCarga=true
        }
      });
    }
    else{
      this._AsistenciaService
      .ObtenerAsistencia(this.IdMatriculaCabecera, this.IdPEspecifico)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x)
          this.asistenciaAlumno = [];
          this.asistenciaAlumno = x;
          if (
            this.sesionesAll != null &&
            this.sesionesAll != undefined &&
            this.sesionesAll.length > 0
          ) {
            if (
              this.asistenciaAlumno != null &&
              this.asistenciaAlumno != undefined &&
              this.asistenciaAlumno.length > 0
            ) {
              this.sesionesAll.forEach((s: any) => {
                this.asistenciaAlumno.forEach((a: any) => {
                  if (s.idSesion == a.idPEspecificoSesion) {
                    s.existe = true;
                  }
                });
              });
            }
          }
        },
        complete:()=>{
          this.TerminaCarga=true
        }
      });
    }
  }

  ObtenerSesionesOnlineWebinarPorIdPespecifico() {
    this._DatosPerfilService
      .ObtenerSesionesOnlineWebinarPorIdPespecifico(this.IdPEspecifico,this.IdMatriculaCabecera)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          this.sesionesAll = x;
          this.ObtenerAsistencia();
        },
      });
  }
}

